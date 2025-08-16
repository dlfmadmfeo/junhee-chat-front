import { useRouter } from "next/navigation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "@/app/kakao/login/page";
import * as api from "@/app/utils/api";
import { userStore } from "@/store/userStore";

// page.test.tsx 또는 test 파일 상단
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/utils/api", () => ({
  userLogin: jest.fn(),
}));

jest.mock("@/store/userStore", () => ({
  userStore: {
    getState: () => ({
      setUser: jest.fn(),
    }),
  },
}));

describe("Login Component", () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    window.alert = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
      push: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  test("이메일 없으면 alert 발생", () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(window.alert).toHaveBeenCalledWith("이메일을 입력하세요.");
  });

  test("비번 없으면 alert 발생", () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("이메일"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(window.alert).toHaveBeenCalledWith("비밀번호를 입력하세요.");
  });

  test("로그인 프로세스", async () => {
    render(<Login />);
    (api.userLogin as jest.Mock).mockResolvedValue({ success: true });

    fireEvent.change(screen.getByPlaceholderText("이메일"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(api.userLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "1234",
      });
      // expect(userStore.getState().setUser).toHaveBeenCalledWith({
      //   email: "test@example.com",
      // });
      expect(replaceMock).toHaveBeenCalledWith("/kakao/connect");
    });
  });

  test("회원가입 버튼 클릭 시 /kakao/signup 으로 이동", () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: "회원가입" }));
    expect(replaceMock).toHaveBeenCalledWith("/kakao/signup");
  });
});
