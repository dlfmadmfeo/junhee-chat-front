"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Stomp, Client } from "@stomp/stompjs";

const BOTTOM_TEXTAREA_HEIGHT = 120;
const BOTTOM_SEND_HEIGHT = 40;
const BOTTOM_TOTAL_HEIGHT = BOTTOM_TEXTAREA_HEIGHT + BOTTOM_SEND_HEIGHT;

export default function Connect() {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isMe, setIsMe] = useState<boolean>(true);

  const stompClient = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openChat = () => {};

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

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.send(
        "/app/send", // 서버의 @MessageMapping 경로에 메시지 전송
        {},
        JSON.stringify({ content: message }) // 메시지 내용 전송
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
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_APP_FRONT_IP}/ws`);
    const client = Stomp.over(socket);
    stompClient.current = client;

    client.connect({}, () => {
      client.subscribe("/topic/greetings", (msg) => {
        const bodyList = JSON.parse(msg.body);
        setMessages([...bodyList]);

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

      // 최초 입장 메시지 전송
      client.send("/app/send", {}, JSON.stringify({ content: "" }));
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div className="chat flex flex-col  h-screen bg-kakao-blue ">
        <div
          className={`content overflow-y-auto flex-1
          }`}
          ref={contentRef}
        >
          <div className="messages">
            {messages.map((message, i) => (
              <Fragment key={i}>
                <div
                  className={`flex items-end ${
                    isMe ? "justify-end" : "justify-start"
                  } m-1 mt-2`}
                >
                  <div
                    className={`${
                      isMe ? "bg-kakao" : "bg-white"
                    } max-w-[300px] break-all  p-[4px] pl-[8px] pr-[8px] rounded-sm order-2
                    } text-[14px]`}
                  >
                    {message}
                  </div>
                  <div
                    className={`datetime text-gray-700 text-[11px] ml-1 mr-1 order-1
                    }`}
                  >
                    [오후] 7시 10분
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
