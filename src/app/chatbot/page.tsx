// "use client";
// import { useState } from "react";

// export default function ChatBox() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>(
//     []
//   );

//   async function sendMessage() {
//     setMessages([...messages, { role: "user", content: input }]);
//     const res = await fetch("/api/ai", {
//       method: "POST",
//       body: JSON.stringify({ message: input }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const data = await res.json();

//     setMessages((prev) => [
//       ...prev,
//       { role: "assistant", content: data.reply },
//     ]);
//     setInput("");
//   }

//   return (
//     <div className="p-4">
//       <div className="h-64 overflow-y-auto border rounded p-2 mb-2">
//         {messages.map((m, i) => (
//           <p
//             key={i}
//             className={m.role === "user" ? "text-blue-600" : "text-green-600"}
//           >
//             <b>{m.role}:</b> {m.content}
//           </p>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border px-2 rounded"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-3 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
