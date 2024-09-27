import { render, screen } from '@testing-library/react';
import App from '../../App';
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


describe('adding and deleting words to/from favorites', () => {
    test('add word to favorites', async () => {
     const user = userEvent.setup();
      render(<App />);

      //Find input elem
      const inputElement = screen.getByRole('textbox');
      //simulate typing word into input field
     await user.type(inputElement,'kitten');
      expect((inputElement as HTMLInputElement).value).toBe('kitten');
      //find the search button and click it
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      await user.click(searchBtn);
  
      //check that word(list) is rendered
      await screen.findByText('kitten');
      await screen.findByText('Add to favorites');
  
      //add word to favorites
      const addToFavoritesButton = screen.getByText('Add to favorites');
      await user.click(addToFavoritesButton);
  
      // Check that the word has been added to favorites
      const favoriteWords = await screen.findAllByRole('heading', { level: 3 }); // Favorite items are rendered as h3 elements
      expect(favoriteWords.length).toBeGreaterThan(0);
  
      // Check that the word 'kitten' is in the favorites list
      const addedFavoriteWord = screen.getAllByText('kitten');
      expect(addedFavoriteWord[0]).toBeInTheDocument();
    });
  
    test.only('delete word from favorites', async () => {
      const user = userEvent.setup();
      render(<App />);

      //Find input elem and type in word
      const inputElement = screen.getByRole('textbox');
      await user.type(inputElement,'kitten');

      //find the search button and click it
      const searchBtn = screen.getByRole('button', { name: 'Search' });
      await user.click(searchBtn);
  
      //check that buutton 'add to favorites' is rendered
      await screen.findByText('Add to favorites');
  
      //add word to favorites list
      const addToFavoritesButton = screen.getByText('Add to favorites');
      await user.click(addToFavoritesButton);
  
      // Check that the word has been added to favorites
      const favoriteWords = await screen.findAllByRole('heading', { level: 3 }); // Favorite items are rendered as h3 elements
      expect(favoriteWords.length).toBeGreaterThan(0);
  
      // Check that the word 'kitten' is in the favorites list
      const addedFavoriteWord = screen.getAllByText('kitten');
      expect(addedFavoriteWord[0]).toBeInTheDocument();

      // //delete the word from favorites
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      // Check that the word has been removed from favorites
      const removedFavoriteWord = screen.queryByRole('h3');
      expect(removedFavoriteWord).not.toBeInTheDocument(); // Only 'Favorites' have an HTML element of h3
    });
  });