import { StarOff } from 'lucide-react';
import { Star } from 'lucide-react';
import '../styles/Sidebar.css';

export default function Preferiti(props) {
  
  const isFavorite = props.favorites[props.selectedCity] || false; // di default stella vuota
  const starIcon = isFavorite
    ? <Star className='star-icon' />
    : <StarOff className='star-icon' />;

  return (
    <>
      <main className='pref-barStar'>
        <button onClick={props.iscut} className='pref-staricon'>
          {starIcon}
        </button>

        <div className='pref-Addpref'>
          <p>Add a Favorite:</p>
          <div className="pref-CityList">
            {props.recentcity.map((città, index) => (
              <div 
                key={index} 
                onClick={() => {
                  props.selectionCity(città);     // serve per evidenziare la città selezionata
                  props.onCityClick(città);       // serve per aggiornare i dati meteo
                   }}
                className={`pref-PropsCity ${props.selectedCity === città ? "selected" : ""}`}
              >
                {città}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
