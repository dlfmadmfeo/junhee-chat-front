"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { userLogin, IUser } from "@/app/utils/api";
import { userStore } from "@/store/userStore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    const user: IUser = {
      password: password,
      email: email,
    };
    const response: any = await userLogin(user);
    console.log("response: ", response);
    if (response.success) {
      userStore.getState().setUser({
        email,
      });
      router.push("/kakao/connect");
    }
  };

  const signUp = () => {
    router.push("/kakao/signup");
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-[100%] max-w-sm space-y-4">
          {/* <div className="image h-[200px] flex items-center justify-center">
            <img src="/images/kakao-talk-1.png" alt="" height={80} width={80} />
          </div> */}

          <h2 className="text-xl font-semibold text-gray-700 text-center">
            로그인
          </h2>

          <div className="mb-2">
            <input
              type="text"
              placeholder="이메일"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="submit mt-20">
            <button
              className="bg-white w-[100%] p-[14px] text-md bg-green-500 hover:bg-green-600 focus:outline-red-300 rounded-[8px] text-white"
              onClick={login}
            >
              로그인
            </button>
          </div>
          <div className="mt-[4px]">
            <button className="text-sm" onClick={signUp}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
