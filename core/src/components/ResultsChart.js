import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <ResponsiveContainer id="chart" width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="algorithm" tick={{ fill: "#ddd" }} />
        <YAxis tick={{ fill: "#ddd" }} />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="avgWaitingTime" stroke="#ff6bcb" strokeWidth={3} dot={{ r: 5 }} name="میانگین زمان انتظار" />
        <Line type="monotone" dataKey="avgTurnaroundTime" stroke="#7afcff" strokeWidth={3} dot={{ r: 5 }} name="میانگین زمان گردش" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ResultsChart;
 