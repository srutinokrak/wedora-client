'use client'
import { AuthForm } from '@/components/auth-form';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
type AuthformData = {
  name: string
  email: string
  password: string
}

const SignInPage = () => {
    const router = useRouter();
    const handleSignin = async (data:AuthformData) =>{
      const { data:SignInResponse, error } = await authClient.signIn.email({
    email: data.email, 
    password: data.password, 
    rememberMe:true,
    callbackURL: getSafeCallbackURL(),
});
    if (error) throw error; // sends the message to the form to show it
    if (!SignInResponse) throw new Error('Sign in failed. Please try again.');
    router.refresh();
    router.push(getSafeCallbackURL());
    }

    function getSafeCallbackURL() {
      const callbackURL = new URLSearchParams(window.location.search).get('callbackURL');
      return callbackURL?.startsWith('/') && !callbackURL.startsWith('//')
        ? callbackURL
        : '/';
    }

    return (
        <main className="flex min-h-svh items-center justify-center px-4 py-16">
            <AuthForm mode="signin" onSubmit={handleSignin}/>
        </main>
    );
};

export default SignInPage;
