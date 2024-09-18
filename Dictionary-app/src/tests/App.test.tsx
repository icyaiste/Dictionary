import { describe,test,expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';


test("True to be true", () => {
  expect(true).toBe(true);
});

test('should render title, search bar and button upon start', () => {
  render(<App />);
  const title = screen.getByRole('heading', { name: /Dictionary app/i });
  expect(title).toBeInTheDocument();
});

describe('App', () => {
  it('renders the App component', () => {
    render(<App />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
