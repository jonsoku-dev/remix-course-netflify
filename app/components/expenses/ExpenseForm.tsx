import {
  Form,
  Link,
  useActionData,
  useMatches,
  useNavigation,
} from "@remix-run/react";
import React from "react";
import type { Expense } from "@prisma/client";
import { useParams } from "react-router";

interface ExpenseFormProps {
  expense: Expense | null;
}

const ExpenseForm = ({ expense }: ExpenseFormProps) => {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  // const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const params = useParams();

  if (params.id && !expense) {
    return <p>Invalid expense id</p>;
  }

  return (
    <Form
      method={expense ? "patch" : "post"}
      className="form"
      id="expense-form"
      // onSubmit={(event) => {
      //   // Preventing the page from reloading
      //   event.preventDefault();
      //   submit(event.target, {
      //     // action: '/expenses/add',
      //     method: "post",
      //   });
      // }}
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={expense?.title ?? ""}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={expense?.amount ?? 0}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={
              expense?.date ? expense.date.toISOString().slice(0, 10) : ""
            }
          />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error: any, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Saving ..." : "Save Expense"}
        </button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
};

export default ExpenseForm;
