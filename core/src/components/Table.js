import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sjf from "./Sjf";
import RoundRobinScheduler from "./RR";
import FIFO from "./FIFO";
import SRT from "./SRT";
import LJF from "./LJF";
import RLTF from "./RLTF";
import PriorityScheduling from "./PriorityScheduling";
import MLQ from "./MLQ";
import MLFQ from "./MLFQ";
import EDF from "./EDF";
import FPPS from "./FPPS";
import HRRN from "./HRRN";
import "../Table.css";

const algorithms = [
  "FIFO", "SJF", "SRT", "LJF", "RLTF", "RR", 
  "PriorityNonPreemptive", "MLQ", "MLFQ", "EDF", "FPPS", "HRRN"
];

const Table = ({ onEvaluate = () => {} }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(false);
  const [quantum, setQuantum] = useState("");
  const [showAlgo, setShowAlgo] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (title) {
      setRows([
        { id: 1, arrivalTime: "", burstTime: "", priority: "" },
        { id: 2, arrivalTime: "", burstTime: "", priority: "" },
        { id: 3, arrivalTime: "", burstTime: "", priority: "" },
      ]);
    } else {
      setRows([]);
    }
    setShowAlgo(false);
  }, [title]);

  const addRow = () =>
    setRows([...rows, { id: rows.length + 1, arrivalTime: "", burstTime: "", priority: "" }]);

  const removeRow = () => {
    if (rows.length > 1) setRows(rows.slice(0, -1));
  };

  const setAlgo = (algoName) => {
    setTitle(algoName);
    setPriority(algoName.includes("Priority"));
    setQuantum(algoName === "RR" ? 1 : "");
    setShowAlgo(false);
  };

  const handleEvaluate = () => {
    const tableData = rows.map(row => ({
      id: row.id,
      arrivalTime: row.arrivalTime,
      burstTime: row.burstTime,
      priority: row.priority,
    }));

    onEvaluate(tableData, quantum, title);

    // 👇 ثبت نتیجه در sessionStorage برای نمودار
    const avgWait = Math.random() * 10;   // نمونه، جایگزین با محاسبه واقعی
    const avgTurn = Math.random() * 15;   // نمونه، جایگزین با محاسبه واقعی

    const newResult = { algorithm: title, avgWaitingTime: avgWait, avgTurnaroundTime: avgTurn };
    const existing = JSON.parse(sessionStorage.getItem("algorithmResults")) || [];
    const updated = [...existing.filter(r => r.algorithm !== title), newResult];
    sessionStorage.setItem("algorithmResults", JSON.stringify(updated));

    window.dispatchEvent(new Event("storage-update"));
    setShowAlgo(true);
  };

  const renderAlgorithm = () => {
    if (!showAlgo) return null;
    switch (title) {
      case "SJF": return <Sjf rows={rows} />;
      case "RR": return <RoundRobinScheduler rows={rows} quantum={quantum || 1} />;
      case "Priority Non-Preemptive": return <PriorityScheduling rows={rows} />;
      case "SRT": return <SRT rows={rows} />;
      case "LJF": return <LJF rows={rows} />;
      case "RLTF": return <RLTF rows={rows} />;
      case "FIFO": return <FIFO rows={rows} />;
      case "MLQ": return <MLQ rows={rows} />;
      case "MLFQ": return <MLFQ rows={rows} />;
      case "EDF": return <EDF rows={rows} />;
      case "FPPS": return <FPPS rows={rows} />;
      case "HRRN": return <HRRN rows={rows} />;
      default: return null;
    }
  };

  return (
    <div id="algoritm" className="features section">
      <div className="container section-title text-center">
        <span className="subtitle">CPU Scheduling Algorithms</span>
        <h1 className="my-4">{title ? `${title} Algorithm` : t("selectAlgorithmTitle")}</h1>

        <div className="d-flex flex-column align-items-start gap-3 mb-4">
          {algorithms.map(algo => (
            <div
              key={algo}
              className={`d-flex align-items-center cursor-pointer ${title === algo ? 'selected-algo' : ''}`}
              onClick={() => setAlgo(algo)}
            >
              <span className={`algo-circle me-2 ${title === algo ? 'active' : ''}`}></span>
              <span>{t(`algorithms.${algo.replace(/\s+/g,'')}`)}</span>
            </div>
          ))}
        </div>

        {title && (
          <div className="container mt-3">
            {quantum && (
              <div className="d-flex justify-content-center mb-3 align-items-center">
                <h5 className="me-2">{t("timeQuantum")}:</h5>
                <input
                  type="number"
                  value={quantum}
                  onChange={(e) => setQuantum(e.target.value)}
                  className="form-control w-auto"
                />
              </div>
            )}

            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>{t("process")}</th>
                  <th>{t("arrivalTime")}</th>
                  <th>{t("burstTime")}</th>
                  {priority && <th>{t("priority")}</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className={`process P${row.id}`}>P{row.id}</td>
                    <td>
                      <input type="number" value={row.arrivalTime} onChange={e => {
                        const updated = [...rows];
                        updated[row.id - 1].arrivalTime = e.target.value;
                        setRows(updated);
                      }} className="form-control text-center"/>
                    </td>
                    <td>
                      <input type="number" value={row.burstTime} onChange={e => {
                        const updated = [...rows];
                        updated[row.id - 1].burstTime = e.target.value;
                        setRows(updated);
                      }} className="form-control text-center"/>
                    </td>
                    {priority && (
                      <td>
                        <input type="number" value={row.priority} onChange={e => {
                          const updated = [...rows];
                          updated[row.id - 1].priority = e.target.value;
                          setRows(updated);
                        }} className="form-control text-center"/>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row-buttons">
              <button onClick={addRow} className="btn btn-success">+</button>
              <button onClick={removeRow} className="btn btn-danger">-</button>
            </div>

            <div className="text-center">
              <button onClick={handleEvaluate} className="btn btn-primary">{t("calculate")}</button>
            </div>

            <div className="mt-5">{renderAlgorithm()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
