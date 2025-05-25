import React, { useState } from "react";
import axios from "axios";

const PredictDelayForANewTask = () => {
  const [form, setForm] = useState({
    level: "",
    completedTasks: "",
    avgEffortHours: "",
    onTimeDeliveryRate: "",
    currentTaskLoad: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const res = await axios.post("/api/gemini/profile-delay-prediction", {
        level: Number(form.level),
        completedTasks: Number(form.completedTasks),
        avgEffortHours: Number(form.avgEffortHours),
        onTimeDeliveryRate: Number(form.onTimeDeliveryRate),
        currentTaskLoad: Number(form.currentTaskLoad),
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to predict delay probability."
      );
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Predict Delay Probability for User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Level:
          <input type="number" name="level" value={form.level} onChange={handleChange} required min={0} />
        </label>
        <br />
        <label>
          Completed Tasks:
          <input type="number" name="completedTasks" value={form.completedTasks} onChange={handleChange} required min={0} />
        </label>
        <br />
        <label>
          Avg Effort Hours per Task:
          <input type="number" name="avgEffortHours" value={form.avgEffortHours} onChange={handleChange} required min={0} step="0.1" />
        </label>
        <br />
        <label>
          On-Time Delivery Rate (0 to 1):
          <input type="number" name="onTimeDeliveryRate" value={form.onTimeDeliveryRate} onChange={handleChange} required min={0} max={1} step="0.01" />
        </label>
        <br />
        <label>
          Current Task Load:
          <input type="number" name="currentTaskLoad" value={form.currentTaskLoad} onChange={handleChange} required min={0} />
        </label>
        <br /><br />
        <button type="submit">Predict</button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24, background: "#f6f6f6", padding: 16, borderRadius: 6 }}>
          <strong>Delay Probability:</strong> {result.delayProbability}
          <br />
          <strong>Reason:</strong> {result.reason}
        </div>
      )}
    </div>
  );
};

export default PredictDelayForANewTask;