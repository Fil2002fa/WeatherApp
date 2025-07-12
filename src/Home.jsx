import Searchbar from './components/Searchbar';
import axios from "axios";
import { Cloud } from 'lucide-react';
import './App.css';
import { useState, useEffect } from 'react';
import Preferiti from './components/Preferiti';
import Chart from './chart';
import mockData from './mockForecastData.json';
import SideMenu from './components/sideMenu';
import { Menu, X } from 'lucide-react';
import DayoftheWeek from './components/Dayoftheweek';
import { ArrowRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebase';

export default function Home() {
  const [data, setdata] = useState({});
  const [location, setlocation] = useState("");
  const [recentcity, setrecentcity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [favorites, setFavorites] = useState({}); // Stato per sapere quali città sono preferite
  const [showMenu, setshowMenu] = useState(false);
  const [showdayweek, setshowdayweek] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  // Carica i preferiti da Firestore all'avvio
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const fetchFavorites = async () => {
        const userDoc = await getDoc(doc(db, "utenti", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavorites(userData.favorites || {});
        }
      };
      fetchFavorites();
    }
  }, []);

  function handlesearch(city) {
    setlocation(city);
    setSelectedCity(city);
    setrecentcity(prev => [city, ...prev.filter(c => c !== city)].slice(0, 3));
    handleCitySelect(city);
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=76dfa38e35bb3a0fb9191a278a248a23&units=metric`;

    axios.get(forecastUrl)
      .then((forecastResponse) => {
        console.log("Dati forecast ricevuti da API:", forecastResponse.data);
        setForecastData({ ...forecastResponse.data });
      })
      .catch((err) => {
        console.error("Errore forecast:", err);
        setForecastData(null);
      });
  }

async function handleToggle() {
  if (selectedCity) {
    const newFavorites = {
      ...favorites,
      [selectedCity]: !favorites[selectedCity]
    };
    setFavorites(newFavorites);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "utenti", user.uid), {
          favorites: newFavorites,
          email: user.email,
          nome: user.displayName || "Utente",
        }, { merge: true });
        console.log("✅ Preferiti aggiornati in Firestore:", newFavorites);
      } catch (err) {
        console.error("❌ Errore salvataggio preferiti:", err);
      }
    }
  }
}
  function selectToggle(city) {
    setSelectedCity(city);
  }

  function handleCitySelect(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=76dfa38e35bb3a0fb9191a278a248a23&units=metric`;
    axios.get(url).then((response) => {
      setdata(response.data);
      setSelectedCity(cityName);
    }).catch((err) => {
      console.error("Errore dati attuali:", err);
    });

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=76dfa38e35bb3a0fb9191a278a248a23&units=metric`;
    axios.get(forecastUrl).then((forecastResponse) => {
      setForecastData(forecastResponse.data);
      console.log("Dati forecast ricevuti da API:", forecastResponse.data);
      console.log("Dati list:", forecastResponse.data?.list);
    }).catch((err) => {
      console.error("Errore forecast:", err);
    });
  }

  const cittaSelezionatePreferite = Object.keys(favorites).filter((città) => favorites[città] === true);

  return (
    <>
      <header>
        <div className='container-headerApp'>
          <h1 className='title-AppWeather'>Weather App</h1>
        </div>
        <div className=' searchBar'>
          <Searchbar onSearch={handlesearch} />
        </div>
        <div className='container-menubottom'>
          <button onClick={() => setshowMenu(true)}>
            <Menu className='menubottom' />
          </button>
          {showMenu && <div className="overlay" onClick={() => setshowMenu(false)}></div>}
          <SideMenu
            show={showMenu}
            onClose={() => setshowMenu(false)}
            favorites={favorites}
            selectedCity={selectedCity}
            cittaSelezionatePreferite={cittaSelezionatePreferite}
          />
        </div>
      </header>

      <main className='container-mainApp'>
        <div className='partesinistra'>
          {!showdayweek ? (
            <div className='containerchartScritta'>
              <div className='containerChart'>
                <Chart data={forecastData || {}} />
              </div>
              {forecastData?.list?.length > 0 && (
                <div className="container-buttom">
                  <p className="cta-text">Keep exploring the week</p>
                  <button className="cta-button" onClick={() => setshowdayweek(!showdayweek)}>
                    <ArrowRight size={18} style={{ marginRight: '8px' }} />
                    Explore
                  </button>
                </div>
              )}
            </div>
          ) : (
            <DayoftheWeek onBack={() => setshowdayweek(false)} city={selectedCity} />
          )}
        </div>

        <div className='containerWeatherApp'>
          <div className='BarrapreferitiApp'>
            <Preferiti
              iscut={handleToggle}
              city={location}
              recentcity={recentcity}
              selectionCity={selectToggle}
              selectedCity={selectedCity}
              favorites={favorites}
              onCityClick={handleCitySelect}
            />
          </div>

          <div className='containerApI'>
            <div className='top'>
              <div className='location'>
                <p>{data.name}</p>
                <div className='temperature'>
                  {data.main ? <h1>{data.main.temp.toFixed()} °C</h1> : null}
                </div>
                <div className='description'>
                  {data.weather ? <p>{data.weather[0].main}</p> : null}
                </div>
              </div>
            </div>

            {data.name != null && (
              <div className='buttom'>
                <div className='feels'>
                  {data.main ? <p className='bold'>{data.main.feels_like}</p> : null}
                  <p>feels</p>
                </div>
                <div className='humeduty'>
                  {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                  <p>humeduty</p>
                </div>
                <div className='wind'>
                  {data.wind ? <p className='bold'>{data.wind.speed} MPH</p> : null}
                  <p>wind</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}