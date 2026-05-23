// src/pages/Register.jsx
// Spendora Final Register Page (Google Popup Fixed)

import { useState } from "react"
import {
  useNavigate,
  Link
} from "react-router-dom"

import api from "../api/axios"

import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth"

import { auth } from "../firebase"

function Register() {
  const navigate =
    useNavigate()

  const [firstName, setFirstName] =
    useState("")

  const [emailId, setEmailId] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [loading, setLoading] =
    useState(false)

const handleRegister =
  async (e) => {

    e.preventDefault()

    if (
      !firstName ||
      !emailId ||
      !password
    ) {
      setError(
        "All fields are required"
      )
      return
    }

    try {

      setLoading(true)
      setError("")
      setSuccess("")

        await api.post(
          "/register",
          {
            name:
              firstName,
            emailId,
            password
          }
        )

       setSuccess(
 "OTP sent to your email"
)

setTimeout(() => {
 navigate(
  "/verify-email",
  {
   state: {
    emailId
   }
  }
 )
}, 1000)

} catch (err) {
  setError(
    err.response?.data?.message ||
    "Register failed"
  )

} finally {
  setLoading(false)
}

}

  const handleGoogleRegister =
  async () => {
    try {
      const provider =
        new GoogleAuthProvider()

      await setPersistence(
        auth,
        browserSessionPersistence
      )

      const result =
        await signInWithPopup(
          auth,
          provider
        )

      const user =
        result.user

      await api.post(
        "/google-auth",
        {
          name:
            user.displayName,
          emailId:
            user.email,
          photo:
            user.photoURL
        }
      )

      navigate(
        "/dashboard"
      )

    } catch (err) {
      setError(
        err.message
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4">
            Spendora
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Create Account
          </h2>

          <p className="text-slate-500 mt-2 text-lg">
            Join Spendora today
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={
            handleRegister
          }
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter Name"
              value={
                firstName
              }
              onChange={(e) =>
                setFirstName(
                  e.target.value
                )
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-300 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={emailId}
              onChange={(e) =>
                setEmailId(
                  e.target.value
                )
              }
              className="w-full px-5 py-4 rounded-2xl border border-slate-300 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-300 outline-none focus:border-cyan-500 pr-14"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
              >
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-cyan-50 text-cyan-700 px-4 py-3 rounded-2xl text-sm font-medium">
              {success}
            </div>
          )}

          {/* Register */}
          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:opacity-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 pt-2">

            <div className="flex-1 h-px bg-slate-200"></div>

            <span className="text-sm text-slate-400">
              OR CONTINUE WITH
            </span>

            <div className="flex-1 h-px bg-slate-200"></div>

          </div>

          {/* Google */}
          <button
            type="button"
            onClick={
              handleGoogleRegister
            }
            className="w-full py-4 rounded-2xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-3"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />

             Google
          </button>

        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-cyan-600 font-semibold hover:text-blue-600 cursor-pointer"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  )
}

export default Register