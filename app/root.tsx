import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from "@remix-run/react";
import sharedStyles from "~/styles/shared.css";
import React from "react";
import Error from "~/components/util/Error";
import { useAsyncError } from "react-router/dist/lib/hooks";
import { isErrorWithMessage } from "~/libs/error";

function Document({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const matches = useMatches();
  const disableJS = matches.some((match) => match.handle?.disableJS);
  console.log({ disableJS });
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document title={error.data.message}>
        <Error title={error.data.message}>
          <h1>Oops</h1>
          <p>Status: {error.status}</p>
          <p>{error.data.message}</p>
        </Error>
      </Document>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";

  if (isErrorWithMessage(error)) {
    errorMessage = error.message;
  }

  return (
    <Document title="Something went wrong.">
      <Error title={errorMessage}>
        <div>
          <h1>Uh oh ...</h1>
          <p>Something went wrong.</p>
          <pre>{errorMessage}</pre>
        </div>
      </Error>
    </Document>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: sharedStyles }];
}
