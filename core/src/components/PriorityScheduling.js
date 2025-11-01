import React, { useState, useEffect, useRef } from "react";

const PriorityScheduling = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;
      let currentTime = 0;

      // فیلتر فرآیندهای معتبر
      const processes = rows
        .map((p) => ({
          ...p,
          arrivalTime: parseInt(p.arrivalTime),
          burstTime: parseInt(p.burstTime),
          priority: parseInt(p.priority),
        }))
        .filter((p) => !isNaN(p.arrivalTime) && !isNaN(p.burstTime) && !isNaN(p.priority));

      const readyQueue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
      const executed = [];

      while (readyQueue.length > 0) {
        // فرآیندهای آماده در زمان فعلی
        const available = readyQueue.filter((p) => p.arrivalTime <= currentTime);

        if (available.length === 0) {
          currentTime = readyQueue[0].arrivalTime;
          continue;
        }

        // انتخاب فرآیند با بالاترین اولویت (عدد کوچکتر)
        const highestPriority = available.reduce((min, curr) =>
          curr.priority < min.priority ? curr : min
        );

        const startTime = currentTime;
        currentTime += highestPriority.burstTime;
        const finishTime = currentTime;

        const waitingTime = startTime - highestPriority.arrivalTime;
        const turnaroundTime = finishTime - highestPriority.arrivalTime;

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        executed.push({
          ...highestPriority,
          startTime,
          finishTime,
          waitingTime,
          turnaroundTime,
        });

        // حذف فرآیند اجراشده از صف
        const index = readyQueue.findIndex((p) => p.id === highestPriority.id);
        readyQueue.splice(index, 1);
      }

      avgWaitingTimeRef.current = totalWaitingTime / processes.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / processes.length;

      setExecutedProcesses(executed);
    }
  }, [rows]);

  return (
    <div className="container my-5">
      <h4>Output for Priority Scheduling (Non-Preemptive):</h4>

      {/* گانت چارت ساده */}
      <div className="d-flex my-4">
        {executedProcesses.map((p, i) => (
          <div
            key={i}
            className="border border-primary text-center"
            style={{ height: "100%", width: "20%", background: "#FFD7B5" }}
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>

      {/* جدول نتایج */}
      <table className="table table-bordered text-center" style={{ margin: "auto" }}>
        <thead className="table-primary">
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Priority</th>
            <th>Start Time</th>
            <th>Finish Time</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.map((p, i) => (
            <tr key={i}>
              <td>{`P${p.id}`}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
              <td>{p.priority}</td>
              <td>{p.startTime}</td>
              <td>{p.finishTime}</td>
              <td>{p.waitingTime}</td>
              <td>{p.turnaroundTime}</td>
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

export default PriorityScheduling;