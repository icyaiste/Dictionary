import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from '../../App';

const server = setupServer(
  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/latino', () =>
    HttpResponse.json([
      {
        word: 'latino',
        phonetics: [],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition:
                  '(chiefly US) A person, especially and usually (interpreted as) a male, from Latin America, a Hispanic person. (Compare Latina.)',
                synonyms: [],
                antonyms: [],
                example:
                  'Latinos have quickly become the largest ethnic minority in the United States.',
              },
            ],
            synonyms: [],
            antonyms: [],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: [
          'https://en.wiktionary.org/wiki/Latino',
          'https://en.wiktionary.org/wiki/latino',
        ],
      },
    ])
  )
);

beforeAll(() => server.listen());

afterAll(() => server.close());



test('does not render phonetics when they are not available', async () => {
  const user = userEvent.setup();
  render(<App />);

  //Find input elem
  const inputElement = screen.getByRole('textbox');

  //simulate typing word into input field
  await user.type(inputElement, 'latino');
  expect((inputElement as HTMLInputElement).value).toBe('latino');

  //find the search button and click it
  const searchBtn = screen.getByRole('button', { name: 'Search' });
  await user.click(searchBtn);

  //check that word is rendered
  await screen.findByText('latino');

  // Check that the phonetics are not rendered
  const phoneticsElement = screen.queryByText('Phonetics'); // Use queryByRole to ensure it is absent
  expect(phoneticsElement).not.toBeInTheDocument();

  const audioElement = screen.queryByRole('application'); // Use queryByRole to ensure it is absent
  expect(audioElement).not.toBeInTheDocument();
});
