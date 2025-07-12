import React from 'react';
import '../styles/Sidebar.css';

export default function Searchbar(props) {
  const [citysearch, setcitysearch] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);

  function updateValue(e) {
    const value = e.target.value;
    setcitysearch(value);

    if (value.length >= 2) {
      fetch(
       `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=76dfa38e35bb3a0fb9191a278a248a23`

      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        });
    } else {
      setSuggestions([]);
    }
  }

function handlesearch(cityName) {
  const query = cityName || citysearch;

  // 🔎 Controlla se è tra i suggerimenti
  const cityExists = suggestions.some((city) => city.name.toLowerCase() === query.toLowerCase());

  if (!cityExists) {
    console.log("Città non valida");
    return; // esce dalla funzione
  }

  props.onSearch(query);
  setSuggestions([]);
  setcitysearch(""); // svuota input solo se è valida
}

function handleSuggestionClick(city) {
  const label = city.name;
  setcitysearch(label);
  handlesearch(label);
}

  return (
    <div className="searchbar-container">
      <input
        className="searchbar-input"
        type="text"
        placeholder="Scrivi una città"
        value={citysearch}
        onChange={updateValue}
        onKeyDown={(e) => e.key === "Enter" && handlesearch()}
      />

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
