import { CalendarPlus } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatDate.js';
import { mockEvents } from '../utils/mockData.js';

/**
 * My events — list of events created by the (demo) organizer.
 */
export default function MyEvents() {
  const myEvents = mockEvents.slice(0, 2);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Events you&apos;ve created. Demo data only.
          </p>
        </div>
        <Button disabled>
          <CalendarPlus className="h-4 w-4" /> New event
        </Button>
      </div>

      {myEvents.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No events created yet"
            description="Create your first event to get started."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myEvents.map((event) => (
            <Card key={event.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <Badge tone="indigo">{event.category}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(event.date)} · {event.venue}, {event.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="green">{event.status}</Badge>
                  <span className="text-sm text-gray-500">
                    {event.registered}/{event.capacity}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
