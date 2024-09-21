import { Word } from '../interfaces/interfaceWordList';

interface FavoritesProps {
  favorites: Word[];
  removeFromFavorites: (word: Word) => void;
}

function Favorites({ favorites, removeFromFavorites }: FavoritesProps) {
  return (
    <div>
      <h2>Favorites</h2>
      {/* Render favorite words here */}
      {favorites.map((word, index) => (
        <div key={index}>
          <h3>{word.word}</h3>
          {word.meanings.map((meaning, idx) => (
            <div key={idx}>
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
            </div>
          ))}
          <button onClick={() => removeFromFavorites(word)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Favorites;
