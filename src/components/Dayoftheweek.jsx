import { useState, useEffect } from 'react';
import { CircleChevronDown, CircleChevronUp } from 'lucide-react';
import { ArrowLeft } from 'lucide-react'

export default function DayoftheWeek({ onBack, city }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const apiKey = "76dfa38e35bb3a0fb9191a278a248a23";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        const daysMap = {};
        data.list.forEach(item => {
          const date = new Date(item.dt_txt).toLocaleDateString('en-GB', {
            weekday: 'long',
            month: '2-digit',
            day: '2-digit',
          });
          if (!daysMap[date]) daysMap[date] = [];
          daysMap[date].push(item);
        });

        const today = new Date().toLocaleDateString('en-GB');
        const daysArray = Object.entries(daysMap)
          .filter(([date]) => date !== today)
          .slice(0, 5);

        setForecastData(daysArray);
      } catch (error) {
        console.error("Errore fetch meteo:", error);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]); // ✅ attiva useEffect solo quando city cambia

  return (
    <main>
      <h2 className='title-dayofweek'>Weather forecast for {city}</h2>

      <div className='dayofweek'>
        {forecastData.map(([day, blocks], index) => {
          const sample = blocks[4] || blocks[0];
          const temp = sample.main.temp;
          const description = sample.weather[0].description;
          const humidity = sample.main.humidity;
          const wind = sample.wind.speed;
          const precipitation = (sample.pop * 100).toFixed(0);
          const isActive = activeIndex === index;
          const Freccia = isActive ? CircleChevronUp : CircleChevronDown;

          return (
            <div
              key={index}
              className='forecast-day animated'
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className='headdayofweek'>
                <div><p>{day}</p></div>
                <div><p>{description}</p></div>
                <div><p>{temp}°C</p></div>
                <button
                  className='buttonIcon'
                  onClick={() => setActiveIndex(isActive ? null : index)}
                >
                  <Freccia className='freccia' />
                </button>
              </div>

              {isActive && (
                <div className='buttondayofweek'>
                  <div><p>Humidity: {humidity}%</p></div>
                  <div><p>Wind: {wind} m/s</p></div>
                  <div><p>Precipitation: {precipitation}%</p></div>
                </div>
              )}
            </div>
          );
        })}

          <div
  className="containerbottonDayofWeek animated"
  style={{ animationDelay: `${forecastData.length * 0.2}s` }}
>
  <p className="back-text">Came back to see the chart</p>
  <button className="cta-button" onClick={onBack}>
    <ArrowLeft size={18} style={{ marginRight: '8px' }} />
    Back
  </button>
</div>
          </div>
    </main>
  );
}
