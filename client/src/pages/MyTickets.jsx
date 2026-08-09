import { Ticket } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatDate.js';
import { mockTicket } from '../utils/mockData.js';

/**
 * My tickets — shows a single demo ticket in Phase 0.
 */
export default function MyTickets() {
  if (!mockTicket) {
    return <EmptyState title="No tickets yet" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
      <p className="mt-1 text-sm text-gray-500">
        Tickets you&apos;ve registered for. Demo data only.
      </p>

      <div className="mt-6 max-w-md">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Ticket className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {mockTicket.eventTitle}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(mockTicket.eventDate)}
                  </p>
                </div>
              </div>
              <Badge tone="green">{mockTicket.status}</Badge>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Ticket code: </span>
              <span className="font-mono font-semibold text-gray-900">
                {mockTicket.code}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
