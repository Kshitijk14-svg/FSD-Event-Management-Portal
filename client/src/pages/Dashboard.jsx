import { CalendarDays, Ticket, CalendarPlus, ShieldCheck } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import { mockStats } from '../utils/mockData.js';

const STATS = [
  { label: 'Total events', value: mockStats.totalEvents, icon: CalendarDays },
  {
    label: 'Upcoming events',
    value: mockStats.upcomingEvents,
    icon: CalendarPlus,
  },
  { label: 'My tickets', value: mockStats.myTickets, icon: Ticket },
  {
    label: 'Pending moderation',
    value: mockStats.pendingModeration,
    icon: ShieldCheck,
  },
];

/**
 * Dashboard overview — shows demo stats only in Phase 0.
 */
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        A quick overview of your activity. Stats are demo placeholders.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardBody className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
