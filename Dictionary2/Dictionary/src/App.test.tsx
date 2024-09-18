import App from './App';
import { render, screen, act, fireEvent } from '@testing-library/react';

test('should render headline, input field and a search button upon loading', () => {
  render(<App />);
  expect(screen.getByText('Dictionary app')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search for a word')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

describe('searching for words functionality', () => {
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
  test.only('should render a list of words when user searches for a word', async () => {
    render(<App />);
     //Find input elem
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    //simulate typing word into input field
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'kitten' } })
  });
  expect((inputElement as HTMLInputElement).value).toBe('kitten');

  //find the search button and click it
  const searchBtn = screen.getByRole('button', { name: 'Search' });
  expect(searchBtn).toBeInTheDocument();

  await act(async () => {
    searchBtn.click();
  });

  //check that word(list) is rendered
  await screen.findByText('kitten');
});
});