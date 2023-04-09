import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import expensesStyles from "~/styles/expenses.css";
import React from "react";
import ExpensesList from "~/components/expenses/ExpensesList";
import { FaPlus, FaDownload } from "react-icons/fa";
import { getExpenses } from "~/data/expenses.server";
import type { LoaderArgs, HeadersFunction } from "@remix-run/node";
import type { Expense } from "@prisma/client";
import { json } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Error from "~/components/util/Error";
import { isErrorWithMessage } from "~/libs/error";
import { requireUserSession } from "~/data/auth.server";

export default function ExpensesPage() {
  // const expenses = useLoaderData<typeof loader>();
  const expenses = useTypedLoaderData<typeof loader>();
  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found.</h1>
            <p>
              Start <Link to={"add"}>adding some</Link>today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: expensesStyles }];
}

// export const loader = async (args: LoaderArgs) => {
//   const expenses = await getExpenses();
//   return json(expenses);
// };

export const loader = async (args: LoaderArgs) => {
  const userId = await requireUserSession(args.request);
  console.log("EXPENSES LOADER");
  const expenses = await getExpenses(userId);
  // if (expenses.length === 0) {
  //   throw typedjson(
  //     { message: "No expenses found" },
  //     { status: 404, statusText: "No Responses" }
  //   );
  // }
  return typedjson(expenses, {
    status: 200,
    statusText: "OK",
    headers: {
      "Cache-Control": "max-age=3",
    },
  });
};

export const headers: HeadersFunction = ({
  loaderHeaders,
  parentHeaders,
  actionHeaders,
}) => {
  return {
    // loader에서 심어놓은 헤더에서 가져온다. 이것은 클라이언트 랜더링에서 유용함?
    "Cache-Control": loaderHeaders.get("Cache-Control") || "",
  };
};

// export function ErrorBoundary() {
//   const error = useRouteError();
//
//   // when true, this is what used to go to `CatchBoundary`
//   if (isRouteErrorResponse(error)) {
//     return (
//       <Error title={error.data.message}>
//         <h1>Oops</h1>
//         <p>Status: {error.status}</p>
//         <p>{error.data.message}</p>
//       </Error>
//     );
//   }
//
//   // Don't forget to typecheck with your own logic.
//   // Any value can be thrown, not just errors!
//   let errorMessage = "Unknown error";
//
//   if (isErrorWithMessage(error)) {
//     errorMessage = error.message;
//   }
//
//   return (
//     <Error title={errorMessage}>
//       <div>
//         <h1>Uh oh ...</h1>
//         <p>Something went wrong.</p>
//         <pre>{errorMessage}</pre>
//       </div>
//     </Error>
//   );
// }
