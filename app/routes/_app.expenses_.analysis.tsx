import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import ExpenseStatistics from "~/components/expenses/ExpenseStatistics";
import Chart from "~/components/expenses/Chart";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getExpenses } from "~/data/expenses.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { isErrorWithMessage } from "~/libs/error";
import Error from "~/components/util/Error";
import { requireUserSession } from "~/data/auth.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

// /expenses/analysis

export default function ExpensesAnalysisPage() {
  const expensesData = useTypedLoaderData<typeof loader>();
  return (
    <main>
      <Chart expenses={expensesData} />
      <ExpenseStatistics expenses={expensesData} />
    </main>
  );
}

export const loader = async (args: LoaderArgs) => {
  const userId = await requireUserSession(args.request);
  const expenses = await getExpenses(userId);
  if (!expenses || expenses.length === 0) {
    throw typedjson(
      { message: "No expenses found" },
      { status: 404, statusText: "No Responses" }
    );
  }
  return typedjson(expenses);
};

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <Error title={error.data.message}>
          <h1>Oops</h1>
          <p>Status: {error.status}</p>
          <p>{error.data.message}</p>
        </Error>
      </main>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";

  if (isErrorWithMessage(error)) {
    errorMessage = error.message;
  }

  return (
    <main>
      <Error title={errorMessage}>
        <h1>Uh oh ...</h1>
        <p>Something went wrong.</p>
        <pre>{errorMessage}</pre>
      </Error>
    </main>
  );
}
