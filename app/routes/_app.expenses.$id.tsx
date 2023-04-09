import type { ActionArgs, V2_MetaFunction, V2_MetaArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { useNavigate, useParams } from "react-router";
import { deleteExpense, updateExpense } from "~/data/expenses.server";
import { useMatches } from "@remix-run/react";
import type { Expense } from "@prisma/client";
import { validateExpenseInput } from "~/data/validation.server";

export const meta: V2_MetaFunction = ({
  params,
  location,
  data,
  matches,
}: V2_MetaArgs) => {
  const expense = matches?.find((match) => match.id === "routes/_app.expenses");
  // console.log(expense?.data.__obj__);

  return [
    {
      title: "title",
      description: "Update expense.",
    },
  ];
};

// /expenses/<some-id> => /expenses/expense-1, /expenses/e-1

export default function UpdateExpensesPage() {
  // const expense = useTypedLoaderData<typeof loader>();
  const params = useParams();
  const matches = useMatches();
  const expenseData = matches?.find(
    (match) => match.id === "routes/_app.expenses"
  );
  const navigate = useNavigate();
  const closeHandler = () => {
    // navigate programmatically
    navigate("..");
  };

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm
        expense={
          expenseData?.data.__obj__?.find(
            (expense: Expense) => expense.id === params.id
          ) ?? null
        }
      />
    </Modal>
  );
}

// export const loader = async (args: LoaderArgs) => {
//   console.log("EXPENSES ID LOADER");
//   const { id } = args.params;
//   const expense = await getExpense(id!);
//   return typedjson(expense);
// };

export async function action({ params, request }: ActionArgs) {
  const { id } = params;

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData) as {
      title: string;
      date: string;
      amount: string;
    };
    try {
      validateExpenseInput({
        title: expenseData.title,
        date: expenseData.date,
        amount: expenseData.amount,
      });
    } catch (error) {
      return error;
    }
    await updateExpense(id!, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    await deleteExpense(id!);
    return { deletedId: id };
  }
}
