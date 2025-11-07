import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";
const MLQ = ({ rows }) => {
  const { t } = useTranslation();
  const [executed, setExecuted] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    // پاک‌سازی و مرتب‌سازی ورودی‌ها
    const processes = rows
      .map((p) => ({
        id: p.id,
        arrivalTime: parseInt(p.arrivalTime),
        burstTime: parseInt(p.burstTime),
        queueLevel: parseInt(p.queueLevel || 1), // پیش‌فرض صف ۱
        remainingTime: parseInt(p.burstTime),
        completionTime: 0,
      }))
      .filter((p) => !isNaN(p.arrivalTime) && !isNaN(p.burstTime));

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

      // تفکیک صف‌ها
      const highQueue = available.filter((p) => p.queueLevel === 1);
      const lowQueue = available.filter((p) => p.queueLevel === 2);

      let currentProcess = null;
      let execTime = 0;

      if (highQueue.length > 0) {
        // صف ۱ → Round Robin (quantum = 4)
        currentProcess = highQueue[0];
        execTime = Math.min(4, currentProcess.remainingTime);
      } else {
        // صف ۲ → FCFS
        currentProcess = lowQueue.sort(
          (a, b) => a.arrivalTime - b.arrivalTime
        )[0];
        execTime = currentProcess.remainingTime;
      }

      executedTimeline.push({
        id: currentProcess.id,
        start: time,
        end: time + execTime,
        queue: currentProcess.queueLevel,
      });

      time += execTime;
      currentProcess.remainingTime -= execTime;

      if (currentProcess.remainingTime === 0) {
        currentProcess.completionTime = time;
        completed++;
      }
    }

    // محاسبه زمان‌ها
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
      <h4>{t("mlq.outputTitle")}</h4>

      {/* گانت چارت */}
      <div className="d-flex justify-content-center align-items-center my-4 text-center">
        {executed.timeline.map((e, i) => (
          <div
            key={i}
            className="border p-2" style={{ width: "20%" }}
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
            <th>{t("mlq.process")}</th>
            <th>{t("mlq.queue")}</th>
            <th>{t("mlq.arrivalTime")}</th>
            <th>{t("mlq.burstTime")}</th>
            <th>{t("mlq.completionTime")}</th>
            <th>{t("mlq.waitingTime")}</th>
            <th>{t("mlq.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {executed.data.map((p) => (
            <tr key={p.id}>
              <td>{`P${p.id}`}</td>
              <td>{p.queueLevel}</td>
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
        <h5>
          {t("mlq.avgWaitingTime")}: {avgWaitingTimeRef.current.toFixed(2)}
        </h5>
        <h5>
          {t("mlq.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

export default MLQ;