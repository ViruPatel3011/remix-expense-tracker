// /expenses => shared layout

import { json, Link, Outlet, useLoaderData } from '@remix-run/react';
import { FaPlus, FaDownload } from 'react-icons/fa';

import ExpensesList from '~/components/expenses/ExpensesList';
import { getExpenses } from '~/data/expenses.server';

export default function ExpensesLayout() {
  const expensesList = useLoaderData();
  const hasExpenses = expensesList && expensesList.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id='expenses-actions'>
          <Link to='add'>
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href='/expenses/raw'>
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expensesList} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="add">adding some</Link> today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

// loader always executed on the backend
export async function loader() {
  const expenses = await getExpenses();
  return json(expenses);
  // return expenses; //We can simply return this raw data also. n this approach remix behind the scene wrap this in response. Technically your loader must return response
}
