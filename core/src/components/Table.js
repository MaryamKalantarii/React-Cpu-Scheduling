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
    setQuantum(algoName === "Round Robin" ? true : false);
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
  };

  const renderAlgorithm = () => {
    switch (showAlgo) {
      case "SJF":
        return <Sjf rows={rows} />;
      case "Round Robin":
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
      default:
        return null;
    }
  };

  return (
    <div style={{ background: "rgba(250, 250, 250, 0.657)" }}>
      <div className="d-flex justify-content-center align-items-center">
        <h1 className="text-center my-4">{title ? `${title} Algorithm` : t("selectAlgorithmTitle")}</h1>
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
            <li><Link className="dropdown-item" onClick={() => setAlgo("Round Robin")} to="#">{t("algorithms.RoundRobin")}</Link></li>
            <li><Link className="dropdown-item" onClick={() => setAlgo("Priority Non-Preemptive")} to="#">{t("algorithms.PriorityNonPreemptive")}</Link></li>
          </ul>
        </div>
      </div>

      {/* توضیحات الگوریتم انتخاب شده */}
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