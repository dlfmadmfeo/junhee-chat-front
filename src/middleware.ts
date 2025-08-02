import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access-token")?.value;
  const pathname = req.nextUrl.pathname;
  const urls = ["/kakao/login", "/kakao/signup"];

  console.log("token: ", token);
  console.log("pathname: ", pathname);

  if (!token && !urls.includes(pathname)) {
    return NextResponse.redirect(new URL("/kakao/login", req.url));
  }

  return NextResponse.next();
}

// middleware가 적용될 경로 설정
export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static).*)"],
};
