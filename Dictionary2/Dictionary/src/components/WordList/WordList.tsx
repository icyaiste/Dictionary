import { Word } from '../interfaces/interfaceWordList';
import './styles/Wordlist.css';
import starIcon from './styles/star.png';
interface WordListProps {
  words: Word[];
  addToFavorites: (word: Word) => void;
}

function WordList({ words, addToFavorites }: WordListProps) {
  return (
    <section className="wordListComponent">
      {words.map((word, index) => (
        <article key={index}>
          <div className="favBox">
            <button
              className="favoriteButton"
              onClick={() => addToFavorites(word)}
            >
              <img src={starIcon} alt="Add to favorites" className="starIcon" />
            </button>
            <h2>{word.word}</h2>
          </div>
          {/* Render phonetics */}
          {word.phonetics && word.phonetics.length > 0 && (
            <div>
              <p>
                Phonetic: <span>{word.phonetics[0].text}</span>
              </p>
              {word.phonetics[0].audio && (
                <audio controls role="application">
                  <source src={word.phonetics[0].audio} type="audio/mpeg" />
                  {/*Your browser does not support the audio element.*/}
                </audio>
              )}
            </div>
          )}

          {/* Render meanings */}
          {word.meanings.map((meaning, idx) => (
            <article key={idx}>
              <p className="partOfSpeech">{meaning.partOfSpeech}</p>
              <ul>
                {meaning.definitions.map((definition, defIndex) => (
                  <li key={defIndex}>
                    <p>{definition.definition}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </article>
      ))}
    </section>
  );
}

export default WordList;
