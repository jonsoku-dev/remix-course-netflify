import type { V2_MetaFunction } from "@remix-run/node";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { useNavigate } from "react-router";
import { addExpense } from "~/data/expenses.server";
import { redirect } from "@remix-run/node";
import { validateExpenseInput } from "~/data/validation.server";
import { requireUserSession } from "~/data/auth.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function AddExpensesPage() {
  const navigate = useNavigate();
  const closeHandler = () => {
    // navigate programmatically
    navigate("..");
  };
  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm expense={null} />
    </Modal>
  );
}

export async function action({ request, params }: any) {
  const userId = await requireUserSession(request);
  // ready data
  const formData = await request.formData();
  const expenseData: any = Object.fromEntries(formData);

  // validate
  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  // add data
  await addExpense(expenseData, userId);

  // redirect
  return redirect("/expenses", {
    headers: { "set-cookie": "flash=Expense added successfully" },
  });
}
