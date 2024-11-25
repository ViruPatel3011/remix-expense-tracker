import { Form, Link, useFetcher, useSubmit } from '@remix-run/react';

function ExpenseListItem({ id, title, amount }) {
  // const submit = useSubmit();

  // using fetcher you can load or submit any kinds of request behind the scenes without triggering subsequent triggers
  // on button clicked if you don't want to navigate to different page then useFetcher is best way.
  const fetcher = useFetcher();

  function deleteExpenseItemHandler() {
    const proceed = confirm('Are you sure? Do you want to delete this item?');
    // submit is programmatically equivalent to form
    // submit(null, {
    //   method: 'delete',
    //   action: `/expenses/${id}`,
    // });
    if (!proceed) {
      return;
    }
    fetcher.submit(null, {
      method: 'delete',
      action: `/expenses/${id}`,
    });
  }
  if (fetcher.state !== 'idle') {
    return <article className='expense-item locked'>Deleting..</article>;
  }

  return (
    <article className='expense-item'>
      <div>
        <h2 className='expense-title'>{title}</h2>
        <p className='expense-amount'>${amount.toFixed(2)}</p>
      </div>
      <menu className='expense-actions'>
        <button onClick={deleteExpenseItemHandler}>Delete</button>
        {/* Regular form only containes get and post method */}
        {/* <Form method='delete' action={`/expenses/${id}`}>
          <button>Delete</button>
        </Form> */}
        <Link to={id}>Edit</Link>
      </menu>
    </article>
  );
}

export default ExpenseListItem;
