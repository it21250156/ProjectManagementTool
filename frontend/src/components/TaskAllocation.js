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
        <div className="p-5 font-sans">

            <div className="mb-3 font-bold">
                <label htmlFor="task_type" className="block mb-1">Task Type:</label>
                <select
                    id="task_type"
                    name="task_type"
                    value={taskInputs.task_type}
                    onChange={handleInputChange}
                    className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2"
                >
                    <option value="">-- Select Task Type --</option>
                    <option value="Feature Development">Feature Development</option>
                    <option value="Bug Fixing">Bug Fixing</option>
                    <option value="Testing">Testing</option>
                </select>
            </div>

            <div className="mb-3 font-bold">
                <label htmlFor="task_complexity" className="block mb-1">Task Complexity:</label>
                <select
                    id="task_complexity"
                    name="task_complexity"
                    value={taskInputs.task_complexity}
                    onChange={handleInputChange}
                    className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2"
                >
                    <option value="">-- Select Complexity --</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
            </div>

            <div className="mb-3 font-bold">
                <label htmlFor="task_priority" className="block mb-1">Task Priority:</label>
                <select
                    id="task_priority"
                    name="task_priority"
                    value={taskInputs.task_priority}
                    onChange={handleInputChange}
                    className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2"
                >
                    <option value="">-- Select Priority --</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
            </div>

            <div className="mb-3 font-bold">
                <label htmlFor="estimated_effort_hours" className="block mb-1">Estimated Effort Hours:</label>
                <input
                    type="number"
                    id="estimated_effort_hours"
                    name="estimated_effort_hours"
                    value={taskInputs.estimated_effort_hours}
                    onChange={handleInputChange}
                    placeholder="Enter estimated hours"
                    className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2"
                />
            </div>

            <button
                onClick={handleTaskAllocation}
                className="mt-4 px-4 py-2 bg-[#4A90E2] text-white rounded-lg cursor-pointer hover:bg-[#3A80D2]"
            >
                {loading ? "Predicting..." : "Predict Best Team"}
            </button>

            {/* Display Predicted Best Team */}
            {predictedTeam && (
                <div className="mt-8">
                    <hr className="my-5" />

                    {/* Centered predicted team section */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold text-[#4a90e2] mb-3">Best Team for this Task</h3>
                        <p className="text-2xl font-semibold text-white bg-[#f5a623] p-5 rounded-full mb-4">
                            {predictedTeam}
                        </p>
                    </div>


                    {/* Display Team Details */}
                    {predictedTeamDetails && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col p-3">
                                <h4 className="text-xl font-semibold text-[#4a90e2] mb-1">Team Details</h4>
                                <div className="shadow-lg border border-[#50e3c2] rounded-lg">
                                    <table className="table-auto w-full">
                                        <tbody>
                                            <tr>
                                                <td className="p-3 font-medium">Team Code</td>
                                                <td className="py-3 px-5 font-bold text-[#f5a623]">{predictedTeamDetails.team_id}</td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="p-3 font-medium">Experience Level</td>
                                                <td className="py-3 px-5 font-bold text-[#f5a623]">{predictedTeamDetails.team_experience_level}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium">Total Members</td>
                                                <td className="py-3 px-5 font-bold text-[#f5a623]">{predictedTeamDetails.total_members}</td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="p-3 font-medium">Past Projects Completed</td>
                                                <td className="py-3 px-5 font-bold text-[#f5a623]">{predictedTeamDetails.past_projects_completed}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Feature Importance Explanation */}
                            <div className="col p-3">
                                <h4 className="text-xl font-semibold text-[#4a90e2] mb-1">Why this Team?</h4>
                                <div className="shadow-lg border border-[#50e3c2] rounded-lg">
                                    <table className="table-auto w-full">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-3 font-medium text-left">Feature</th>
                                                <th className="p-3 font-medium text-left">Impact Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {featureImportance.length > 0 ? (
                                                featureImportance.map((item, index) => (
                                                    <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                                                        <td className="p-3">{item[0]}</td>
                                                        <td className="p-3 font-bold text-[#f5a623]">{(item[1] * 100).toFixed(2)}%</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="p-3 text-center">No explanation available.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-medium">How to Read This?</span> Higher impact scores mean the feature played a bigger role in the team selection.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskAllocation;