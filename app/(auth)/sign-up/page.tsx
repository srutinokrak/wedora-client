"use client"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const SignUpPage = () => {
  const router = useRouter()

  function getSafeCallbackURL() {
    const callbackURL = new URLSearchParams(window.location.search).get("callbackURL")
    return callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
      ? callbackURL
      : "/dashboard"
  }

  async function handleSignup(data: AuthFormData) {
    const { data: response, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      image: data.image,
      callbackURL: getSafeCallbackURL(),
    })
    if (error) {
      throw new Error(error.message || "An error occurred during signup.")
    }
    if (!response) {
      throw new Error("Signup failed. Please try again.")
    }
    router.refresh()
    router.push(getSafeCallbackURL())
  }

  async function handleGoogleSignIn(role: AuthFormData["role"]) {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getSafeCallbackURL(),
      additionalData: { role },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <AuthForm
        mode="signup"
        onSubmit={handleSignup}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </main>
  )
}

export default SignUpPage
