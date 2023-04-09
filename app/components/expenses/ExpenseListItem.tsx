import { Form, Link, useSubmit } from "@remix-run/react";
import { useTypedFetcher } from "remix-typedjson";

function ExpenseListItem({ id, title, amount }: any) {
  // const submit = useSubmit();
  const fetcher = useTypedFetcher();

  function deleteExpenseItemHandler() {
    const proceed = confirm("Are you sure you want to delete this expense?");

    // submit(null, {
    //   method: "delete",
    //   action: `/expenses/${id}`,
    // });

    if (!proceed) return;
    fetcher.submit(null, {
      method: "delete",
      action: `/expenses/${id}`,
    });
  }

  if (fetcher.state !== "idle") {
    return (
      <article className="expense-item locked">
        <p>Deleting ...</p>
      </article>
    );
  }

  return (
    <article className="expense-item">
      <div>
        <h2 className="expense-title">{title}</h2>
        <p className="expense-amount">${amount.toFixed(2)}</p>
      </div>
      <menu className="expense-actions">
        {/*<Form method="delete" action={`/expenses/${id}`}>*/}
        <button onClick={deleteExpenseItemHandler}>Delete</button>
        {/*</Form>*/}
        <Link to={id}>Edit</Link>
      </menu>
    </article>
  );
}

export default ExpenseListItem;
