// /expenses/<some-id> => /expenses/expense-1, /expenses/e-1

import { redirect, useNavigate } from '@remix-run/react';

import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import {
  deleteExpense,
  getExpense,
  updateExpense,
} from '~/data/expenses.server';
import { validateExpenseInput } from '~/data/validation.server';

export default function UpdateExpensesPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // navigate programmatically
    navigate('..');
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

export async function loader({ params }) {
  const expenseId = params.id;
  const expense = await getExpense(expenseId);
  return expense;
}

export async function action({ request, params }) {
  const expenseId = params.id;
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);

  // METHOD NAME SHOULD BE IN ALL CAPS
  if (request.method === 'PATCH') {
    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
  } else if (request.method === 'DELETE') {
    await deleteExpense(expenseId);
    // return redirect('/expenses');

    // if we just return raw data remix assumes that as a next step it sends a get request to the same URL
    return { deleteId: expenseId };
  }
}


// export function meta({ params, matches, data }) {
//   console.log(data)
//   const expense = matches
//     .find((route) => route.id === 'routes/_app.expenses')
//     ?.data?.find((expense) => expense.id === params.id);
//   return [
//     {
//       title: expense.title,
//       description: 'Update expense.',
//     },
//   ];
// }
