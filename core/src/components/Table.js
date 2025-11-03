import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const Table = ({ onEvaluate = () => {} }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(false);
  const [quantum, setQuantum] = useState("");
  const [showAlgo, setShowAlgo] = useState("");
  const [rows, setRows] = useState([
    { id: "1", arrivalTime: "", burstTime: "", priority: "" },
    { id: "2", arrivalTime: "", burstTime: "", priority: "" },
    { id: "3", arrivalTime: "", burstTime: "", priority: "" },
  ]);

  useEffect(() => {
    setRows([
      { id: "1", arrivalTime: "", burstTime: "", priority: "" },
      { id: "2", arrivalTime: "", burstTime: "", priority: "" },
      { id: "3", arrivalTime: "", burstTime: "", priority: "" },
    ]);
  }, [title]);
  

  const addRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, arrivalTime: "", burstTime: "", priority: "" },
    ]);
  };

  const removeRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const setAlgo = (algoName) => {
    setTitle(algoName);
    setPriority(
      algoName === "Priority Preemptive" || algoName === "Priority Non-Preemptive"
    );
    setQuantum(algoName === "RR" ? true : false);
    setShowAlgo("");
  };

  const handleEvaluate = () => {
    const tableData = rows.map((row) => ({
      id: row.id,
      arrivalTime: row.arrivalTime,
      burstTime: row.burstTime,
      priority: row.priority,
    }));
  
    onEvaluate(tableData, quantum);
    setShowAlgo(title);
  
    setTimeout(() => {
      const avgWaitElem = document.querySelector("h5:nth-of-type(1)");
      const avgTurnElem = document.querySelector("h5:nth-of-type(2)");
  
      if (!avgWaitElem || !avgTurnElem) return; // اگر DOM آماده نیست، هیچ کاری نکن
  
      const avgWait = avgWaitElem.textContent.match(/[\d.]+/);
      const avgTurn = avgTurnElem.textContent.match(/[\d.]+/);
  
      if (avgWait && avgTurn) {
        const newResult = {
          algorithm: title,
          avgWaitingTime: parseFloat(avgWait[0]),
          avgTurnaroundTime: parseFloat(avgTurn[0]),
        };
  
        const existing = JSON.parse(sessionStorage.getItem("algorithmResults")) || [];
        const updated = [...existing.filter(r => r.algorithm !== title), newResult];
  
        sessionStorage.setItem("algorithmResults", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage-update"));
      }
    }, 1000); // 👈 طولانی‌تر برای RR
  };

  const renderAlgorithm = () => {
    switch (showAlgo) {
      case "SJF":
        return <Sjf rows={rows} />;
      case "RR":
        return <RoundRobinScheduler rows={rows} quantum={quantum} />;
      case "PriorityScheduling":
        return <PriorityScheduling rows={rows} />;
      case "SRT":
        return <SRT rows={rows} />;
      case "LJF":
        return <LJF rows={rows} />;
      case "RLTF":
        return <RLTF rows={rows} />;
      case "FIFO":
        return <FIFO rows={rows} />;
      case "MLQ":
        return <MLQ rows={rows} />;
      case "MLFQ":
        return <MLFQ rows={rows} />;
      case "EDF":
        return <EDF rows={rows} />;
      case "FPPS":
        return <FPPS rows={rows} />;
      case "HRRN":
        return <HRRN rows={rows} />;
      default:
        return null;
    }
  };

  return (
    <div id="algoritm" class="features section">
      <div class="container section-title" data-aos="fade-up">
        <span class="subtitle">Algoritm</span>
        <div className="d-flex justify-content-center align-items-center">
      
        <h1 className="text-center my-4">
          {title ? `${title} Algorithm` : t("selectAlgorithmTitle")}
        </h1>
        <div className="dropdown ms-4">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t("selectAlgorithm")}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><Link className="dropdown-item" onClick={() => setAlgo("FIFO")} to="#">{t("algorithms.FIFO")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("SJF")} to="#">{t("algorithms.SJF")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("SRT")} to="#">{t("algorithms.SRT")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("LJF")} to="#">{t("algorithms.LJF")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("RLTF")} to="#">{t("algorithms.RLTF")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("RR")} to="#">{t("algorithms.RoundRobin")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("Priority Non-Preemptive")} to="#">{t("algorithms.PriorityNonPreemptive")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("MLQ")} to="#">{t("algorithms.MLQ")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("MLFQ")} to="#">{t("algorithms.MLFQ")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("EDF")} to="#">{t("algorithms.EDF")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("FPPS")} to="#">{t("algorithms.FPPS")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("HRRN")} to="#">{t("algorithms.HRRN")}</Link></li>
          </ul>
        </div>
      </div>
      </div>
      

      {/* توضیحات الگوریتم */}
      {title && (
        <div className="text-center my-3">
          <p className="lead">{t(`algorithmDescriptions.${title}`)}</p>
        </div>
      )}

      <div className="container" style={{ marginTop: "3rem" }}>
        {quantum && (
          <div className="d-flex justify-content-center mb-3">
            <h5>{t("timeQuantum")}:</h5>
            <input
              value={quantum}
              onChange={(e) => setQuantum(e.target.value)}
              type="number"
              className="form-control w-auto ms-2"
            />
          </div>
        )}

        {/* جدول ورودی پردازه‌ها */}
        <table className="table text-center table-striped table-bordered" style={{ width: "70%", margin: "auto" }}>
          <thead>
            <tr>
              <th>{t("process")}</th>
              <th>{t("arrivalTime")}</th>
              <th>{t("burstTime")}</th>
              {priority && <th>{t("priority")}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>P{row.id}</td>
                <td><input type="number" value={row.arrivalTime} onChange={(e) => (row.arrivalTime = e.target.value, setRows([...rows]))} className="form-control text-center" /></td>
                <td><input type="number" value={row.burstTime} onChange={(e) => (row.burstTime = e.target.value, setRows([...rows]))} className="form-control text-center" /></td>
                {priority && (
                  <td><input type="number" value={row.priority} onChange={(e) => (row.priority = e.target.value, setRows([...rows]))} className="form-control text-center" /></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center my-3">
          <button onClick={addRow} className="btn btn-success mx-2">+</button>
          <button onClick={removeRow} className="btn btn-danger mx-2">-</button>
        </div>

        <div className="text-center">
          <button type="button" onClick={handleEvaluate} className="btn btn-primary">
            {t("calculate")}
          </button>
        </div>
      </div>

      {/* خروجی الگوریتم */}
      <div className="mt-5">{renderAlgorithm()}</div>
    </div>
  );
};

export default Table;

