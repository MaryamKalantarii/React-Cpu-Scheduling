import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const RLTF = ({ rows, quantum }) => {
  const { t } = useTranslation();
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0 && quantum > 0) {
      let currentTime = 0;
      const remainingTimes = rows.map(p => parseInt(p.burstTime));
      const waitingTimes = new Array(rows.length).fill(0);
      const turnaroundTimes = new Array(rows.length).fill(0);
      const updatedProcesses = [];

      while (remainingTimes.some(rt => rt > 0)) {
        // پیدا کردن پردازه‌های آماده
        const availableProcesses = rows
          .map((p, idx) => ({ ...p, idx }))
          .filter(p => parseInt(p.arrivalTime) <= currentTime && remainingTimes[p.idx] > 0);

        if (availableProcesses.length === 0) {
          currentTime = Math.min(...rows.filter((p, idx) => remainingTimes[idx] > 0).map(p => parseInt(p.arrivalTime)));
          continue;
        }

        // انتخاب پردازه با بیشترین زمان باقی‌مانده
        const longestProcess = availableProcesses.reduce((maxP, currP) =>
          remainingTimes[currP.idx] > remainingTimes[maxP.idx] ? currP : maxP
        );

        const executeTime = Math.min(quantum, remainingTimes[longestProcess.idx]);
        const start = currentTime;
        currentTime += executeTime;
        remainingTimes[longestProcess.idx] -= executeTime;

        const turnaroundTime = currentTime - parseInt(longestProcess.arrivalTime);
        const waitingTime = turnaroundTime - parseInt(longestProcess.burstTime);
        waitingTimes[longestProcess.idx] = waitingTime;
        turnaroundTimes[longestProcess.idx] = turnaroundTime;

        updatedProcesses.push({
          ...longestProcess,
          startTime: start,
          finishTime: currentTime,
          waitingTime,
          turnaroundTime,
        });
      }

      avgWaitingTimeRef.current = waitingTimes.reduce((a,b) => a+b,0)/rows.length;
      avgTurnaroundTimeRef.current = turnaroundTimes.reduce((a,b) => a+b,0)/rows.length;

      setExecutedProcesses(updatedProcesses);
    }
  }, [rows, quantum]);

  return (
    <div className="container my-5">
      <h3>{t('rltf.outputTitle')}</h3>
      <div className="d-flex my-4">
        {executedProcesses.map(p => (
          <div
            key={p.id}
            className="border-primary-purple"
            style={{ width: "20%", background: "#FFD1D1" }}
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>
      <table className="table table-bordered text-center">
        <thead>
          <tr className="table-danger">
            <th>{t('rltf.process')}</th>
            <th>{t('rltf.arrivalTime')}</th>
            <th>{t('rltf.burstTime')}</th>
            <th>{t('rltf.startTime')}</th>
            <th>{t('rltf.finishTime')}</th>
            <th>{t('rltf.waitingTime')}</th>
            <th>{t('rltf.turnaroundTime')}</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.map(p => (
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
      <h5>{t('rltf.avgWaitingTime')}: {avgWaitingTimeRef.current.toFixed(2)}</h5>
      <h5>{t('rltf.avgTurnaroundTime')}: {avgTurnaroundTimeRef.current.toFixed(2)}</h5>
    </div>
  );
};

export default RLTF;