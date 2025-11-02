import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const EDF = ({ rows }) => {
  const { t } = useTranslation();
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    if (!rows || rows.length === 0) return;

    const processes = rows.map((p) => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      deadline: parseInt(p.deadline),
      remainingTime: parseInt(p.burstTime),
      startTime: null,
      finishTime: 0,
      waitingTime: 0,
      turnaroundTime: 0,
      completed: false,
    }));

    let time = 0;
    let completed = 0;
    const n = processes.length;
    const timeline = [];

    while (completed < n) {
      const available = processes.filter(
        (p) => p.arrivalTime <= time && !p.completed
      );

      if (available.length === 0) {
        time++;
        continue;
      }

      // انتخاب پردازه با زودترین deadline
      available.sort((a, b) => a.deadline - b.deadline);
      const current = available[0];

      if (current.startTime === null) current.startTime = time;

      time++;
      current.remainingTime--;

      // ذخیره بازه اجرا برای گانت چارت
      if (
        timeline.length === 0 ||
        timeline[timeline.length - 1].id !== current.id
      ) {
        timeline.push({ id: current.id, start: time - 1, end: time });
      } else {
        timeline[timeline.length - 1].end = time;
      }

      if (current.remainingTime === 0) {
        current.completed = true;
        current.finishTime = time;
        current.turnaroundTime = current.finishTime - current.arrivalTime;
        current.waitingTime = current.turnaroundTime - current.burstTime;
        completed++;
      }
    }

    // محاسبه میانگین‌ها
    let totalWT = 0,
      totalTAT = 0;

    processes.forEach((p) => {
      totalWT += p.waitingTime;
      totalTAT += p.turnaroundTime;
    });

    avgWaitingTimeRef.current = totalWT / n;
    avgTurnaroundTimeRef.current = totalTAT / n;

    setExecutedProcesses({ processes, timeline });
  }, [rows]);

  if (!executedProcesses.processes) return null;

  return (
    <div className="container my-5">
      <h4>{t("edf.outputTitle")}</h4>

      {/* گانت چارت */}
      <div className="d-flex my-4 flex-wrap">
        {executedProcesses.timeline.map((item, i) => (
          <div
            key={i}
            className="border text-center mx-1"
            style={{
              width: `${(item.end - item.start) * 40}px`,
              background: "#AED6F1",
            }}
          >
            P{item.id}
            <br />
            ({item.start}-{item.end})
          </div>
        ))}
      </div>

      {/* جدول خروجی */}
      <table
        className="table table-bordered text-center"
        style={{ margin: "auto" }}
      >
        <thead className="table-primary">
          <tr>
            <th>{t("edf.process")}</th>
            <th>{t("edf.arrivalTime")}</th>
            <th>{t("edf.burstTime")}</th>
            <th>{t("edf.deadline")}</th>
            <th>{t("edf.startTime")}</th>
            <th>{t("edf.finishTime")}</th>
            <th>{t("edf.waitingTime")}</th>
            <th>{t("edf.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {executedProcesses.processes.map((p) => (
            <tr key={p.id}>
              <td>P{p.id}</td>
              <td>{p.arrivalTime}</td>
              <td>{p.burstTime}</td>
              <td>{p.deadline}</td>
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
          {t("edf.avgWaitingTime")}: {avgWaitingTimeRef.current.toFixed(2)}
        </h5>
        <h5>
          {t("edf.avgTurnaroundTime")}:{" "}
          {avgTurnaroundTimeRef.current.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

export default EDF;