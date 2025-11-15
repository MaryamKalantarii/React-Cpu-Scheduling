import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../Table.css";

const RLTF = ({ rows = [], quantum }) => {
  const { t } = useTranslation();
  const [executedProcesses, setExecutedProcesses] = useState([]);
  const [finalProcesses, setFinalProcesses] = useState([]);
  const avgWaitingTimeRef = useRef(0);
  const avgTurnaroundTimeRef = useRef(0);

  useEffect(() => {
    // --- مرحله ۱: چک کردن ورودی‌ها ---
    const q = Number(quantum) || 2; // پیش‌فرض ۲ اگه undefined باشه
    console.log("🚀 RLTF useEffect started");
    console.log("🧩 Input rows:", rows);
    console.log("⚙️  Quantum received:", quantum, "=> Parsed:", q);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("⚠️ rows is empty, skipping computation");
      setExecutedProcesses([]);
      setFinalProcesses([]);
      return;
    }

    if (q <= 0) {
      console.warn("⚠️ quantum invalid or <= 0, skipping computation");
      setExecutedProcesses([]);
      setFinalProcesses([]);
      return;
    }

    // --- مرحله ۲: مقداردهی اولیه ---
    let currentTime = 0;
    const remainingTimes = rows.map((p) => Number(p.burstTime));
    const waitingTimes = new Array(rows.length).fill(0);
    const turnaroundTimes = new Array(rows.length).fill(0);
    const updatedProcesses = [];

    console.log("🕓 Initial remainingTimes:", remainingTimes);

    // --- مرحله ۳: اجرای الگوریتم RLTF ---
    while (remainingTimes.some((rt) => rt > 0)) {
      console.log("🔁 Loop tick: currentTime =", currentTime);

      const available = rows
        .map((p, idx) => ({ ...p, idx }))
        .filter(
          (p) => Number(p.arrivalTime) <= currentTime && remainingTimes[p.idx] > 0
        );

      if (available.length === 0) {
        const nextArrival = Math.min(
          ...rows
            .filter((_, idx) => remainingTimes[idx] > 0)
            .map((p) => Number(p.arrivalTime))
        );
        console.log("⏩ No process ready, jumping to time", nextArrival);
        currentTime = nextArrival;
        continue;
      }

      // انتخاب پردازه با بیشترین زمان باقیمانده
      const longest = available.reduce((max, curr) =>
        remainingTimes[curr.idx] > remainingTimes[max.idx] ? curr : max
      );

      const executeTime = Math.min(q, remainingTimes[longest.idx]);
      const start = currentTime;
      currentTime += executeTime;
      remainingTimes[longest.idx] -= executeTime;

      // اگر پردازه تمام شد:
      if (remainingTimes[longest.idx] === 0) {
        const turnaround = currentTime - Number(longest.arrivalTime);
        const waiting = turnaround - Number(longest.burstTime);
        turnaroundTimes[longest.idx] = turnaround;
        waitingTimes[longest.idx] = waiting;
      }

      const slice = {
        ...longest,
        startTime: start,
        finishTime: currentTime,
        waitingTime: waitingTimes[longest.idx],
        turnaroundTime: turnaroundTimes[longest.idx],
      };
      updatedProcesses.push(slice);

      console.log("✅ Executed slice:", slice);
      console.log("📊 Remaining times:", remainingTimes);
    }

    // --- مرحله ۴: محاسبه نهایی ---
    const finals = rows.map((p) => {
      const lastExec = updatedProcesses.filter((x) => x.id === p.id).pop();
      return lastExec
        ? lastExec
        : { ...p, startTime: "-", finishTime: "-", waitingTime: "-", turnaroundTime: "-" };
    });

    avgWaitingTimeRef.current =
      waitingTimes.reduce((a, b) => a + b, 0) / rows.length;
    avgTurnaroundTimeRef.current =
      turnaroundTimes.reduce((a, b) => a + b, 0) / rows.length;

    console.log("📈 Final waitingTimes:", waitingTimes);
    console.log("📈 Final turnaroundTimes:", turnaroundTimes);
    console.log("📊 Final updatedProcesses:", updatedProcesses);
    console.log("✅ Averages:", {
      waiting: avgWaitingTimeRef.current,
      turnaround: avgTurnaroundTimeRef.current,
    });

    setExecutedProcesses(updatedProcesses);
    setFinalProcesses(finals);
  }, [rows, quantum]);

  return (
    <div className="container my-5">
      <h3>{t("rltf.outputTitle")}</h3>

      {(!rows || rows.length === 0) && (
        <div className="alert alert-warning">
          {t("rltf.noData") || "Please add process data first."}
        </div>
      )}

      {/* Gantt Chart */}
      <div className="d-flex justify-content-center align-items-center my-4 text-center">
        {executedProcesses.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="border p-2" style={{ width: "20%" }}
          >
            P{p.id}
            <br />
            ({p.startTime}-{p.finishTime})
          </div>
        ))}
      </div>

      {/* Table */}
      <table className="table table-bordered text-center">
        <thead>
          <tr className="table-danger">
            <th>{t("rltf.process")}</th>
            <th>{t("rltf.arrivalTime")}</th>
            <th>{t("rltf.burstTime")}</th>
            <th>{t("rltf.startTime")}</th>
            <th>{t("rltf.finishTime")}</th>
            <th>{t("rltf.waitingTime")}</th>
            <th>{t("rltf.turnaroundTime")}</th>
          </tr>
        </thead>
        <tbody>
          {finalProcesses.map((p) => (
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

      <h5>
        {t("rltf.avgWaitingTime")}:{" "}
        {avgWaitingTimeRef.current
          ? avgWaitingTimeRef.current.toFixed(2)
          : "-"}
      </h5>
      <h5>
        {t("rltf.avgTurnaroundTime")}:{" "}
        {avgTurnaroundTimeRef.current
          ? avgTurnaroundTimeRef.current.toFixed(2)
          : "-"}
      </h5>
    </div>
  );
};

export default RLTF;
