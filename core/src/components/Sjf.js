import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const SJF = ({ rows }) => {
  const { t } = useTranslation();
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;

      const readyQueue = [...rows].sort(
        (a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime)
      );

      const updatedExecutedProcesses = [];
      let currentTime = 0;

      while (readyQueue.length > 0) {
        const availableProcesses = readyQueue.filter(
          (process) => parseInt(process.arrivalTime) <= currentTime
        );

        if (availableProcesses.length === 0) {
          currentTime = parseInt(readyQueue[0].arrivalTime);
          continue;
        }

        // انتخاب کوتاه‌ترین کار
        const shortestJob = availableProcesses.reduce((min, current) =>
          parseInt(current.burstTime) < parseInt(min.burstTime)
            ? current
            : min
        );

        currentTime += parseInt(shortestJob.burstTime);

        const waitingTime =
          currentTime -
          parseInt(shortestJob.arrivalTime) -
          parseInt(shortestJob.burstTime);
        const turnaroundTime = waitingTime + parseInt(shortestJob.burstTime);

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        updatedExecutedProcesses.push({
          ...shortestJob,
          startTime: currentTime - parseInt(shortestJob.burstTime),
          finishTime: currentTime,
          waitingTime,
          turnaroundTime,
        });

        const index = readyQueue.findIndex((p) => p.id === shortestJob.id);
        readyQueue.splice(index, 1);
      }

      avgWaitingTimeRef.current = totalWaitingTime / rows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / rows.length;
      setExecutedProcesses(updatedExecutedProcesses);
    }
  }, [rows]);

  return (
    <div className="container my-5">
      <h3>{t("sjf.outputTitle")}</h3>

      {/* Gantt Chart */}
      <div className="d-flex my-4">
        {executedProcesses.map((p, index) => (
          <div
            key={index}
            className=""
         
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>

      {/* Table */}
      <table
        style={{ margin: "auto" }}
        className="table text-center table-bordered"
      >
        <thead>
          <tr className="table-primary">
            <th>{t("sjf.process")}</th>
            <th>{t("sjf.arrivalTime")}</th>
            <th>{t("sjf.burstTime")}</th>
            <th>{t("sjf.startTime")}</th>
            <th>{t("sjf.finishTime")}</th>
            <th>{t("sjf.waitingTime")}</th>
            <th>{t("sjf.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.map((p, index) => (
            <tr key={index}>
              <td>{`P${p.id}`}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
              <td>{p.startTime}</td>
              <td>{p.finishTime}</td>
              <td>{p.waitingTime}</td>
              <td>{p.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Averages */}
      <div className="my-4">
        <h5>
          {t("sjf.avgWaitingTime")}:{" "}
          {avgWaitingTimeRef.current
            ? avgWaitingTimeRef.current.toFixed(2)
            : "-"}
        </h5>
        <h5>
          {t("sjf.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current
            ? avgTurnaroundTimeRef.current.toFixed(2)
            : "-"}
        </h5>
      </div>
    </div>
  );
};

export default SJF;