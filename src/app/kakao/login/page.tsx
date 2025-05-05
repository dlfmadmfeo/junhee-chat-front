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
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-kakao w-full h-screen sm:w-[400px] sm:h-[600px] text-center">
          <div className="header w-full h-[10px]"></div>
          <div className="image h-[200px] flex items-center justify-center">
            <img src="/images/kakao-talk-1.png" alt="" height={80} width={80} />
          </div>
          <div className="center">
            <div className="form">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="이메일 또는 전화번호"
                  className="w-[60%] p-[12px] text-sm focus:outline-none"
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
                  className="w-[60%] p-[12px] text-sm focus:outline-none"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
              <div className="submit mt-20">
                <button
                  className="bg-white w-[60%] p-[12px] text-md bg-gray-200 hover:bg-gray-300 rounded-md"
                  onClick={login}
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
