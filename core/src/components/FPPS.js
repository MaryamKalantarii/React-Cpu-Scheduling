import React, { useEffect, useState, useRef } from "react";

const FPPS = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const processes = rows.map((p) => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      remainingTime: parseInt(p.burstTime),
      priority: parseInt(p.priority),
      waitingTime: 0,
      turnaroundTime: 0,
      finishTime: 0,
      startTime: null,
      completed: false,
    }));

    let time = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];

    while (completed < n) {
      // پیدا کردن پردازه‌های آماده
      const available = processes.filter(
        (p) => p.arrivalTime <= time && !p.completed
      );

      if (available.length === 0) {
        time++;
        continue;
      }

      // انتخاب پردازه با بالاترین اولویت (عدد کمتر)
      available.sort((a, b) => a.priority - b.priority);
      const current = available[0];

      // ثبت زمان شروع اولین بار اجرا
      if (current.startTime === null) current.startTime = time;

      // اجرای یک واحد زمانی
      time++;
      current.remainingTime--;

      // ثبت بازه اجرا برای نمودار گانت
      if (
        timeline.length === 0 ||
        timeline[timeline.length - 1].id !== current.id
      ) {
        timeline.push({ id: current.id, start: time - 1, end: time });
      } else {
        timeline[timeline.length - 1].end = time;
      }

      // اگر پردازه تمام شد
      if (current.remainingTime === 0) {
        current.completed = true;
        current.finishTime = time;
        current.turnaroundTime = current.finishTime - current.arrivalTime;
        current.waitingTime = current.turnaroundTime - current.burstTime;
        completed++;
      }
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
      <h4>Fixed Priority Preemptive Scheduling (FPPS)</h4>

      {/* نمودار گانت */}
      <div className="d-flex my-4 flex-wrap">
        {executedProcesses.timeline.map((item, i) => (
          <div
            key={i}
            className="border text-center mx-1"
            style={{
              width: `${(item.end - item.start) * 40}px`,
              background: "#FAD7A0",
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
        <thead className="table-warning">
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
          {executedProcesses.processes.map((p) => (
            <tr key={p.id}>
              <td>P{p.id}</td>
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

export default FPPS;