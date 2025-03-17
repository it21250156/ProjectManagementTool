import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [predictions, setPredictions] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    // ✅ Fetch available projects from MongoDB
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/get_projects")
            .then(response => setProjects(response.data))
            .catch(error => console.error("Error fetching projects:", error));
    }, []);

    // ✅ Handle project selection
    const handleProjectSelect = async (projectId) => {
        setSelectedProject(projectId);

        try {
            // ✅ Fetch project details to get the start date
            const projectResponse = await axios.get(`http://127.0.0.1:5000/get_project_details/${projectId}`);
            const projectData = projectResponse.data;
            const formattedStartDate = new Date(projectData.start_date).toISOString().split("T")[0]; // Remove time & GMT
            setStartDate(formattedStartDate);

            // ✅ Fetch predictions
            const predictResponse = await axios.post("http://127.0.0.1:5000/predict", { project_id: projectId });
            setPredictions(predictResponse.data);

            // ✅ Ensure startDate is set before calculating endDate
            setTimeout(() => {
                if (formattedStartDate) {
                    // Calculate End Date
                    const calculatedEndDate = new Date(formattedStartDate);
                    calculatedEndDate.setDate(calculatedEndDate.getDate() + predictResponse.data.predicted_timeline_days_after_impact);
                    setEndDate(calculatedEndDate.toISOString().split("T")[0]);

                    // ✅ Calculate Progress
                    const today = new Date();
                    const start = new Date(formattedStartDate);
                    const end = new Date(calculatedEndDate);
                    const progressValue = Math.min(100, ((today - start) / (end - start)) * 100);
                    setProgress(progressValue);
                }
            }, 500); // Slight delay to ensure startDate is updated
        } catch (error) {
            console.error("Error fetching project details or predictions:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>📊 Project Dashboard</h2>

            {/* ✅ Navigation Button to Task Allocation */}
            <button onClick={() => navigate("/task-allocation")} style={{ marginBottom: "10px" }}>
                ➡️ Go to Task Allocation
            </button>

            {/* ✅ Project Selection Dropdown */}
            <label><strong>Select Project:</strong></label>
            <select onChange={(e) => handleProjectSelect(e.target.value)} value={selectedProject}>
                <option value="">-- Select --</option>
                {projects.map((project) => (
                    <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                    </option>
                ))}
            </select>

            {/* ✅ Show Predictions */}
            {predictions && selectedProject && (
                <div style={{ marginTop: "20px" }}>
                    <h3>✅ Predictions</h3>
                    <p><strong>Original Predicted Project Timeline (Days):</strong> {predictions.predicted_timeline_days_before_impact}</p>
                    <p><strong>Extra Days Due to Requirement Changes:</strong> {Math.round(predictions.predicted_timeline_days_after_impact - predictions.predicted_timeline_days_before_impact)}</p>
                    <p><strong>Final Adjusted Project Timeline (Days):</strong> {predictions.predicted_timeline_days_after_impact}</p>
                    <p><strong>Predicted Defect Count:</strong> {predictions.predicted_defect_count}</p>

                    {/* ✅ Display Start and End Date */}
                    <h4>📆 Project Timeline</h4>
                    <p><strong>Start Date:</strong> {startDate || "Not available"}</p>
                    <p><strong>Estimated End Date:</strong> {endDate || "Calculating..."}</p>

                    {/* ✅ Progress Bar for Project Timeline */}
                    <div style={{ marginTop: "15px", padding: "10px", borderRadius: "10px", background: "#f9f9f9" }}>
                        <h4>📅 Project Progress</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                            <span>{startDate}</span>
                            <span>{endDate}</span>
                        </div>
                        <div style={{ width: "100%", height: "20px", background: "#e0e0e0", borderRadius: "10px", marginTop: "5px", position: "relative" }}>
                            <div style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "#37474f",
                                borderRadius: "10px",
                                transition: "width 0.5s ease-in-out"
                            }}></div>
                        </div>
                    </div>

                    {/* ✅ Impact Explanation Table */}
                    <h4>📌 Requirement Change Impact Guide</h4>
                    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "60%" }}>
                        <thead>
                            <tr>
                                <th>Requirement Changes</th>
                                <th>Impact Factor</th>
                                <th>Extra Days Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0 - 2</td>
                                <td>1.0</td>
                                <td>No Extra Days</td>
                            </tr>
                            <tr>
                                <td>3 - 5</td>
                                <td>1.1</td>
                                <td>+10% Extra Days</td>
                            </tr>
                            <tr>
                                <td>6+</td>
                                <td>1.2+</td>
                                <td>+20% Extra Days</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* ✅ Navigation Button to Model Performance */}
                    <button onClick={() => navigate("/model-performance")} style={{ marginBottom: "10px" }}>
                        📈 View Model Performance
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
