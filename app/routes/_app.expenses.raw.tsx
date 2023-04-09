import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { getExpenses } from "~/data/expenses.server";
import { requireUserSession } from "~/data/auth.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export async function loader(args: LoaderArgs) {
  const userId = await requireUserSession(args.request);
  return getExpenses(userId);
}
