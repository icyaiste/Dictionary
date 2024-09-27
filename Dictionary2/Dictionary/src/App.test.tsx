import App from './App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/kitten', () =>
    HttpResponse.json([
      {
        word: 'kitten',
        phonetic: '/ˈkɪtən/',
        phonetics: [
          {
            text: '/ˈkɪtən/',
            audio:
              'https://api.dictionaryapi.dev/media/pronunciations/en/kitten-uk.mp3',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  'A young cat, especially before sexual maturity (reached at about seven months).',
              },
              {
                definition:
                  'A young rabbit, rat, hedgehog, squirrel, fox, beaver, badger, etc.',
              },
              {
                definition: 'A moth of the genus Furcula.',
              },
              {
                definition: 'A term of endearment, especially for a woman.',
              },
            ],
          },
          {
            partOfSpeech: 'verb',
            definitions: [
              {
                definition: 'To give birth to kittens.',
              },
            ],
          },
        ],
      },
    ])
  )
);

beforeAll(() => server.listen());

afterAll(() => server.close());

test('should render headline, input field and a search button upon loading', () => {
  render(<App />);
  expect(screen.getByText('Dictionary app')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search for a word')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

describe('searching for words functionality', () => {
  test('should be able to type in an input field', async () => {
    render(<App />);
    const user = userEvent.setup();
    //Find input element
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    //simulate typing word into input field
    await user.type(inputElement, 'cat');
    expect((inputElement as HTMLInputElement).value).toBe('cat');
  });

  test('should render error message if user tries to search with empty input field', async () => {
    render(<App />);
    const user = userEvent.setup();

    //find the search button and click it without typing anything in the input field
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeInTheDocument();

    //click the search button
    await user.click(searchButton);

    const errorMessage = screen.getByText('Please enter a word');
    expect(errorMessage).toBeInTheDocument();
  });

  test('should render a list of words when user searches for a word', async () => {
    render(<App />);
    const user = userEvent.setup();

    //Find input elem
    const inputElement = screen.getByRole('textbox');

    //simulate typing word into input field
    await user.type(inputElement, 'kitten');

    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await user.click(searchBtn);

    //check that word(list) is rendered
    await screen.findByText('kitten');
    expect(screen.getByText('kitten')).toBeInTheDocument();
  });

  test('When no definition is found in a database, an error log is displayed', async () => {
    // Spy on console.error
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Override handler for the 'latin' word
    server.use(
      http.get('https://api.dictionaryapi.dev/api/v2/entries/en/latin', () =>
        HttpResponse.json({
          title: 'No Definitions Found',
          message:
            "Sorry pal, we couldn't find definitions for the word you were looking for.",
          resolution:
            'You can try the search again at later time or head to the web instead.',
        })
      )
    );
    render(<App />);
    const user = userEvent.setup();

    //Find input elem
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();

    //simulate typing word that doesn't exist in a database into input field
    await user.type(inputElement, 'latin');

    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await user.click(searchBtn);

    // Check that the message is logged to the console
    expect(consoleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Sorry pal, we couldn't find definitions for the word you were looking for.",
      })
    );

    // Clean up the mock after the test
    consoleMock.mockRestore();
  });
});

describe('audiofiles availability', () => {
  test('should render audio button when word is searched when audio is available', async () => {
    const user = userEvent.setup();
    render(<App />);

    //Find input elem
    const inputElement = screen.getByRole('textbox');

    //simulate typing word into input field
    await user.type(inputElement, 'kitten');
    //find the search button and click it
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await user.click(searchBtn);

    //check that word(list) is rendered
    const wordElements = await screen.findAllByText('kitten');
    // Ensure that we have at least one matching element
    expect(wordElements.length).toBeGreaterThan(0);

    // // Find the article that contains the word 'kitten'
    const articleElem = wordElements[0].closest('article');

    // Ensure article is not null
    if (!articleElem) {
      throw new Error('Article not found');
    }

    // Find the specific phonetic text
    const phoneticText = screen.getByText('/ˈkɪtən/');
    expect(phoneticText).toBeInTheDocument();
    //Find audio element
    const audio = screen.getByRole('application');
    expect(audio).toBeInTheDocument();
  });

  test('audio button should not be rendered when word is searched when audio is not available', async () => {
    const user = userEvent.setup();
    render(<App />);

     //Find input element and simulate typing word into it
    const inputElement = screen.getByRole('textbox');
    await user.type(inputElement, 'latin');

    //find the search button and click
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await user.click(searchBtn);

    //check that word is rendered
    expect(screen.findByText('latino'));

    // Check that the audio element is not rendered
    const audioElement = screen.queryByRole('application'); // Use queryByRole to ensure it is absent
    expect(audioElement).not.toBeInTheDocument();
  });
});
