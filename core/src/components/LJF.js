import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const LJF = ({ rows }) => {
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

      let currentTime = 0;
      const updatedExecutedProcesses = [];

      while (readyQueue.length > 0) {
        const availableProcesses = readyQueue.filter(
          (p) => parseInt(p.arrivalTime) <= currentTime
        );

        if (availableProcesses.length === 0) {
          currentTime = parseInt(readyQueue[0].arrivalTime);
          continue;
        }

        // انتخاب طولانی‌ترین کار
        const longestJob = availableProcesses.reduce((maxP, currP) =>
          parseInt(currP.burstTime) > parseInt(maxP.burstTime) ? currP : maxP
        );

        currentTime += parseInt(longestJob.burstTime);
        const waitingTime =
          currentTime -
          parseInt(longestJob.arrivalTime) -
          parseInt(longestJob.burstTime);
        const turnaroundTime = waitingTime + parseInt(longestJob.burstTime);

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        updatedExecutedProcesses.push({
          ...longestJob,
          startTime: currentTime - parseInt(longestJob.burstTime),
          finishTime: currentTime,
          waitingTime,
          turnaroundTime,
        });

        const index = readyQueue.findIndex((p) => p.id === longestJob.id);
        readyQueue.splice(index, 1);
      }

      avgWaitingTimeRef.current = totalWaitingTime / rows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / rows.length;
      setExecutedProcesses(updatedExecutedProcesses);
    }
  }, [rows]);

  return (
    <div className="container my-5">
      <h3>{t('ljf.outputTitle')}</h3>
      <div className="d-flex my-4">
        {executedProcesses.map((p) => (
          <div
            key={p.id}
            className="border-primary-purple"
            style={{ width: "20%", background: "#8c00ffff" }}
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>
      <table className="table table-bordered text-center">
        <thead>
          <tr className="table-warning">
            <th>{t('ljf.process')}</th>
            <th>{t('ljf.arrivalTime')}</th>
            <th>{t('ljf.burstTime')}</th>
            <th>{t('ljf.startTime')}</th>
            <th>{t('ljf.finishTime')}</th>
            <th>{t('ljf.waitingTime')}</th>
            <th>{t('ljf.turnaroundTime')}</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.map((p) => (
            <tr key={p.id}>
              <td>P{p.id}</td>
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
      <h5>{t('ljf.avgWaitingTime')}: {avgWaitingTimeRef.current.toFixed(2)}</h5>
      <h5>{t('ljf.avgTurnaroundTime')}: {avgTurnaroundTimeRef.current.toFixed(2)}</h5>
    </div>
  );
};

export default LJF;