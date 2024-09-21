import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../App';

test('does not render phonetics when they are not available', async () => {
  //Mock the fetch function
  const mockFetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        word: 'latino',
        meanings: [],
        phonetics: [], // No written phonetics or audio in the response
      },
    ],
  });
  global.fetch = mockFetch; //replace fetch with mockFetch

  render(<App />);

  //Find input elem
  const inputElement = screen.getByRole('textbox');
  expect(inputElement).toBeInTheDocument();

  //simulate typing word into input field
  await act(async () => {
    fireEvent.change(inputElement, { target: { value: 'latino' } });
  });
  expect((inputElement as HTMLInputElement).value).toBe('latino');

  //find the search button and click it
  const searchBtn = screen.getByRole('button', { name: 'Search' });
  expect(searchBtn).toBeInTheDocument();

  await act(async () => {
    searchBtn.click();
  });

  //check that word is rendered
  await screen.findByText('latino');

  // Check that the phonetics are not rendered
  const phoneticsElement = screen.queryByText('Phonetics'); // Use queryByRole to ensure it is absent
  expect(phoneticsElement).not.toBeInTheDocument();

  const audioElement = screen.queryByRole('application'); // Use queryByRole to ensure it is absent
  expect(audioElement).not.toBeInTheDocument();
});
