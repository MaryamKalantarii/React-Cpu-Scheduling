import React, { useState } from "react";
import Sjf from "./Sjf";
import RoundRobinScheduler from "./RR";

const Table = ({ onEvaluate = () => {} }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(false);
  const [quantum, setQuantum] = useState("");
  const [showSjf, setShowSjf] = useState(false);
  const [showRoundRobin, setShowRoundRobin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([
    { id: "1", arrivalTime: "", burstTime: "", priority: "" },
    { id: "2", arrivalTime: "", burstTime: "", priority: "" },
    { id: "3", arrivalTime: "", burstTime: "", priority: "" },
  ]);

  const addRow = () => {
    const newRow = { id: (rows.length + 1).toString(), arrivalTime: "", burstTime: "", priority: "" };
    setRows([...rows, newRow]);
  };

  const removeRow = () => {
    if (rows.length > 1) setRows(rows.slice(0, rows.length - 1));
  };

  const setAlgo = (algoName) => {
    setTitle(algoName);
    setPriority(algoName === "Priority Preemptive" || algoName === "Priority Non-Preemptive");
    setQuantum(algoName === "Round Robin" ? "" : false);

    setShowSjf(false);
    setShowRoundRobin(false);
  };

  const handleEvaluate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const tableData = rows.map((row) => ({
        id: row.id,
        arrivalTime: Number(row.arrivalTime),
        burstTime: Number(row.burstTime),
        priority: Number(row.priority),
      }));

      onEvaluate(tableData, Number(quantum));

      if (title === "SJF") setShowSjf(true);
      else if (title === "Round Robin") setShowRoundRobin(true);
    }, 500);
  };

  const handleRowChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  return (
    <div style={{ background: "rgba(250, 250, 250, 0.657)" }}>
      <div className="d-flex justify-content-center align-items-center my-4">
        <h1>{title || "Select Algorithm"} Algorithm</h1>
        <div className="dropdown ms-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Select Algorithm
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <button className="dropdown-item" onClick={() => setAlgo("SJF")}>
                SJF
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setAlgo("Round Robin")}>
                Round Robin
              </button>
            </li>
          </ul>
        </div>
      </div>

      {title === "Round Robin" && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <h5>Time Quantum: </h5>
          <input
            type="number"
            value={quantum}
            onChange={(e) => setQuantum(e.target.value)}
            style={{ width: "70px", marginLeft: "10px" }}
            className="form-control"
          />
        </div>
      )}

      <table className="table table-striped table-bordered text-center" style={{ width: "70%", margin: "auto" }}>
        <thead className="table-primary">
          <tr>
            <th>Process</th>
            <th>Arrival Time</th>
            <th>Burst Time</th>
            {priority && <th>Priority</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>P{row.id}</td>
              <td>
                <input
                  type="number"
                  value={row.arrivalTime}
                  onChange={(e) => handleRowChange(row.id, "arrivalTime", e.target.value)}
                  className="form-control text-center"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.burstTime}
                  onChange={(e) => handleRowChange(row.id, "burstTime", e.target.value)}
                  className="form-control text-center"
                />
              </td>
              {priority && (
                <td>
                  <input
                    type="number"
                    value={row.priority}
                    onChange={(e) => handleRowChange(row.id, "priority", e.target.value)}
                    className="form-control text-center"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center my-3">
        <button className="btn btn-link" onClick={addRow}>
          <i className="uil uil-plus-circle" style={{ fontSize: "30px" }}></i>
        </button>
        <button className="btn btn-link ms-3" onClick={removeRow}>
          <i className="uil uil-minus-circle" style={{ fontSize: "30px" }}></i>
        </button>
      </div>

      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleEvaluate}>
          Calculate
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {showSjf && <Sjf rows={rows} />}
      {showRoundRobin && <RoundRobinScheduler rows={rows} quantum={Number(quantum)} />}
    </div>
  );
};

export default Table;