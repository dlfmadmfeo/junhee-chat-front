"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { saveUser, ISaveUser } from "@/app/utils/api";
import { userStore } from "@/store/userStore";

interface IForm {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

const defaultForm: IForm = {
  name: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
};

export default function SignUp() {
  const [form, setForm] = useState<IForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<IForm>>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<IForm> = {};

    if (!form.email.includes("@")) {
      newErrors.email = "유효한 이메일을 입력하세요.";
    }

    if (form.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!form.name.trim()) {
      newErrors.name = "이름을 입력하세요.";
    }

    if (!/^01[0-9]{8,9}$/.test(form.phone)) {
      newErrors.phone = "유효한 전화번호를 입력하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 실제 서버로 전송 or 리디렉션 처리
      const response: any = await saveUser(form);
      console.log("response: ", response);      
      if (response.success) {
        alert("회원가입 완료.");
        router.replace("/kakao/login");
      }
    }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-[90%] max-w-sm space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            회원가입
          </h2>

          <input
            name="email"
            type="email"
            placeholder="이메일"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}

          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword}
            </span>
          )}

          <input
            name="name"
            type="text"
            placeholder="이름"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}

          <input
            name="phone"
            type="tel"
            placeholder="전화번호"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  );
}
