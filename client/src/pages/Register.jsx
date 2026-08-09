import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Card, { CardBody } from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';

/**
 * Register page — UI + basic frontend validation only.
 * NOT connected to a backend in Phase 0.
 */
export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (values) => {
    // Placeholder — real auth lands in a later phase.
    // eslint-disable-next-line no-console
    console.log('Register (Phase 0 placeholder):', values);
  };

  return (
    <div className="container-page flex justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Join EventHub to register for events and manage your tickets.
        </p>

        <Card className="mt-6">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Full name"
                placeholder="Jane Doe"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name is too short' },
                })}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
              />

              <Select
                label="I am a…"
                placeholder="Choose a role"
                options={[
                  { value: 'attendee', label: 'Attendee' },
                  { value: 'organizer', label: 'Organizer' },
                ]}
                error={errors.role?.message}
                {...register('role', { required: 'Please choose a role' })}
              />

              <Button type="submit" className="w-full" loading={isSubmitting}>
                Create account
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
