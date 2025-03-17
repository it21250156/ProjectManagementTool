import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectProgress = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [prediction, setPrediction] = useState(null);

    // ✅ Fetch All Projects from Node.js API
    useEffect(() => {
        axios.get("http://localhost:5001/api/projects")  // ✅ Fetches all projects
            .then(response => {
                console.log("✅ Fetched Projects:", response.data);
                setProjects(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ Error fetching projects:", error);
                setError("Failed to load projects.");
                setLoading(false);
            });
    }, []);

    // ✅ Fetch Project Details from Node.js API
    const handleProjectSelect = async (projectId) => {
        try {
            console.log(`📡 Fetching details for Project ID: ${projectId}`);

            // ✅ Fetch project details from Node.js API (not Flask)
            const projectResponse = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
            console.log("✅ Project Details:", projectResponse.data);
            setSelectedProject(projectResponse.data);

            // ✅ Fetch predictions from Flask API
            const predictionResponse = await axios.post("http://127.0.0.1:5000/predict", { project_id: projectId });
            console.log("✅ Prediction Data:", predictionResponse.data);
            setPrediction(predictionResponse.data);

        } catch (error) {
            console.error(`❌ Error fetching details for project ${projectId}:`, error);
            setError("Failed to load project details.");
        }
    };

    if (loading) return <div>⏳ Loading Projects...</div>;
    if (error) return <div style={{ color: "red" }}>❌ {error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>📌 Project Progress</h2>

            {/* 🔹 Select Project Dropdown */}
            <label><strong>Select Project:</strong></label>
            <select onChange={(e) => handleProjectSelect(e.target.value)}>
                <option value="">-- Choose a Project --</option>
                {projects.map(project => (
                    <option key={project.project_id} value={project.project_id}>
                        {project.project_id}
                    </option>
                ))}
            </select>

            {/* 🔹 Show Selected Project Details */}
            {selectedProject && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", background: "#f9f9f9" }}>
                    <h3>🔹 Project Details</h3>
                    <p><strong>Project ID:</strong> {selectedProject.project_id}</p>
                    <p><strong>Assigned Team:</strong> {selectedProject.assigned_team}</p>
                    <p><strong>Effort Hours:</strong> {selectedProject.effort_hours}</p>
                    <p><strong>Task Count:</strong> {selectedProject.task_count}</p>
                    <p><strong>Completed Tasks:</strong> {selectedProject.completed_tasks}</p> {/* ✅ NEW */}
                    <p><strong>Testing Coverage:</strong> {selectedProject.testing_coverage * 100}%</p>
                    <p><strong>Deadline:</strong> {new Date(selectedProject.deadline).toLocaleDateString()}</p> {/* ✅ NEW */}
                    <p><strong>Status:</strong> {selectedProject.status}</p> {/* ✅ NEW */}
                    <p><strong>Progress:</strong> {selectedProject.progress_percentage}%</p> {/* ✅ NEW */}
                </div>
            )}

            {/* 🔹 Show Predictions */}
            {prediction && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", background: "#e8f5e9" }}>
                    <h3>🔹 Prediction Results</h3>
                    <p><strong>📅 Predicted Timeline (Before Impact Factor):</strong> {prediction.predicted_timeline_days_before_impact} days</p>
                    <p><strong>⚡ Predicted Timeline (After Impact Factor):</strong> {prediction.predicted_timeline_days_after_impact} days</p>
                    <p><strong>🐞 Predicted Defect Count:</strong> {prediction.predicted_defect_count}</p>
                </div>
            )}
        </div>
    );
};

export default ProjectProgress;
