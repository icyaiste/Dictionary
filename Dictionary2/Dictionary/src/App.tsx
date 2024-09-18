import { useState } from 'react';
import './App.css';
import WordList from './components/WordList/WordList';
import { Word } from './components/interfaces/interfaceWordList';
import Favorites from './components/Favorites/Favorites';

const BAS_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [favorites, setFavorites] = useState<Word[]>([]);

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
    if (!favorites.includes(word)) {
      setFavorites([...favorites, word]);
    }
  }

  return (
    <>
      <header>
        <h1>Dictionary app</h1>
      </header>
      <main>
        <input
          type="text"
          value={inputValue}
          onChange={handleSearch}
          placeholder="Search for a word"
        />
        <button onClick={fetchWords}>Search</button>
        {/* Render WordList and pass wordData as props */}
        {words.length > 0 && <WordList words={words} addToFavorites={addToFavorites}/>}
        {/* Render error message if user tries to search with empty input field*/}
        {!inputValue && <p style={{ color: 'red' }}>{error}</p>}
        <Favorites favorites={favorites}/>
      </main>
    </>
  );
}

export default App;