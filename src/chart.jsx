import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  import { format } from "date-fns";
  
  export default function HourlyTemperature({ data }) {
   const hasData = data?.list?.length > 0;

  const chartData = hasData
    ? data.list.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 1000), 'ha'),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
      }))
    : [];
  return (
     <div className="chart-container" style={{ padding: '1rem' }}>
    <h2 className="chart-title">Today's forecast</h2>
      <div className="chart-wrapper" style={{ height: 340, padding: 20,}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="time"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="tooltip">
                      <div className="tooltip-item">
                        <span className="tooltip-label">Temperatura</span>
                        <span>{payload[0].value}°</span>
                      </div>
                      <div className="tooltip-item">
                        <span className="tooltip-label">Percepita</span>
                        <span>{payload[1].value}°</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="feels_like"
              stroke="#64748b"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}