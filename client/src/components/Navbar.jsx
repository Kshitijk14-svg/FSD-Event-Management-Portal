import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CalendarDays, Menu, X } from 'lucide-react';
import cn from '../utils/cn.js';

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  );

/**
 * Clean, responsive public navbar.
 * Mobile gets a simple toggle menu; desktop shows inline links.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <NavLink to="/events" className={navLinkClass}>
        Events
      </NavLink>
      <NavLink to="/login" className={navLinkClass}>
        Login
      </NavLink>
      <NavLink
        to="/register"
        className={({ isActive }) =>
          cn(
            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-brand-50 text-brand-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )
        }
      >
        Register
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </span>
          EventHub
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">{links}</div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">{links}</div>
        </div>
      )}
    </header>
  );
}
