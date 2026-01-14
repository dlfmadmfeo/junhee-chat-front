"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Stomp, Client } from "@stomp/stompjs";
import { userStore } from "@/store/userStore";

let retryTimeout: NodeJS.Timeout;

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
  return <></>
  // const [isHydrated, setIsHydrated] = useState(false);
  // const [messageInfos, setMessageInfos] = useState<IMessageInfo[]>([]);
  // const [message, setMessage] = useState("");
  // const [isFirst, setIsFirst] = useState<boolean>(true);

  // const stompClient = useRef<any>(null);
  // const contentRef = useRef<HTMLDivElement | null>(null);

  // const sendMessage = () => {
  //   if (!message?.trim()) {
  //     setMessage("");
  //     return;
  //   }
  //   if (!isFirst) {
  //     if (!message?.trim()) {
  //       return;
  //     }
  //   } else {
  //     setIsFirst(false);
  //   }

  //   const messageInfo: IMessageInfo = {
  //     email: userStore.getState().user?.email || "",
  //     content: message,
  //     dateTime: Date.now(),
  //   };

  //   if (stompClient.current && stompClient.current.connected) {
  //     stompClient.current.publish({
  //       destination: "/app/send", // 서버의 @MessageMapping 경로에 메시지 전송
  //       body: JSON.stringify(messageInfo),
  //       headers: {},
  //     });
  //     setMessage(""); // 입력 필드를 비움.
  //   } else {
  //     console.error("STOMP client가 연결되지 않았습니다.");
  //   }
  // };

  // const onKeyHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();

  //     if (message.trim()) {
  //       sendMessage();
  //     }
  //   }
  // };

  // const setupClient = () => {
  //   const client = new Client({
  //     webSocketFactory: () =>
  //       new SockJS(`${process.env.NEXT_PUBLIC_APP_FRONT_IP}/ws`),
  //     reconnectDelay: 5000, // 끊기면 5초 후 자동 재연결
  //     heartbeatIncoming: 10000, // 서버가 보내는 하트비트 (10초마다 감지)
  //     heartbeatOutgoing: 10000, // 클라이언트가 보내는 하트비트
  //     onConnect: () => {
  //       client.subscribe("/topic/greetings", (msg) => {
  //         const bodyList = JSON.parse(msg.body);
  //         console.log("bodyList: ", bodyList);
  //         setMessageInfos([...bodyList]);

  //         requestAnimationFrame(() => {
  //           const contentElem = contentRef.current;
  //           if (contentElem) {
  //             contentElem.scrollTo({
  //               top: contentElem.scrollHeight,
  //             });
  //           }
  //         });
  //       });

  //       // 최초 입장 메시지 전송
  //       const messageInfo: IMessageInfo = {
  //         email: userStore.getState().user?.email || "",
  //         content: "",
  //         dateTime: Date.now(),
  //       };
  //       client.publish({
  //         destination: "/app/send",
  //         body: JSON.stringify(messageInfo),
  //       });
  //     },
  //     onStompError: (frame) => {
  //       console.error("STOMP error", frame);
  //       retryTimeout = setTimeout(() => {
  //         client.deactivate();
  //         setupClient();
  //       }, 5000);
  //     },
  //     onWebSocketError: (event) => {
  //       console.error("WebSocket error", event);
  //     },
  //   });
  //   stompClient.current = client;
  //   client.activate();
  // };

  // useEffect(() => {
  //   setupClient();
  //   return () => {
  //     clearTimeout(retryTimeout);
  //     stompClient.current?.deactivate();
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       console.log("탭 포커스됨. 연결 상태 확인");
  //       if (!stompClient.current?.connected) {
  //         stompClient.current?.activate(); // 재연결 시도
  //       }
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   setIsHydrated(true); // client에서만 true
  // }, []);

  // if (!isHydrated) {
  //   return null; // 또는 로딩 스피너, 플레이스홀더 등
  // }

  // const isMe = (email: string) => {
  //   return userStore.getState().user?.email === email;
  // };

  // const formatTime = (timestamp: number) => {
  //   const formatted = formatter.format(timestamp);
  //   const isAm = formatted.includes("오전");
  //   const timeOnly = formatted.replace(/(오전|오후)\s*/, "");
  //   return `[${isAm ? "오전" : "오후"}] ${timeOnly}`;
  // };

  // return (
  //   <>
  //     <div className="chat flex flex-col  h-screen bg-kakao-blue ">
  //       <div
  //         className={`content overflow-y-auto flex-1
  //         }`}
  //         ref={contentRef}
  //       >
  //         <div className="messages">
  //           {messageInfos.map((messageInfo, i) => (
  //             <Fragment key={i}>
  //               <div
  //                 className={`flex items-end ${
  //                   isMe(messageInfo.email) ? "justify-end" : "justify-start"
  //                 } m-1 mt-2`}
  //               >
  //                 <div
  //                   className={`${
  //                     isMe(messageInfo.email)
  //                       ? "bg-kakao order-2"
  //                       : "bg-white max-w-[300px] break-all  p-[4px] pl-[8px] pr-[8px] rounded-sm order-1"
  //                   } max-w-[300px] break-all  p-[4px] pl-[8px] pr-[8px] rounded-sm text-[14px]`}
  //                 >
  //                   {messageInfo.content}
  //                 </div>
  //                 <div
  //                   className={`datetime text-gray-700 text-[11px] ml-1 mr-1 ${
  //                     isMe(messageInfo.email) ? "order-1" : "order-2"
  //                   }`}
  //                 >
  //                   {formatTime(messageInfo.dateTime)}
  //                 </div>
  //               </div>
  //             </Fragment>
  //           ))}
  //         </div>
  //       </div>
  //       <div className="flex flex-col">
  //         <textarea
  //           className="w-full h-28 p-2 border rounded-t-sm resize-none hover:outline-red-100 border-none
  //            focus:outline-none focus:ring-0 focus:border-none"
  //           placeholder="텍스트를 입력하세요."
  //           value={message}
  //           onChange={(e) => setMessage(e.target.value)}
  //           onKeyDown={onKeyHandler}
  //           autoFocus
  //         ></textarea>

  //         <div
  //           className={`send-extra w-full bg-white bottom-[0px] h-[${BOTTOM_SEND_HEIGHT}px] flex items-center justify-end`}
  //         >
  //           <button
  //             className={`${
  //               message ? "bg-kakao" : "bg-gray-200"
  //             } p-[8px] w-[64px] rounded`}
  //             disabled={!message}
  //             onClick={sendMessage}
  //           >
  //             전송
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
