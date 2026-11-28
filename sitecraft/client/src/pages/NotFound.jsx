import { ErrorState } from '../components/States.jsx';

export default function NotFound() {
  return <ErrorState title="404 — Page not found" error={{ message: 'The page you are looking for does not exist.' }} />;
}
