import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders app without crashing', () => {
    render(<App />);
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });
});