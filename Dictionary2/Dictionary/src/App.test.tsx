import App from './App';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';

test('should render headline, input field and a search button upon loading', () => {
  render(<App />);
  expect(screen.getByText('Dictionary app')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search for a word')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

describe('searching for words functionality', () => {
  test('should be able to type in an input field', async () => {
    render(<App />);
    //Find input element
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    //simulate typing word into input field
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'cat' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('cat');
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

  test('should render a list of words when user searches for a word', async () => {
    render(<App />);
    //Find input elem
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    //simulate typing word into input field
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'kitten' } });
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
  test('When no definition is found in a database, an error log is displayed', async () => {
    //Mock the fetch function
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        title: 'No Definitions Found',
        message:
          "Sorry pal, we couldn't find definitions for the word you were looking for.",
        resolution:
          'You can try the search again at a later time or head to the web instead.',
      }),
    });

    global.fetch = mockFetch; //replace fetch with mockFetch

    // Spy on the console.log function
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<App />);
    //Find input elem
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();

    //simulate typing word that doesn't exist in a database into input field
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'latin' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('latin');

    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    expect(searchBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(searchBtn);
    });

    // Wait for fetch to be called and for the console.log to be triggered with the error message
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled(); // Check that fetch was called
      expect(consoleSpy).toHaveBeenCalledWith({
        title: 'No Definitions Found',
        message:
          "Sorry pal, we couldn't find definitions for the word you were looking for.",
        resolution:
          'You can try the search again at a later time or head to the web instead.',
      });
    });
    consoleSpy.mockRestore();
  });
});

describe('adding and deleting words to/from favorites', () => {
  test('add word to favorites', async () => {
    //Mock the fetch function
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          word: 'kitten',
          meanings: [],
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
      fireEvent.change(inputElement, { target: { value: 'kitten' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('kitten');
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    expect(searchBtn).toBeInTheDocument();

    //click search
    await act(async () => {
      searchBtn.click();
    });

    //check that word(list) is rendered
    await screen.findByText('kitten');
    await screen.findByText('Add to favorites');

    //add word to favorites
    const addToFavoritesButton = screen.getByText('Add to favorites');
    expect(addToFavoritesButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(addToFavoritesButton);
    });

    // Check that the word has been added to favorites
    const favoriteWords = await screen.findAllByRole('heading', { level: 3 }); // Favorite items are rendered as h3 elements
    expect(favoriteWords.length).toBeGreaterThan(0);

    // Check that the word 'kitten' is in the favorites list
    const addedFavoriteWord = screen.getAllByText('kitten');
    expect(addedFavoriteWord[0]).toBeInTheDocument();
  });

  test('delete word from favorites', async () => {
    //Mock the fetch function
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          word: 'kitten',
          meanings: [],
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
      fireEvent.change(inputElement, { target: { value: 'kitten' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('kitten');
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    expect(searchBtn).toBeInTheDocument();

    //click search
    await act(async () => {
      searchBtn.click();
    });

    //check that word(list) is rendered
    await screen.findAllByText('kitten');
    await screen.findByText('Add to favorites');

    //add word to favorites
    const addToFavoritesButton = screen.getByText('Add to favorites');
    expect(addToFavoritesButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(addToFavoritesButton);
    });

    // Check that the word has been added to favorites
    const favoriteWords = await screen.findAllByRole('heading', { level: 3 }); // Favorite items are rendered as h3 elements
    expect(favoriteWords.length).toBeGreaterThan(0);

    // Check that the word 'kitten' is in the favorites list
    const addedFavoriteWord = screen.getAllByText('kitten');
    expect(addedFavoriteWord[0]).toBeInTheDocument();

    // Check that the button 'Delete' is rendered
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();

    //delete the word from favorites
    await act(async () => {
      fireEvent.click(deleteButton);
    });
    // Check that the word has been removed from favorites
    const removedFavoriteWord = screen.queryByRole('h3');
    expect(removedFavoriteWord).not.toBeInTheDocument(); // Only 'Favorites' have an HTML element of h3
  });
});

describe('audiofiles availability', () => {
  test('should render audio button when word is searched when audio is available', async () => {
    //Mock the fetch function
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          word: 'bollocks',
          meanings: [],
          phonetics: [
            {
              audio:
                'https://lex-audio.useremarkable.com/mp3/bollocks_gb_1.mp3',
            },
          ],
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
      fireEvent.change(inputElement, { target: { value: 'bollocks' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('bollocks');

    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    expect(searchBtn).toBeInTheDocument();

    await act(async () => {
      searchBtn.click();
    });

    //check that word(list) is rendered
    await screen.findByText('bollocks');
    // Check that the audio element is rendered
    const audioElement = await screen.findByRole('application');
    expect(audioElement).toBeInTheDocument();
  });

  test('audio button should not be rendered when word is searched when audio is not available', async () => {
    //Mock the fetch function
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          word: 'latino',
          meanings: [],
          phonetics: [], // No audio files in the response
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
      fireEvent.change(inputElement, { target: { value: 'latin' } });
    });
    expect((inputElement as HTMLInputElement).value).toBe('latin');

    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    expect(searchBtn).toBeInTheDocument();

    await act(async () => {
      searchBtn.click();
    });

    //check that word is rendered
    await screen.findByText('latino');

    // Check that the audio element is not rendered
    const audioElement = screen.queryByRole('application'); // Use queryByRole to ensure it is absent
    expect(audioElement).not.toBeInTheDocument();
  });
});
