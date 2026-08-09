import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

/**
 * Minimal footer: project name, short description, basic nav, copyright.
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-page py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </span>
              EventHub
            </div>
            <p className="mt-2 text-sm text-gray-500">
              A college event management portal for concerts, tech fests and
              community gatherings.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold text-gray-900">Explore</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-500">
              <li>
                <Link to="/events" className="hover:text-brand-600">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-600">
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} EventHub. Built for a college full-stack
          lab.
        </div>
      </div>
    </footer>
  );
}
