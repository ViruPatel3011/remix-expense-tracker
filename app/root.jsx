import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import { isErrorResponse } from '@remix-run/react/dist/data';

import sharedStyles from '~/styles/shared.css?url';
import Error from './components/util/Error';

export const meta = () => [
  {
    charset: 'utf-8',
    title: 'RemixExpenses',
    viewport: 'width=device-width,initial-scale=1',
  },
];

function Document({ title, children }) {
   const matches = useMatches();

   const disableJS = matches.some((match) => match.handle?.disableJS);

  return (
    <html lang='en'>
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJS && <Scripts />}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function CatchBoundary({ error }) {
  return (
    <Document title={error.statusText}>
      <main>
        <Error title={error.statusText}>
          <p>
            {error.data?.message ||
              'Something went wrong. Please try again later.'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const response = isErrorResponse(error); // when true, this is what used to go to `CatchBoundary`
  if (response) {
    return <CatchBoundary error={error} />;
  }
  return (
    <Document title='An error occurred'>
      <main>
        <Error title={error.statusText}>
          <p>
            {error.data.message ||
              'Something went wrong. Please try again later.'}
          </p>
          <p>
            Back to <Link to='/'>safety</Link>.
          </p>
        </Error>
      </main>
    </Document>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: sharedStyles }];
}
