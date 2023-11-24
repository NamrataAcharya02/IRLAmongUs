import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IRL AMONG US heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/IRL AMONG US/i);
  expect(headingElement).toBeInTheDocument();
});
