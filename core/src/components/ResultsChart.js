import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ResultsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const updateData = () => {
      const storedResults = JSON.parse(sessionStorage.getItem("algorithmResults")) || [];
      
      // 🔹 لاگ داده‌ها برای بررسی ساختار
      console.log("📊 داده دریافتی:", storedResults);

      // فقط اگر داده‌ها معتبر باشن
      if (Array.isArray(storedResults) && storedResults.length > 0) {
        setData(storedResults);
      } else {
        setData([]);
      }
    };
  
    // بارگذاری اولیه
    updateData();
  
    // گوش دادن به event سفارشی
    window.addEventListener("storage-update", updateData);
  
    return () => {
      window.removeEventListener("storage-update", updateData);
    };
  }, []);

  if (data.length === 0) {
    return (
      <div className="text-center my-5">
        <h5>📊 هنوز هیچ داده‌ای برای مقایسه وجود ندارد</h5>
        <p>بعد از اجرای چند الگوریتم، نتایج در این نمودار نمایش داده می‌شوند.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">📈 مقایسه میانگین زمان انتظار و گردش الگوریتم‌ها</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="algorithm" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgWaitingTime" fill="#8884d8" name="میانگین زمان انتظار" />
          <Bar dataKey="avgTurnaroundTime" fill="#82ca9d" name="میانگین زمان گردش" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;