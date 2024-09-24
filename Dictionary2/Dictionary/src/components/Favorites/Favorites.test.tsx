import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../App';

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