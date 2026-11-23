"use client"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const SignInPage = () => {
  const router = useRouter()

  function getSafeCallbackURL() {
    const callbackURL = new URLSearchParams(window.location.search).get("callbackURL")
    return callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
      ? callbackURL
      : "/dashboard"
  }

  async function handleSignin(data: AuthFormData) {
    const { data: response, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: getSafeCallbackURL(),
    })

    if (error) {
      throw new Error(error.message)
    }
    if (!response) {
      throw new Error("Sign in failed. Please try again.")
    }

    router.refresh()
    router.push(getSafeCallbackURL())
  }

  async function handleGoogleSignIn() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getSafeCallbackURL(),
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <AuthForm
        mode="signin"
        onSubmit={handleSignin}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </main>
  )
}

export default SignInPage
