// /expenses/analysis

import ExpenseStatistics from '~/components/expenses/ExpenseStatistics';
import Chart from '~/components/expenses/Chart';
import { getExpenses } from '~/data/expenses.server';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import Error from '~/components/util/Error';
import { requireUserSession } from '~/data/auth.server';

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData();

  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw json(
      { message: 'Could not load expenses for the requested analysis.' },
      {
        status: 404,
        statusText: 'Expenses not found',
      }
    );
  }

  return expenses; // return json(expenses);
}

export function ErrorBoundary() {
  const error = useRouteError();
  const response = isRouteErrorResponse(error);

  let title = 'Error!';
  let message = 'Something went wrong - could not load expenses.';
  if (response) {
    title ??= error.statusText;
    message ??= error.data?.message;
  }

  return (
    <main>
      <Error title={title}>
        <p>{message}</p>
      </Error>
    </main>
  );
}
