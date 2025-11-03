import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const SRT = ({ rows }) => {
  const { t } = useTranslation();
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
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
        const available = processes.filter(
          (p) => p.arrivalTime <= time && p.remainingTime > 0
        );

        if (available.length === 0) {
          time++;
          continue;
        }

        const shortest = available.reduce((min, curr) =>
          curr.remainingTime < min.remainingTime ? curr : min
        );

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

        shortest.remainingTime--;
        time++;

        if (shortest.remainingTime === 0) {
          shortest.completionTime = time;
          completed++;
        }
      }

      executed.push({
        id: currentProcess,
        start: lastSwitchTime,
        end: time,
      });

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
      <h4>{t("srt.outputTitle")}</h4>

      {/* Gantt Chart */}
      <div className="d-flex my-4">
        {executed.map((e, i) => (
          <div
            key={i}
            className="border-primary-purple"
            style={{
              width: `${(e.end - e.start) * 40}px`,
             
            }}
          >
            P{e.id}
            <br />
            ({e.start}-{e.end})
          </div>
        ))}
      </div>

      {/* Table */}
      <table
        className="table table-bordered text-center"
        style={{ margin: "auto" }}
      >
        <thead className="table-primary">
          <tr>
            <th>{t("srt.process")}</th>
            <th>{t("srt.arrivalTime")}</th>
            <th>{t("srt.burstTime")}</th>
            <th>{t("srt.completionTime")}</th>
            <th>{t("srt.waitingTime")}</th>
            <th>{t("srt.turnaroundTime")}</th>
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

      {/* Averages */}
      <div className="my-4">
        <h5>
          {t("srt.avgWaitingTime")}:{" "}
          {avgWaitingTimeRef.current.toFixed(2)}
        </h5>
        <h5>
          {t("srt.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

export default SRT;