"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Stomp, Client } from "@stomp/stompjs";
import { userStore } from "@/store/userStore";

const BOTTOM_TEXTAREA_HEIGHT = 120;
const BOTTOM_SEND_HEIGHT = 40;
const BOTTOM_TOTAL_HEIGHT = BOTTOM_TEXTAREA_HEIGHT + BOTTOM_SEND_HEIGHT;

const formatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "numeric",
  minute: "numeric",
  hour12: true, // 오전/오후
});

interface IMessageInfo {
  email: string;
  content: string;
  dateTime: number;
}

export default function Connect() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [messageInfos, setMessageInfos] = useState<IMessageInfo[]>([]);
  const [message, setMessage] = useState("");
  const [isFirst, setIsFirst] = useState<boolean>(true);

  const stompClient = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!message?.trim()) {
      setMessage("");
      return;
    }
    if (!isFirst) {
      if (!message?.trim()) {
        return;
      }
    } else {
      setIsFirst(false);
    }

    const messageInfo: IMessageInfo = {
      email: userStore.getState().user?.email || "",
      content: message,
      dateTime: Date.now(),
    };

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        "/app/send", // 서버의 @MessageMapping 경로에 메시지 전송
        {}, // 헤더 정보
        JSON.stringify(messageInfo) // 메시지 내용 전송
      );
      setMessage(""); // 입력 필드를 비움.
    } else {
      console.error("STOMP client가 연결되지 않았습니다.");
    }
  };

  const onKeyHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (message.trim()) {
        sendMessage();
      }
    }
  };

  useEffect(() => {
    setIsHydrated(true); // client에서만 true
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_APP_FRONT_IP}/ws`);
    const client = Stomp.over(socket);
    stompClient.current = client;

    client.connect({}, () => {
      client.subscribe("/topic/greetings", (msg) => {
        const bodyList = JSON.parse(msg.body);
        console.log("bodyList: ", bodyList);
        setMessageInfos([...bodyList]);

        // DOM 렌더링이 반영된 후에 스크롤 처리
        requestAnimationFrame(() => {
          const contentElem = contentRef.current;
          if (contentElem) {
            contentElem.scrollTo({
              top: contentElem.scrollHeight,
              // behavior: "smooth",
            });
          }
        });
      });

      const messageInfo: IMessageInfo = {
        email: userStore.getState().user?.email || "",
        content: "",
        dateTime: Date.now(),
      };

      // 최초 입장 메시지 전송
      client.send("/app/send", {}, JSON.stringify(messageInfo));
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  if (!isHydrated) {
    return null; // 또는 로딩 스피너, 플레이스홀더 등
  }

  const isMe = (email: string) => {
    return userStore.getState().user?.email === email;
  };

  const formatTime = (timestamp: number) => {
    const formatted = formatter.format(timestamp);
    const isAm = formatted.includes("오전");
    const timeOnly = formatted.replace(/(오전|오후)\s*/, "");
    return `[${isAm ? "오전" : "오후"}] ${timeOnly}`;
  };

  return (
    <>
      <div className="chat flex flex-col  h-screen bg-kakao-blue ">
        <div className="absolute left-[50%]">
          <div>이메일: {userStore?.getState()?.user?.email}</div>
        </div>
        <div
          className={`content overflow-y-auto flex-1
          }`}
          ref={contentRef}
        >
          <div className="messages">
            {messageInfos.map((messageInfo, i) => (
              <Fragment key={i}>
                <div
                  className={`flex items-end ${
                    isMe(messageInfo.email) ? "justify-end" : "justify-start"
                  } m-1 mt-2`}
                >
                  <div
                    className={`${
                      isMe(messageInfo.email) ? "bg-kakao" : "bg-white"
                    } max-w-[300px] break-all  p-[4px] pl-[8px] pr-[8px] rounded-sm order-${
                      isMe(messageInfo.email) ? 2 : 1
                    }
                    } text-[14px]`}
                  >
                    {messageInfo.content}
                  </div>
                  <div
                    className={`datetime text-gray-700 text-[11px] ml-1 mr-1 order-${
                      isMe(messageInfo.email) ? 1 : 2
                    }
                    }`}
                  >
                    {formatTime(messageInfo.dateTime)}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <textarea
            className="w-full h-28 p-2 border rounded-t-sm resize-none hover:outline-red-100 border-none
             focus:outline-none focus:ring-0 focus:border-none"
            placeholder="텍스트를 입력하세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyHandler}
            autoFocus
          ></textarea>

          <div
            className={`send-extra w-full bg-white bottom-[0px] h-[${BOTTOM_SEND_HEIGHT}px] flex items-center justify-end`}
          >
            <button
              className={`${
                message ? "bg-kakao" : "bg-gray-200"
              } p-[8px] w-[64px] rounded`}
              disabled={!message}
              onClick={sendMessage}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
