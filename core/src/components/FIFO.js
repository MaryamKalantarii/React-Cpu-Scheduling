import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const FIFO = ({ rows }) => {
  const { t } = useTranslation(); // اتصال به i18next
  const [processes, setProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (rows && rows.length > 0) {
      const sortedRows = rows
        .slice()
        .sort((a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime));

      let totalWaitingTime = 0;
      let totalTurnaroundTime = 0;
      let prevFinishTime = 0;

      const updatedProcesses = sortedRows.map((row, index) => {
        const startTime =
          index > 0 ? prevFinishTime : parseInt(row.arrivalTime) || 0;
        const waitingTime = startTime - parseInt(row.arrivalTime);
        const finishTime = startTime + parseInt(row.burstTime);
        const turnaroundTime = finishTime - parseInt(row.arrivalTime);

        prevFinishTime = finishTime;
        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        return {
          ...row,
          startTime,
          finishTime,
          waitingTime,
          turnaroundTime,
        };
      });

      avgWaitingTimeRef.current = totalWaitingTime / sortedRows.length;
      avgTurnaroundTimeRef.current = totalTurnaroundTime / sortedRows.length;

      setProcesses(updatedProcesses);
    }
  }, [rows]);

  return (
    <div className="container my-5">
      <h3>{t("fifo.outputTitle")}</h3>

      {/* گانت چارت */}
      <div className="d-flex my-4">
        {processes.map((p) => (
          <div
            key={p.id}
            className=""
            style={{ height: "100%", width: "20%", }}
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>

      {/* جدول */}
      <table
        style={{ margin: "auto" }}
        className="table text-center table-bordered"
      >
        <thead>
          <tr className="table-primary">
            <th>{t("fifo.process")}</th>
            <th>{t("fifo.arrivalTime")}</th>
            <th>{t("fifo.burstTime")}</th>
            <th>{t("fifo.startTime")}</th>
            <th>{t("fifo.finishTime")}</th>
            <th>{t("fifo.waitingTime")}</th>
            <th>{t("fifo.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.id}>
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

      {/* میانگین‌ها */}
      <div className="my-4">
        <h5>
          {t("fifo.avgWaitingTime")}:{" "}
          {avgWaitingTimeRef.current
            ? avgWaitingTimeRef.current.toFixed(2)
            : "-"}
        </h5>
        <h5>
          {t("fifo.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current
            ? avgTurnaroundTimeRef.current.toFixed(2)
            : "-"}
        </h5>
      </div>
    </div>
  );
};

export default FIFO;