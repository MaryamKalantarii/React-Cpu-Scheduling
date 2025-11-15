import React, { useState, useEffect, useRef } from "react";
import "../Table.css";
import { useTranslation } from "react-i18next"; // اضافه‌شده برای چندزبانه بودن

const PriorityScheduling = ({ rows }) => {
  const { t } = useTranslation(); // هوک ترجمه
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;
      let currentTime = 0;

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
        const available = readyQueue.filter((p) => p.arrivalTime <= currentTime);

        if (available.length === 0) {
          currentTime = readyQueue[0].arrivalTime;
          continue;
        }

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
      <h4>{t("priorityNonPreemptive.outputTitle")}</h4>

      {/* گانت چارت */}
      <div className="d-flex justify-content-center align-items-center my-4 text-center">
        {executedProcesses.map((p, i) => (
          <div key={i} className="border p-2" style={{ width: "20%" }}>
            {`P${p.id}`}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>

      {/* جدول نتایج */}
      <table className="table table-bordered text-center" style={{ margin: "auto" }}>
        <thead className="table-primary">
          <tr>
            <th>{t("priorityNonPreemptive.process")}</th>
            <th>{t("priorityNonPreemptive.arrivalTime")}</th>
            <th>{t("priorityNonPreemptive.burstTime")}</th>
            <th>{t("priorityNonPreemptive.priority")}</th>
            <th>{t("priorityNonPreemptive.startTime")}</th>
            <th>{t("priorityNonPreemptive.finishTime")}</th>
            <th>{t("priorityNonPreemptive.waitingTime")}</th>
            <th>{t("priorityNonPreemptive.turnaroundTime")}</th>
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
        <h5>
          {t("priorityNonPreemptive.avgWaitingTime")}:{" "}
          {avgWaitingTimeRef.current.toFixed(2)}
        </h5>
        <h5>
          {t("priorityNonPreemptive.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

export default PriorityScheduling;