import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ResultsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const updateData = () => {
      const storedResults = JSON.parse(sessionStorage.getItem("algorithmResults")) || [];
      setData(Array.isArray(storedResults) ? storedResults : []);
    };

    updateData();
    window.addEventListener("storage-update", updateData);

    return () => {
      window.removeEventListener("storage-update", updateData);
    };
  }, []);

  if (data.length === 0) return null;

  return (
    <div
      style={{
        background: "radial-gradient(circle at center, #0f0f1a 0%, #050510 100%)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 0 30px #0ff4, inset 0 0 40px #0ff2",
        overflow: "hidden", // 👈 مهم برای بریدن لبه‌های داخل چارت
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0ff",
          fontSize: "1.5rem",
          marginBottom: "10px",
          textShadow: "0 0 15px #0ff",
        }}
      >
        ⚡ نتایج الگوریتم‌ها ⚡
      </h2>

      {/* این div باعث اعمال border radius واقعی به چارت میشه */}
      <div
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          boxShadow: "0 0 20px rgba(0,255,255,0.2)",
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3d" />

            <XAxis
              dataKey="algorithm"
              tick={{ fill: "#7afcff", fontWeight: "bold" }}
              stroke="#7afcff"
            />
            <YAxis tick={{ fill: "#7afcff", fontWeight: "bold" }} stroke="#7afcff" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #0ff",
                borderRadius: "10px", // 👈 گوشه‌های گرد برای tooltip
                color: "#0ff",
                boxShadow: "0 0 15px #0ff7",
              }}
              itemStyle={{ color: "#fff" }}
            />

            <Legend
              wrapperStyle={{
                color: "#fff",
                textShadow: "0 0 10px #0ff",
              }}
            />

            <Line
              type="monotone"
              dataKey="avgWaitingTime"
              stroke="#ff00ff"
              strokeWidth={4}
              dot={{ r: 6, fill: "#ff00ff", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{
                r: 8,
                stroke: "#fff",
                strokeWidth: 2,
                fill: "#ff00ff",
                filter: "drop-shadow(0 0 10px #ff00ff)",
              }}
              name="میانگین زمان انتظار"
            />
            <Line
              type="monotone"
              dataKey="avgTurnaroundTime"
              stroke="#00ffff"
              strokeWidth={4}
              dot={{ r: 6, fill: "#00ffff", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{
                r: 8,
                stroke: "#fff",
                strokeWidth: 2,
                fill: "#00ffff",
                filter: "drop-shadow(0 0 10px #00ffff)",
              }}
              name="میانگین زمان گردش"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsChart;
