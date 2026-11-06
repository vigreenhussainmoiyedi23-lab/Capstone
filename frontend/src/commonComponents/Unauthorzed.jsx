import { Lock } from "lucide-react"
import { Link } from "react-router-dom"

const Unauthorzed = () => {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
            <Lock className="h-10 w-10 text-gold" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-center text-3xl font-bold text-text">
            Access Restricted
          </h1>

          {/* Description */}
          <p className="mt-3 text-center text-sm leading-6 text-background-subtle">
            You need to be logged in to access this page.
            <br />
            Sign in to continue where you left off.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full rounded-xl bg-gold py-3 text-center font-semibold text-background transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/30"
            >
              Login
            </Link>

            <Link
              to="/"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center font-medium text-text transition-all duration-300 hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
  )
}

export default Unauthorzed
