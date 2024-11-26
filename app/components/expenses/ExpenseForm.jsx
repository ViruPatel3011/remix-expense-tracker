import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  // useMatches,
  useNavigation,
  useParams,
  // useParams,
} from '@remix-run/react';

function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const expenseData = useLoaderData();
  const navigation = useNavigation();

  const params = useParams();
  // const matches = useMatches();
  // const expenses = matches.find(
  //   (match) => match.id === 'routes/_app.expenses'
  // ).data;
  // const expenseData = expenses?.find((expense) => expense.id === params.id);

  if (params.id && !expenseData) {
    // throw new Response();
    return <p>Invalid expense id.</p>;
  }

  const defaultValue = expenseData
    ? {
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
      }
    : {
        title: '',
        amount: '',
        date: '',
      };

  const isSubmitting = navigation.state !== 'idle';

  // Submitting form programmatically (in normal form : <form></form> )
  // const submit = useSubmit();

  // function submitHandler(event) {
  //   event.preventDefault();

  //   submit(event.target, {
  //     // action: '/expenses/add',
  //     method: 'post',
  //   });
  // }

  return (
    // With regular form browser generate requests--> loaded a page
    // With this form , remix handle and generates requests --> follow single page application
    <Form
      method={expenseData ? 'patch' : 'post'}
      className='form'
      id='expense-form'
      // onSubmit={submitHandler}
    >
      <p>
        <label htmlFor='title'>Expense Title</label>
        <input
          type='text'
          id='title'
          name='title'
          required
          maxLength={30}
          defaultValue={defaultValue.title}
        />
      </p>

      <div className='form-row'>
        <p>
          <label htmlFor='amount'>Amount</label>
          <input
            type='number'
            id='amount'
            name='amount'
            min='0'
            step='0.01'
            required
            defaultValue={defaultValue.amount}
          />
        </p>
        <p>
          <label htmlFor='date'>Date</label>
          <input
            type='date'
            id='date'
            name='date'
            max={today}
            required
            defaultValue={
              defaultValue.date
                ? new Date(defaultValue.date).toISOString().slice(0, 10)
                : ''
            }
          />
        </p>
      </div>

      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className='form-actions'>
        <button disabled={isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Save Expense'}
        </button>
        <Link to='/expenses'>Cancel</Link>
      </div>
    </Form>
  );
}

export default ExpenseForm;
