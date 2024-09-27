import { Word } from '../interfaces/interfaceWordList';
import './styles/Favorites.css';
import starIcon from './styles/icons/star.png';
import deleteIcon from './styles/icons/delete.png';

interface FavoritesProps {
  favorites: Word[];
  removeFromFavorites: (word: Word) => void;
}

function Favorites({ favorites, removeFromFavorites }: FavoritesProps) {
  return (
    <div className="favoritesComponent">
      <div className="favBox">
        <button className="favoriteButton">
          <img src={starIcon} alt="Add to favorites" className="starIcon" />
        </button>
        <h2>Favorites</h2>
      </div>
      {/* Render favorite words here */}
      {favorites.map((word, index) => (
        <div key={index}>
          <div className="deleteBox">
            <h3>{word.word}</h3>
            <button
              className="favoriteButton"
              onClick={() => removeFromFavorites(word)}
            >
              <img
                src={deleteIcon}
                alt="delete frpm favorites"
                className="deleteIcon"
              />
            </button>
          </div>
          {word.meanings.map((meaning, idx) => (
            <div key={idx}>
              <ul>
                {meaning.definitions.map((definition, defIndex) => (
                  <p key={defIndex}>{definition.definition}</p>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Favorites;
