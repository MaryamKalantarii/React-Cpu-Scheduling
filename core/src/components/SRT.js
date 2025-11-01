import React, { useState, useEffect, useRef } from "react";

const  SRT = ({ rows }) => {
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      // تبدیل داده‌ها به اعداد صحیح
      let processes = rows
        .map((p) => ({
          id: p.id,
          arrivalTime: parseInt(p.arrivalTime),
          burstTime: parseInt(p.burstTime),
          remainingTime: parseInt(p.burstTime),
          completionTime: 0,
        }))
        .filter((p) => !isNaN(p.arrivalTime) && !isNaN(p.burstTime));

      let time = 0;
      let completed = 0;
      let n = processes.length;
      let executed = [];
      let currentProcess = null;
      let lastSwitchTime = 0;

      while (completed < n) {
        // فیلتر فرآیندهای رسیده تا زمان فعلی
        let available = processes.filter(
          (p) => p.arrivalTime <= time && p.remainingTime > 0
        );

        if (available.length === 0) {
          time++;
          continue;
        }

        // انتخاب فرآیند با کمترین زمان باقیمانده
        let shortest = available.reduce((min, curr) =>
          curr.remainingTime < min.remainingTime ? curr : min
        );

        // اگر تغییر فرآیند داریم، گانت‌چارت را به‌روز کنیم
        if (currentProcess !== shortest.id) {
          if (currentProcess !== null) {
            executed.push({
              id: currentProcess,
              start: lastSwitchTime,
              end: time,
            });
          }
          currentProcess = shortest.id;
          lastSwitchTime = time;
        }

        // اجرای ۱ واحد زمانی
        shortest.remainingTime--;
        time++;

        // اگر فرآیند تمام شد
        if (shortest.remainingTime === 0) {
          shortest.completionTime = time;
          completed++;
        }
      }

      // اضافه‌کردن آخرین قطعه اجراشده به گانت‌چارت
      executed.push({
        id: currentProcess,
        start: lastSwitchTime,
        end: time,
      });

      // محاسبه WT و TAT
      let totalWT = 0,
        totalTAT = 0;
      let finalData = processes.map((p) => {
        let turnaroundTime = p.completionTime - p.arrivalTime;
        let waitingTime = turnaroundTime - p.burstTime;
        totalWT += waitingTime;
        totalTAT += turnaroundTime;
        return { ...p, waitingTime, turnaroundTime };
      });

      avgWaitingTimeRef.current = totalWT / n;
      avgTurnaroundTimeRef.current = totalTAT / n;

      setExecutedProcesses({ executed, finalData });
    }
  }, [rows]);

  if (!executedProcesses.finalData) return null;

  const { executed, finalData } = executedProcesses;

  return (
    <div className="container my-5">
      <h4>Output for  SRT (Shortest Remaining Time First):</h4>

      {/* گانت چارت */}
      <div className="d-flex my-4">
        {executed.map((e, i) => (
          <div
            key={i}
            className="border border-primary text-center"
            style={{
              width: `${(e.end - e.start) * 40}px`,
              background: "#FFD7B5",
            }}
          >
            P{e.id}
            <br />
            ({e.start}-{e.end})
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
            <th>Completion Time</th>
            <th>Waiting Time</th>
            <th>Turnaround Time</th>
          </tr>
        </thead>
        <tbody>
          {finalData.map((p, i) => (
            <tr key={i}>
              <td>{`P${p.id}`}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
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

export default  SRT;