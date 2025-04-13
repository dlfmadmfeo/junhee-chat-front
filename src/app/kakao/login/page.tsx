"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-kakao w-[400px] h-[600px] text-center">
          <div className="header w-full h-[10px]"></div>
          <div className="image h-[200px] flex items-center justify-center">
            {/* <Image src={"/images/kakao-talk-1.png"} height={50} width={50} alt=""/> */}
            <img src="/images/kakao-talk-1.png" alt="" height={80} width={80} />
          </div>
          <div className="center">
            <div className="form">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="이메일 또는 전화번호"
                  className="w-[200px] p-2 text-sm"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="비밀번호"
                  className="w-[200px] p-2 text-sm"
                />
              </div>
              <div className="submit mt-20">
                <button
                  className="bg-white w-[200px] pt-2 pb-2 text-sm hover:bg-gray-200"
                  onClick={() => router.push("/kakao/connect")}
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
