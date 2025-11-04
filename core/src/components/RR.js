import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const RoundRobinScheduler = ({ rows, quantum }) => {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState([]);
  const [processes1, setProcesses1] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0 && quantum > 0) {
      const sortedRows = rows
        .slice()
        .sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

      let currentTime = 0;
      let remainingBurstTimes = sortedRows.map((row) => parseInt(row.burstTime));
      let waitingTimes = new Array(sortedRows.length).fill(0);
      let turnaroundTimes = new Array(sortedRows.length).fill(0);

      const updatedProcesses = [];

      while (remainingBurstTimes.some((bt) => bt > 0)) {
        for (let i = 0; i < sortedRows.length; i++) {
          const burstTime = remainingBurstTimes[i];
          if (burstTime > 0) {
            const executeTime = Math.min(quantum, burstTime);
            const start = currentTime;
            currentTime += executeTime;
            remainingBurstTimes[i] -= executeTime;

            const turnaroundTime =
              currentTime - parseInt(sortedRows[i].arrivalTime);
            const waitingTime =
              turnaroundTime - parseInt(sortedRows[i].burstTime);

            waitingTimes[i] = waitingTime;
            turnaroundTimes[i] = turnaroundTime;

            updatedProcesses.push({
              ...sortedRows[i],
              startTime: start,
              finishTime: currentTime,
              waitingTime,
              turnaroundTime,
            });
          }
        }
      }

      const finalProcesses = [];

      for (let i = 0; i < sortedRows.length; i++) {
        let index = 0;
        for (let j = 0; j < updatedProcesses.length; j++) {
          if (updatedProcesses[j].id === sortedRows[i].id) {
            index = j;
          }
        }
        finalProcesses[i] = updatedProcesses[index];
      }

      const totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
      const totalTurnaroundTime = turnaroundTimes.reduce(
        (acc, val) => acc + val,
        0
      );

      avgWaitingTimeRef.current = totalWaitingTime / sortedRows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / sortedRows.length;

      setProcesses(updatedProcesses);
      setProcesses1(finalProcesses);
    }
  }, [rows, quantum]);

  return (
    <div className="container my-5">
      <h4>{t("rr.outputTitle")}</h4>

      {/* Gantt Chart */}
      <div className="d-flex my-4">
        {processes.map((process, index) => (
          <div
            key={index}
            className="border-primary-purple"
            style={{ height: "100%", width: "20%" }}
          >
            P{process.id}
            <br />
            ({process.startTime}-{process.finishTime})
          </div>
        ))}
      </div>

      {/* Table */}
      <table
        className="table text-center table-bordered"
        style={{ margin: "auto" }}
      >
        <thead>
          <tr className="table-primary">
            <th>{t("rr.process")}</th>
            <th>{t("rr.arrivalTime")}</th>
            <th>{t("rr.burstTime")}</th>
            <th>{t("rr.startTime")}</th>
            <th>{t("rr.finishTime")}</th>
            <th>{t("rr.waitingTime")}</th>
            <th>{t("rr.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {processes1.map((process) => (
            <tr key={process.id}>
              <td>{`P${process.id}`}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.startTime}</td>
              <td>{process.finishTime}</td>
              <td>{process.waitingTime}</td>
              <td>{process.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Averages */}
      <div className="my-4">
        <h5>
          {t("rr.avgWaitingTime")}:{" "}
          {avgWaitingTimeRef.current
            ? avgWaitingTimeRef.current.toFixed(2)
            : "-"}
        </h5>
        <h5>
          {t("rr.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current
            ? avgTurnaroundTimeRef.current.toFixed(2)
            : "-"}
        </h5>
      </div>
    </div>
  );
};

export default RoundRobinScheduler;