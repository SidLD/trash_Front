import { Outlet, Link } from "react-router-dom"
import logo from '../assets/logo_r.png'
export default function GuestLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                <img width={70} src={logo} alt="logo-header" className="duration-100 hover:scale-110"/>
              </Link>
            </div>
            
            <nav className="flex space-x-4">
                <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900"
              >
                Home
              </Link>
                <Link
                to="/about"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900"
              >
                About Us
              </Link>
              <Link
                to="/report"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900"
              >
                Report
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center flex-grow px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            &copy; 2023 YourCompany. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}