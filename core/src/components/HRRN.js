import React, { useEffect, useState, useRef } from "react";

const HRRN = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const processes = rows.map((p) => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      waitingTime: 0,
      turnaroundTime: 0,
      startTime: 0,
      finishTime: 0,
      completed: false,
    }));

    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const timeline = [];

    while (completedCount < n) {
      // فیلتر پردازه‌های آماده
      const available = processes.filter(
        (p) => p.arrivalTime <= currentTime && !p.completed
      );

      if (available.length === 0) {
        currentTime++;
        continue;
      }

      // محاسبه Response Ratio برای هر پردازه آماده
      available.forEach((p) => {
        p.responseRatio =
          (currentTime - p.arrivalTime + p.burstTime) / p.burstTime;
      });

      // انتخاب پردازه با بالاترین Response Ratio
      available.sort((a, b) => b.responseRatio - a.responseRatio);
      const current = available[0];

      // شروع و پایان زمان اجرا
      current.startTime = currentTime;
      currentTime += current.burstTime;
      current.finishTime = currentTime;

      // محاسبه زمان‌ها
      current.turnaroundTime = current.finishTime - current.arrivalTime;
      current.waitingTime = current.turnaroundTime - current.burstTime;

      current.completed = true;
      completedCount++;

      timeline.push({
        id: current.id,
        start: current.startTime,
        end: current.finishTime,
      });
    }

    // محاسبه میانگین‌ها
    let totalWT = 0,
      totalTAT = 0;

    processes.forEach((p) => {
      totalWT += p.waitingTime;
      totalTAT += p.turnaroundTime;
    });

    avgWaitingTimeRef.current = totalWT / n;
    avgTurnaroundTimeRef.current = totalTAT / n;

    setExecutedProcesses({ processes, timeline });
  }, [rows]);

  if (!executedProcesses.processes) return null;

  return (
    <div className="container my-5">
      <h4>Output for Highest Response Ratio Next (HRRN) Algorithm</h4>

      {/* نمودار گانت */}
      <div className="d-flex my-4 flex-wrap">
        {executedProcesses.timeline.map((item, i) => (
          <div
            key={i}
            className="border text-center mx-1"
            style={{
              width: `${(item.end - item.start) * 40}px`,
              background: "#C3E6CB",
            }}
          >
            P{item.id}
            <br />
            ({item.start}-{item.end})
          </div>
        ))}
      </div>

      {/* جدول خروجی */}
      <table
        className="table table-bordered text-center"
        style={{ margin: "auto" }}
      >
        <thead className="table-primary">
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Start Time</th>
            <th>Finish Time</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
            <th>Response Ratio</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.processes.map((p) => (
            <tr key={p.id}>
              <td>{`P${p.id}`}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
              <td>{p.startTime}</td>
              <td>{p.finishTime}</td>
              <td>{p.waitingTime}</td>
              <td>{p.turnaroundTime}</td>
              <td>
                {((p.turnaroundTime) / p.burstTime).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* میانگین‌ها */}
      <div className="my-4">
        <h5>Average Waiting Time: {avgWaitingTimeRef.current.toFixed(2)}</h5>
        <h5>Average Turnaround Time: {avgTurnaroundTimeRef.current.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default HRRN;