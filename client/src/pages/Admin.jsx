import { ShieldCheck, Users, CalendarDays } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

/**
 * Admin dashboard — placeholder showing moderation intent.
 * Functional admin features arrive in later phases.
 */
export default function Admin() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
      <p className="mt-1 text-sm text-gray-500">
        Moderation and user management (Phase 0 placeholder).
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Pending approvals</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Admin</p>
              <p className="text-sm text-gray-500">Role</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <Badge tone="yellow">Demo</Badge>
              <p className="text-sm text-gray-600">
                Moderation queue and user management are not implemented yet.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
