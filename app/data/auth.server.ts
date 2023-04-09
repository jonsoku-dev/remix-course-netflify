import { compare, hash } from "bcryptjs";

import { prisma } from "./database.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/server-runtime/dist/routeModules";

const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET!],
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectPath: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

type Credentials = {
  email: string;
  password: string;
};

export async function signup({ email, password }: Credentials) {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    const error: any = new Error(
      "A user with the provided email address exists already."
    );
    error.status = 422;
    throw error;
  }

  const passwordHash = await hash(password, 12);

  const newUser = await prisma.user.create({
    data: { email: email, password: passwordHash },
  });

  return newUser;
}

export async function login({ email, password }: Credentials) {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (!existingUser) {
    const error: any = new Error(
      "A user with the provided email address does not exist."
    );
    error.status = 401;
    throw error;
  }

  const passwordMatch = await compare(password, existingUser.password);
  if (!passwordMatch) {
    const error: any = new Error("The provided password is incorrect.");
    error.status = 401;
    throw error;
  }

  return existingUser;
}

export async function getUserFromSession(request: DataFunctionArgs["request"]) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const userId = session.get("userId");

  if (!userId) {
    return null;
  }

  return userId;
}

export async function destroyUserSession(request: DataFunctionArgs["request"]) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(request: DataFunctionArgs["request"]) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    /**
     * 1. 실제 error boundary 에 잡히지 않는다.
     * 2. Redirection 을 해도 중첩 라우트에서 loader 는 실행이 되어버린다.
     */
    throw redirect("/auth?mode=login");
  }
  return userId;
}
