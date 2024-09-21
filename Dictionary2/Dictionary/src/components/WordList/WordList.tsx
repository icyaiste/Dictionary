import { Word } from '../interfaces/interfaceWordList';

interface WordListProps {
  words: Word[];
  addToFavorites: (word: Word) => void;
}

function WordList({ words, addToFavorites }: WordListProps) {
  return (
    <section>
      {words.map((word, index) => (
        <article key={index}>
          <h2>{word.word}</h2>
          {/* Render phonetics */}
          {word.phonetics && word.phonetics.length > 0 && (
            <div>
              <p>Phonetic: {word.phonetics[0].text}</p>
              {word.phonetics[0].audio && (
                <audio controls role="application">
                  <source src={word.phonetics[0].audio} type="audio/mpeg" />
                  {/*Your browser does not support the audio element.*/}
                </audio>
              )}
            </div>
          )}

          {/* Render origin if available */}
          {word.origin && (
            <p>
              <strong>Origin:</strong> {word.origin}
            </p>
          )}

          {/* Render meanings */}
          {word.meanings.map((meaning, idx) => (
            <article key={idx}>
              <strong>Part of Speech: {meaning.partOfSpeech}</strong>
              <ul>
                {meaning.definitions.map((definition, defIndex) => (
                  <li key={defIndex}>
                    <p>
                      <strong>Definition:</strong> {definition.definition}
                    </p>
                    {definition.example && (
                      <p>
                        <strong>Example:</strong> {definition.example}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <button onClick={() => addToFavorites(word)}>Add to favorites</button>
        </article>
      ))}
    </section>
  );
}

export default WordList;
