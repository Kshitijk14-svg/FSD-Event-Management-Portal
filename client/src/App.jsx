import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyTickets from './pages/MyTickets.jsx';
import MyEvents from './pages/MyEvents.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * App-wide routing.
 *
 * PublicLayout wraps public pages; DashboardLayout wraps authenticated pages.
 * The `*` route renders the 404 page.
 */
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="my-tickets" element={<MyTickets />} />
        <Route path="my-events" element={<MyEvents />} />
      </Route>

      {/* Admin uses the dashboard layout too */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Admin />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
