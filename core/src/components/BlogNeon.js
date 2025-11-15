import React from "react";
import "./BlogNeon.css";

const algorithms = [
  { name: "FIFO", description: "Processes are executed in the order they arrive. Simple, but may cause long waiting times for some processes." },
  { name: "SJF", description: "The process with the shortest CPU burst time is selected first. Reduces average waiting time but requires knowledge of process lengths." },
  { name: "SRT", description: "Preemptive version of SJF. A newly arrived shorter process can interrupt the running process." },
  { name: "LJF", description: "The process with the longest burst time is selected. Rarely used." },
  { name: "RLTF", description: "Preemptive version of LJF where a longer process can interrupt the current process." },
  { name: "RR", description: "Each process is given a time quantum. If not finished, it goes to the end of the queue." },
  { name: "Non-Preemptive", description: "The current process runs to completion before the next process is scheduled." },
  { name: "Multilevel Queue (MLQ)", description: "Processes are divided into multiple queues, each with its own scheduling policy." },
  { name: "Multilevel Feedback Queue (MLFQ)", description: "Processes move between queues to achieve fairer scheduling." },
  { name: "Earliest Deadline First (EDF)", description: "The process with the closest deadline is executed first. Suitable for real-time systems." },
  { name: "Fixed Priority Preemptive Scheduling (FPPS)", description: "Processes with higher fixed priority can preempt lower priority processes." },
  { name: "Highest Response Ratio Next (HRRN)", description: "The process with the highest response ratio (waiting time + burst time / burst time) is executed next." },
];

const BlogNeon = () => {
  return (
    <div className="blog-neon-container">
      <h1 className="blog-title">CPU Scheduling Algorithms</h1>
      <div className="cards-container">
        {algorithms.map((algo, index) => (
          <div key={index} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">{algo.name}</div>
              <div className="flip-card-back">{algo.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogNeon;

