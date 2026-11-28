import { ErrorState } from '../components/States.jsx';

export default function NotFound() {
  return <ErrorState title="404 — Page nahi mila" error={{ message: 'Jo page aap dhoondh rahe hain wo exist nahi karta.' }} />;
}
