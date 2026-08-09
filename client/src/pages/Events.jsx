import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Search } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { formatDate } from '../utils/formatDate.js';
import { mockEvents } from '../utils/mockData.js';

/**
 * Events listing — uses local mock data for Phase 0.
 * Search/category filters are UI-only for now.
 */
export default function Events() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const categories = [...new Set(mockEvents.map((e) => e.category))];

  const filtered = mockEvents.filter((e) => {
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || e.category === category;
    return matchesQuery && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      <p className="mt-1 text-sm text-gray-500">
        Browse upcoming events. Filters are demo-only in Phase 0.
      </p>

      {/* Search / filter bar */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_240px_auto]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search events…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          placeholder="All categories"
          options={categories}
        />
      </div>

      {/* Results */}
      {paged.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No events found"
            description="Try adjusting your search or category filter."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((event) => (
            <Card key={event.id}>
              <CardBody className="flex h-full flex-col">
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
                </div>

                <div className="mt-4 flex-1" />
                <Link to={`/events/${event.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View details
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
