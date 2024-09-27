import { useState, useEffect } from 'react';
import './styles/App.css';
import WordList from '../WordList/WordList';
import { Word } from '../interfaces/interfaceWordList';
import Favorites from '../Favorites/Favorites';
import themeIcon from './styles/theme.png';

const BAS_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [theme, setTheme] = useState<string>('');

  const fetchWords = async () => {
    if (!inputValue) {
      //If the input field is empty, set error message
      setError('Please enter a word');
      console.log('Please enter a word');
      return;
    }
    try {
      const response = await fetch(`${BAS_URL}${inputValue}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      setWords(data);
    } catch (error) {
      console.log('Something is wrong,', error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addToFavorites = (word: Word) => {
    const existingFavorites = [...favorites]; //creating a shallow copy of the existing favorites

    // Check if the word is already in favorites before adding it
    if (!existingFavorites.find((favorite) => favorite.word === word.word)) {
      //if word from curent favorites is not found in existing favorites
      const updatedFavorites = [...existingFavorites, word]; //add the new word to the existing favorites(creating a new array that includes all existing favorites plus the new word)
      setFavorites(updatedFavorites); //update the state with the new favorites list

      // Save the updated favorites list(whenever new word is added) to sessionStorage
      sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  // Load favorites from sessionStorage when the component mounts
  useEffect(() => {
    const storedFavorites = sessionStorage.getItem('favorites'); //get the favorites from sessionStorage
    if (storedFavorites) {
      //if favorites were found in sessionStorage
      setFavorites(JSON.parse(storedFavorites)); //Load the favorites to the state
    }
  }, []);

  const removeFromFavorites = (word: Word) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.word !== word.word
    );
    console.log('Word removed from favorites:', word);
    setFavorites(updatedFavorites);
    sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  function changeTheme() {
    const currentTheme = localStorage.getItem('theme'); //get the current theme from localStorage
    const newTheme =
      currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark'; //if current theme is dark, change to light and vice versa
    localStorage.setItem('theme', newTheme); //save the new theme to localStorage
    document.documentElement.className = newTheme; // Apply the theme class to the root element
    setTheme(newTheme); //update the state with the new theme
  }

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <main className="pageWrapper">
      <header className="header">
        <button className="themeBtn" onClick={changeTheme}>
          <img src={themeIcon} alt="change theme" className="themeIcon" />
        </button>
        <h1 className="title">Dictionary app</h1>
      </header>
      <section className="search">
        <input
          className="input"
          type="text"
          value={inputValue}
          onChange={handleSearch}
          placeholder="Search for a word"
        />
        <button className="searchBtn" onClick={fetchWords}>
          Search
        </button>
      </section>
      {/* Render error message if user tries to search with empty input field*/}
      {!inputValue && <p style={{ color: 'red' }}>{error}</p>}
      {/* Render WordList and pass wordData as props */}
      <div className="mainBlocks">
        {words.length > 0 && (
          <WordList words={words} addToFavorites={addToFavorites} />
        )}
        <Favorites
          favorites={favorites}
          removeFromFavorites={removeFromFavorites}
        />
      </div>
    </main>
  );
}

export default App;
