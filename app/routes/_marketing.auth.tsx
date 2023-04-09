import type {
  ActionArgs,
  V2_MetaFunction,
  HeadersFunction,
} from "@remix-run/node";
import authStyles from "~/styles/auth.css";
import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import { validateCredentials } from "~/data/validation.server";
import { createUserSession, login, signup } from "~/data/auth.server";
import { redirect } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function AuthPage() {
  return <AuthForm />;
}

export async function action({ request }: ActionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData) as any;

  // validate user input
  try {
    validateCredentials(credentials);
  } catch (error) {
    return error;
  }

  try {
    if (authMode === "login") {
      // login logic
      const user = await login(credentials);
      return createUserSession(user.id, "/expenses");
    } else {
      const user = await signup(credentials);
      return createUserSession(user.id, "/expenses");
    }
  } catch (error: any) {
    if (error.status === 422) {
      return { credentials: error.message };
    }
  }
}

export function links() {
  return [{ rel: "stylesheet", href: authStyles }];
}

export const headers: HeadersFunction = ({
  loaderHeaders,
  parentHeaders,
  actionHeaders,
}) => {
  return {
    "Cache-Control": parentHeaders.get("Cache-Control") || "",
  };
};
