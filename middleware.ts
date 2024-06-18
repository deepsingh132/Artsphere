import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const decodeJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );
    return payload;
  } catch (error) {
    return null;
  }
};

async function checkAuth(request: Request) {
  const response = NextResponse.next();
  const bearer = request.headers.get("Authorization");

  if (!bearer) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  const token = bearer.split(" ")[1];
  const payload = await decodeJWT(token);

  // add the decoded user id to the request header
  response.headers.append("userId", payload?._id as string);

  if (request.method === "GET" && !payload) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  if (request.method === "DELETE" && payload) {
      return response;
  }

  if (request.method === "POST" || request.method === "PUT") {
    try {
      const data = (await request.json()) || null;
      const userId = data?.userId || data?.authorID || null;

      if (!payload || payload?._id !== userId || !token) {
        return NextResponse.json(
          { message: "Not authorized" },
          { status: 401 }
        );
      }
      return response;
    } catch (error) {
      console.error("Error: ", error);
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
  }
  return response; // return the response object with the headers
}

export async function middleware(request: Request) {
  const response = NextResponse.next();
  response.headers.append("Access-Control-Allow-Headers", "Authorization");
  response.headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  //add local host and vercel url
  response.headers.append(
    "Access-Control-Allow-Origin",
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}` || "http://localhost:3000"
  );

  // middleware for private routes
  if (request.url.includes("/like")) {
    return checkAuth(request);
  }
  if (request.url.includes("/events")) {
    return checkAuth(request);
  }
  if (
    request.url.includes("/posts") &&
    (request.method === "POST" || request.method === "DELETE")
  ) {
    return checkAuth(request);
  }
  if (
    request.url.includes("/comment") &&
    (request.method === "PUT" || request.method === "DELETE")
  ) {
    return checkAuth(request);
  }
  if (request.url.includes("/user") && request.method === "PUT") {
    return checkAuth(request);
  }
  if (request.url.includes("/full")) {
    return checkAuth(request);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
