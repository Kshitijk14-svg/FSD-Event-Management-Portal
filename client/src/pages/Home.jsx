import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { formatDate } from '../utils/formatDate.js';
import { mockEvents } from '../utils/mockData.js';

/**
 * Home page — a clean, minimal landing for a college project.
 * Shows a short intro and a few upcoming demo events.
 */
export default function Home() {
  const featured = mockEvents.slice(0, 3);

  return (
    <div className="container-page py-10 sm:py-14">
      <section className="max-w-2xl">
        <Badge tone="indigo">Event Management Portal</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Discover and manage events, all in one place.
        </h1>
        <p className="mt-4 text-base text-gray-500">
          EventHub helps students browse upcoming concerts, tech fests and
          cultural events, register for tickets, and let organizers manage their
          events — built for a college full-stack lab.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/events">
            <Button>Browse events</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Create an account</Button>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming events</h2>
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <Card key={event.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <Badge tone="indigo">{event.category}</Badge>
                  <span className="text-xs text-gray-400">
                    {event.registered}/{event.capacity}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {event.description}
                </p>

                <div className="mt-4 space-y-1.5 text-sm text-gray-600">
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
                    {event.registered} registered
                  </p>
                </div>

                <div className="mt-4">
                  <Link to={`/events/${event.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      View details
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
