import { useParams, Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, ArrowLeft } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatDate.js';
import { mockEvents } from '../utils/mockData.js';

/**
 * Event details — reads a demo event from local mock data by route id.
 */
export default function EventDetails() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Event not found"
          description="We couldn't find that event. It may have been removed."
          action={
            <Link to="/events">
              <Button variant="secondary">Back to events</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Link
        to="/events"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-3">
            <Badge tone="indigo">{event.category}</Badge>
            <Badge tone="green">Published</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            {event.title}
          </h1>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {event.venue}, {event.city}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              {event.registered} of {event.capacity} registered
            </p>
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">About this event</h2>
            <p className="mt-2 leading-relaxed text-gray-600">
              {event.description}
            </p>
          </section>
        </div>

        {/* Register card */}
        <div className="h-fit">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-500">Registration</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </p>
              <div className="mt-4">
                <Button className="w-full" disabled>
                  Register (coming soon)
                </Button>
              </div>
              <p className="mt-3 text-center text-xs text-gray-400">
                Registration is disabled during Phase 0.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
