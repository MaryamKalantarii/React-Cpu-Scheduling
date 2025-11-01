import React, { useEffect, useState, useRef } from "react";

const MLFQ = ({ rows }) => {
  const [executed, setExecuted] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const processes = rows.map((p) => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      remainingTime: parseInt(p.burstTime),
      completionTime: 0,
      queueLevel: 1, // همه از صف ۱ شروع می‌کنن
    }));

    const queues = [
      { level: 1, quantum: 4 },
      { level: 2, quantum: 8 },
      { level: 3, quantum: Infinity }, // FCFS
    ];

    let time = 0;
    let executedTimeline = [];
    let completed = 0;
    const n = processes.length;

    while (completed < n) {
      const available = processes.filter(
        (p) => p.arrivalTime <= time && p.remainingTime > 0
      );

      if (available.length === 0) {
        time++;
        continue;
      }

      // پیدا کردن بالاترین صفی که پردازه داره
      const highestQueue = Math.min(...available.map((p) => p.queueLevel));
      const currentQueue = queues.find((q) => q.level === highestQueue);
      const candidates = available.filter((p) => p.queueLevel === highestQueue);

      const currentProcess = candidates[0];
      const execTime = Math.min(
        currentQueue.quantum,
        currentProcess.remainingTime
      );

      // اجرای بخشی از پردازه
      executedTimeline.push({
        id: currentProcess.id,
        start: time,
        end: time + execTime,
        queue: highestQueue,
      });

      time += execTime;
      currentProcess.remainingTime -= execTime;

      // اگه تموم شد → ثبت زمان پایان
      if (currentProcess.remainingTime === 0) {
        currentProcess.completionTime = time;
        completed++;
      } else {
        // اگه تموم نشد → انتقال به صف پایین‌تر
        if (currentProcess.queueLevel < 3) {
          currentProcess.queueLevel++;
        }
      }
    }

    // محاسبه WT و TAT
    let totalWT = 0,
      totalTAT = 0;

    const finalData = processes.map((p) => {
      const turnaround = p.completionTime - p.arrivalTime;
      const waiting = turnaround - p.burstTime;
      totalWT += waiting;
      totalTAT += turnaround;
      return {
        ...p,
        turnaroundTime: turnaround,
        waitingTime: waiting,
      };
    });

    avgWaitingTimeRef.current = totalWT / n;
    avgTurnaroundTimeRef.current = totalTAT / n;

    setExecuted({ timeline: executedTimeline, data: finalData });
  }, [rows]);

  if (!executed.data) return null;

  return (
    <div className="container my-5">
      <h4>Output for Multi-Level Feedback Queue (MLFQ) Algorithm</h4>

      {/* Gantt Chart */}
      <div className="d-flex my-4 flex-wrap">
        {executed.timeline.map((e, i) => (
          <div
            key={i}
            className="border text-center mx-1"
            style={{
              width: `${(e.end - e.start) * 40}px`,
              background:
                e.queue === 1
                  ? "#A7D8FF"
                  : e.queue === 2
                  ? "#FFD59E"
                  : "#D1FFD1",
            }}
          >
            P{e.id}
            <br />
            ({e.start}-{e.end})
            <br />
            <small>Q{e.queue}</small>
          </div>
        ))}
      </div>

      {/* جدول */}
      <table
        className="table table-bordered text-center"
        style={{ margin: "auto" }}
      >
        <thead className="table-primary">
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            <th>Final Queue</th>
            <th>Completion Time</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {executed.data.map((p) => (
            <tr key={p.id}>
              <td>{`P${p.id}`}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
              <td>{p.queueLevel}</td>
              <td>{p.completionTime}</td>
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

export default MLFQ;
