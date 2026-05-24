// src/components/Navbar.jsx

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom"

import {
  useState,
  useEffect
} from "react"

import {
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react"

import {
  signOut
} from "firebase/auth"

import { auth } from "../firebase"
import api from "../api/axios"

function Navbar() {

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [openMenu, setOpenMenu] =
    useState(false)

  const [mobileMenu, setMobileMenu] =
    useState(false)

  const [user, setUser] =
    useState({
      name: "User",
      emailId: "",
      photo: ""
    })

  useEffect(() => {

    const fetchUser =
      async () => {

        try {

          const res =
            await api.get("/me")

          setUser(res.data)

        } catch (err) {
          console.log(err)
        }
      }

    fetchUser()

  }, [])

  const handleLogout =
    async () => {

      try {

        await signOut(auth)

        await api.post("/logout")

        navigate("/")

      } catch (err) {
        console.log(err)
      }
    }

  const navLink = (path) =>
    location.pathname === path
      ? "text-cyan-600 font-semibold border-b-2 border-cyan-500 pb-1"
      : "text-slate-700 hover:text-cyan-600 transition"

  const initials =
    user.name
      ?.charAt(0)
      ?.toUpperCase()

  return (

    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">

      <div className="w-full px-4 md:px-10 lg:px-16 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-0"
        >

          <img
            src="/logo.png"
            alt="Spendora"
            className="h-12 md:h-14 w-auto object-contain -mr-2"
          />

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-none">

            <span className="text-slate-900">
              Spend
            </span>

            <span className="text-cyan-500">
              ora
            </span>

          </h1>

        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-lg">

            <Link
              to="/dashboard"
              className={navLink("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              to="/history"
              className={navLink("/history")}
            >
              History
            </Link>

            <Link
              to="/budget"
              className={navLink("/budget")}
            >
              Budget
            </Link>

            <Link
              to="/groups"
              className={navLink("/groups")}
            >
              Groups
            </Link>

          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="block md:hidden text-3xl"
          >
            ☰
          </button>

          {/* Profile */}
          <div className="relative">

            <button
              onClick={() =>
                setOpenMenu(!openMenu)
              }
              className="flex items-center gap-2 rounded-full hover:bg-slate-100 px-2 py-1 transition cursor-pointer"
            >

              {user.photo ? (

                <img
                  src={user.photo}
                  alt="profile"
                  className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-cyan-500"
                />

              ) : (

                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-lg ring-2 ring-cyan-500">

                  {initials}

                </div>

              )}

              <ChevronDown
                size={18}
                className="text-slate-500"
              />

            </button>

            {/* Profile Dropdown */}
            {
              openMenu && (

                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50">

                  {/* User Info */}
                  <div className="px-5 py-4 border-b border-slate-100">

                    <p className="text-lg font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {user.emailId}
                    </p>

                  </div>

                  {/* Settings */}
                  <button
                    className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition text-left cursor-pointer"
                    onClick={() =>
                      navigate("/settings")
                    }
                  >

                    <Settings size={18} />

                    Settings

                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-4 flex items-center gap-3 hover:bg-red-50 text-red-500 transition text-left cursor-pointer"
                  >

                    <LogOut size={18} />

                    Logout

                  </button>

                </div>

              )
            }

          </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {
        mobileMenu && (

          <div className="
            absolute
            top-20
            right-4
            w-[220px]
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-xl
            flex
            flex-col
            gap-3
            p-4
            md:hidden
            z-50
          ">

            <Link
              to="/dashboard"
              onClick={() =>
                setMobileMenu(false)
              }
              className={navLink("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              to="/history"
              onClick={() =>
                setMobileMenu(false)
              }
              className={navLink("/history")}
            >
              History
            </Link>

            <Link
              to="/budget"
              onClick={() =>
                setMobileMenu(false)
              }
              className={navLink("/budget")}
            >
              Budget
            </Link>

            <Link
              to="/groups"
              onClick={() =>
                setMobileMenu(false)
              }
              className={navLink("/groups")}
            >
              Groups
            </Link>

          </div>

        )
      }

    </header>
  )
}

export default Navbar