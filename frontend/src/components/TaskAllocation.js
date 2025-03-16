import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskAllocation = () => {
    // State for user inputs
    const [taskInputs, setTaskInputs] = useState({
        task_type: "",
        task_complexity: "",
        task_priority: "",
        estimated_effort_hours: ""
    });

    const [teams, setTeams] = useState([]); // Available teams from MongoDB
    const [predictedTeam, setPredictedTeam] = useState(null); // Predicted best team
    const [featureImportance, setFeatureImportance] = useState([]); // Feature impact details
    const [loading, setLoading] = useState(false); // Loading indicator

    // Fetch available teams from MongoDB when the component loads
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/get_teams")
            .then(response => setTeams(response.data))
            .catch(error => console.error("Error fetching teams:", error));
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        setTaskInputs({ ...taskInputs, [e.target.name]: e.target.value });
    };

    // Validate and Predict Task Allocation
    const handleTaskAllocation = async () => {
        const { task_type, task_complexity, task_priority, estimated_effort_hours } = taskInputs;

        // ✅ Input Validation
        if (!task_type || !task_complexity || !task_priority || !estimated_effort_hours) {
            alert("⚠️ Please fill in all fields before submitting.");
            return;
        }

        if (isNaN(estimated_effort_hours) || estimated_effort_hours <= 0) {
            alert("⚠️ Estimated Effort Hours must be a positive number.");
            return;
        }

        try {
            setLoading(true); // Show loading indicator

            const response = await axios.post("http://127.0.0.1:5000/predict_task_allocation", {
                task_type,
                task_complexity: parseInt(task_complexity),
                task_priority: parseInt(task_priority),
                estimated_effort_hours: parseFloat(estimated_effort_hours)
            });

            console.log("✅ Task Allocation Prediction:", response.data);

            // Sort feature importance by value in descending order and get top 5
            const sortedFeatures = Object.entries(response.data.feature_importance)
                .sort((a, b) => b[1] - a[1]) // Sort by impact score in descending order
                .slice(0, 5); // Take the top 5 features

            setPredictedTeam(response.data.predicted_best_team);
            setFeatureImportance(sortedFeatures); // Update state with top 5 features

        } catch (error) {
            console.error("❌ Task Allocation Prediction Error:", error);
            alert("⚠️ Error making prediction. Check console for details.");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Find the details of the predicted team
    const predictedTeamDetails = teams.find(team => team.team_id === predictedTeam);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>🛠️ Task Allocation</h2>

            {/* Task Type Dropdown */}
            <label><strong>Task Type:</strong></label>
            <select name="task_type" value={taskInputs.task_type} onChange={handleInputChange}>
                <option value="">-- Select Task Type --</option>
                <option value="Feature Development">Feature Development</option>
                <option value="Bug Fixing">Bug Fixing</option>
                <option value="Testing">Testing</option>
            </select>

            {/* Task Complexity Dropdown */}
            <label><strong>Task Complexity:</strong></label>
            <select name="task_complexity" value={taskInputs.task_complexity} onChange={handleInputChange}>
                <option value="">-- Select Complexity --</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
            </select>

            {/* Task Priority Dropdown */}
            <label><strong>Task Priority:</strong></label>
            <select name="task_priority" value={taskInputs.task_priority} onChange={handleInputChange}>
                <option value="">-- Select Priority --</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
            </select>

            {/* Estimated Effort Hours Input */}
            <label><strong>Estimated Effort Hours:</strong></label>
            <input
                type="number"
                name="estimated_effort_hours"
                value={taskInputs.estimated_effort_hours}
                onChange={handleInputChange}
                placeholder="Enter estimated hours"
            />

            {/* Predict Task Allocation Button */}
            <button onClick={handleTaskAllocation} style={{ marginTop: "10px" }}>
                {loading ? "⏳ Predicting..." : "🔍 Predict Best Team"}
            </button>

            {/* Display Predicted Best Team */}
            {predictedTeam && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                }}>
                    <h3>✅ Best Team for this Task</h3>
                    <p style={{ fontSize: "18px", fontWeight: "bold", color: "#007BFF" }}>
                        {predictedTeam}
                    </p>

                    {/* Display Team Details */}
                    {predictedTeamDetails && (
                        <div style={{ marginTop: "10px" }}>
                            <h4>📋 Team Details</h4>
                            <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "80%" }}>
                                <thead>
                                    <tr>
                                        <th>Attribute</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Team ID</td>
                                        <td>{predictedTeamDetails.team_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Experience Level</td>
                                        <td>{predictedTeamDetails.team_experience_level}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Members</td>
                                        <td>{predictedTeamDetails.total_members}</td>
                                    </tr>
                                    <tr>
                                        <td>Past Projects Completed</td>
                                        <td>{predictedTeamDetails.past_projects_completed}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Feature Importance Explanation */}
                    <h4>📌 Why this Team?</h4>
                    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "80%" }}>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Impact Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureImportance.length > 0 ? (
                                featureImportance.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item[0]}</td>
                                        <td>{(item[1] * 100).toFixed(2)}%</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No explanation available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <p style={{ fontSize: "14px", color: "#555" }}>
                        📊 **How to Read This?** Higher impact scores mean the feature played a bigger role in the team selection.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaskAllocation;