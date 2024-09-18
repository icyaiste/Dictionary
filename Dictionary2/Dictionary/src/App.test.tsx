import { test, expect, vi } from 'vitest';
import App from './App';
import { render, screen, waitFor, act } from '@testing-library/react';

test('should render headline, input field and a search button upon loading', () => {
  render(<App />);
  expect(screen.getByText('Dictionary app')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search for a word')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

test('should render error message if user tries to search with empty input field', async () => {
  render(<App />);

  //Find input elem
  const inputElement = screen.getByRole('textbox');
  expect(inputElement).toBeInTheDocument();

  //find the search button and click it
  const searchButton = screen.getByRole('button', { name: 'Search' });
  expect(searchButton).toBeInTheDocument();

  //click the search button
  await act(async () => {
    searchButton.click();
  });
  const errorMessage = screen.getByText('Please enter a word');
  expect(errorMessage).toBeInTheDocument();
});
