import { redirect } from '@remix-run/react';
import AuthForm from '~/components/auth/AuthForm';
import { signUp } from '~/data/auth.server';
import { validateCredentials } from '~/data/validation.server';
import authStyles from '~/styles/auth.css?url';

export default function AuthPage() {
  return <AuthForm />;
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    validateCredentials(credentials);
  } catch (error) {
    return error; // if you return data in your action you can use that action with useActionData hook
  }

  try {
    if (authMode === 'login') {
      //login code
    } else {
      await signUp(credentials);
      return redirect('/expenses');
    }
  } catch (error) {
    if (error.status === 422) {
      return { credentials: error.message };
    }
    return { credentials: 'Invalid username or password.' };
  }
}

export function links() {
  return [{ rel: 'stylesheet', href: authStyles }];
}
