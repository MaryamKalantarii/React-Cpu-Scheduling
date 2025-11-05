import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";

// Fixed and more robust Round Robin Scheduler component
// - Handles empty inputs (no rows)
// - Handles empty/invalid quantum safely
// - Avoids runtime errors when inputs are missing or cleared
// - Shows friendly messages instead of crashing

const RoundRobinScheduler = ({ rows = [], quantum }) => {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState([]); // All time slices (for Gantt)
  const [finalProcesses, setFinalProcesses] = useState([]); // Final row per process (for table)
  const avgWaitingTimeRef = useRef(null);
  const avgTurnaroundTimeRef = useRef(null);

  useEffect(() => {
    // Defensive checks: rows must be an array, quantum must be a positive number
    if (!Array.isArray(rows) || rows.length === 0) {
      setProcesses([]);
      setFinalProcesses([]);
      avgWaitingTimeRef.current = null;
      avgTurnaroundTimeRef.current = null;
      return;
    }

    // Normalize quantum: if it's empty string, undefined, null, or not a positive number -> treat as invalid
    const parsedQuantum = Number(quantum);
    if (!Number.isFinite(parsedQuantum) || parsedQuantum <= 0) {
      // Clear outputs but keep rows so user can see message
      setProcesses([]);
      setFinalProcesses([]);
      avgWaitingTimeRef.current = null;
      avgTurnaroundTimeRef.current = null;
      return;
    }

    const q = Math.floor(parsedQuantum);

    // Ensure arrivalTime and burstTime can be parsed safely; fallback to 0 if missing
    const safeRows = rows.map((r, idx) => ({
      id: r.id ?? idx + 1,
      arrivalTime: r.arrivalTime === "" || r.arrivalTime == null ? 0 : Number(r.arrivalTime),
      burstTime: r.burstTime === "" || r.burstTime == null ? 0 : Number(r.burstTime),
      // preserve other props
      ...r,
    }));

    const sortedRows = safeRows.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    const remainingBurstTimes = sortedRows.map((row) => Math.max(0, Math.floor(Number(row.burstTime) || 0)));
    const originalBurstTimes = sortedRows.map((row) => Math.max(0, Math.floor(Number(row.burstTime) || 0)));

    const waitingTimes = new Array(sortedRows.length).fill(0);
    const turnaroundTimes = new Array(sortedRows.length).fill(0);

    const slices = [];

    // If all burst times are zero, just return final zeroed processes
    if (remainingBurstTimes.every((bt) => bt === 0)) {
      const finals = sortedRows.map((r, i) => ({
        ...r,
        startTime: null,
        finishTime: null,
        waitingTime: 0,
        turnaroundTime: 0,
      }));
      setProcesses([]);
      setFinalProcesses(finals);
      avgWaitingTimeRef.current = 0;
      avgTurnaroundTimeRef.current = 0;
      return;
    }

    // Round Robin simulation
    // We also handle CPU idle time when next arrival is later than currentTime
    while (remainingBurstTimes.some((bt) => bt > 0)) {
      let progressedThisCycle = false;

      for (let i = 0; i < sortedRows.length; i++) {
        // skip finished processes
        if (remainingBurstTimes[i] <= 0) continue;

        // if process has not arrived yet, skip but if no process available (all future arrivals), advance time
        if (sortedRows[i].arrivalTime > currentTime) {
          // check if there exists any other process that has arrived and not finished
          const anyArrived = sortedRows.some((r, idx) => r.arrivalTime <= currentTime && remainingBurstTimes[idx] > 0);
          if (!anyArrived) {
            // jump currentTime to this process arrival (CPU idle period)
            currentTime = sortedRows[i].arrivalTime;
          }
        }

        if (sortedRows[i].arrivalTime > currentTime) {
          // still not arrived after potential jump -> continue to next
          continue;
        }

        const executeTime = Math.min(q, remainingBurstTimes[i]);
        const start = currentTime;
        currentTime += executeTime;
        remainingBurstTimes[i] -= executeTime;

        // record slice
        slices.push({
          ...sortedRows[i],
          startTime: start,
          finishTime: currentTime,
          executed: executeTime,
        });

        // If finished, compute final turnaround and waiting
        if (remainingBurstTimes[i] === 0) {
          const turnaroundTime = currentTime - sortedRows[i].arrivalTime;
          const waitingTime = turnaroundTime - originalBurstTimes[i];
          turnaroundTimes[i] = turnaroundTime;
          waitingTimes[i] = waitingTime;
        }

        progressedThisCycle = true;
      }

      // protection to avoid infinite loop (shouldn't happen but safe guard)
      if (!progressedThisCycle) break;
    }

    // Build finalProcesses: for each original process, pick last slice for start/finish shown in table
    const finals = sortedRows.map((row) => {
      const slicesForId = slices.filter((s) => s.id === row.id);
      if (slicesForId.length === 0) {
        return {
          ...row,
          startTime: null,
          finishTime: null,
          waitingTime: 0,
          turnaroundTime: 0,
        };
      }
      const last = slicesForId[slicesForId.length - 1];
      const idx = sortedRows.findIndex((r) => r.id === row.id);
      return {
        ...row,
        startTime: slicesForId[0].startTime, // show first start
        finishTime: last.finishTime,
        waitingTime: waitingTimes[idx] ?? 0,
        turnaroundTime: turnaroundTimes[idx] ?? last.finishTime - row.arrivalTime,
      };
    });

    const totalWaiting = waitingTimes.reduce((acc, v) => acc + (v || 0), 0);
    const totalTurnaround = turnaroundTimes.reduce((acc, v) => acc + (v || 0), 0);
    const n = sortedRows.length;

    avgWaitingTimeRef.current = n > 0 ? totalWaiting / n : null;
    avgTurnaroundTimeRef.current = n > 0 ? totalTurnaround / n : null;

    setProcesses(slices);
    setFinalProcesses(finals);
  }, [rows, quantum]);

  // Rendering
  // If no rows -> ask user to add data
  const showNoData = !Array.isArray(rows) || rows.length === 0;
  const parsedQuantum = Number(quantum);
  const quantumInvalid = !Number.isFinite(parsedQuantum) || parsedQuantum <= 0;

  return (
    <div className="container my-5">
      <h4>{t("rr.outputTitle")}</h4>

      {showNoData && (
        <div className="alert alert-warning" role="alert">
          {t("rr.noData") || "No input data provided. Please add processes."}
        </div>
      )}

      {!showNoData && quantumInvalid && (
        <div className="alert alert-warning" role="alert">
          {t("rr.invalidQuantum") || "Quantum is empty or invalid. Please enter a positive number."}
        </div>
      )}

      {/* Gantt Chart */}
      {processes.length > 0 && (
        <div className="d-flex my-4 align-items-end" style={{ gap: 6 }}>
          {processes.map((process, index) => {
            const width = Math.max(20, (process.executed || 1) * 12); // simple visual scaling
            return (
              <div
                key={index}
                className="text-center p-1"
                style={{ height: 40, minWidth: width }}
                title={`P${process.id}: ${process.startTime} - ${process.finishTime}`}
              >
                P{process.id}
                <br />
                ({process.startTime}-{process.finishTime})
              </div>
            );
          })}
        </div>
      )}

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
          {finalProcesses.map((process) => (
            <tr key={process.id}>
              <td>{`P${process.id}`}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.startTime ?? "-"}</td>
              <td>{process.finishTime ?? "-"}</td>
              <td>{process.waitingTime}</td>
              <td>{process.turnaroundTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Averages */}
      <div className="my-4">
        <h5>
          {t("rr.avgWaitingTime")}: {avgWaitingTimeRef.current != null ? avgWaitingTimeRef.current.toFixed(2) : "-"}
        </h5>
        <h5>
          {t("rr.avgTurnaroundTime")}: {avgTurnaroundTimeRef.current != null ? avgTurnaroundTimeRef.current.toFixed(2) : "-"}
        </h5>
      </div>
    </div>
  );
};

export default RoundRobinScheduler;

