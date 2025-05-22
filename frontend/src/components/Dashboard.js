import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineSaveAlt } from "react-icons/md";
import { Tooltip } from "flowbite-react";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [predictions, setPredictions] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [progress, setProgress] = useState(0);
    const [deadlineSaved, setDeadlineSaved] = useState(false);
    const [aiTimeline, setAiTimeline] = useState(null);
    const [aiTimelineReason, setAiTimelineReason] = useState("");
    const [aiDefects, setAiDefects] = useState(null);
    const [aiDefectsReason, setAiDefectsReason] = useState("");
    const [aiEndDate, setAiEndDate] = useState(null);
    const [aiDeadlineSaved, setAiDeadlineSaved] = useState(false);

    const navigate = useNavigate();

    // Fetch available projects from MongoDB
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/get_projects")
            .then(response => setProjects(response.data))
            .catch(error => console.error("Error fetching projects:", error));
    }, []);

    // Handle project selection
    const handleProjectSelect = async (projectId) => {
        setSelectedProject(projectId);
        setDeadlineSaved(false);
        setAiDeadlineSaved(false); // if you're using this

        try {
            const projectResponse = await axios.get(`http://127.0.0.1:5000/get_project_details/${projectId}`);
            const projectData = projectResponse.data;

            const formattedStartDate = new Date(projectData.start_date).toISOString().split("T")[0];
            setStartDate(formattedStartDate);

            setProjectDetails({
                name: projectData.projectName,
                description: projectData.projectDescription,
                requirementChanges: projectData.requirement_changes,
                teamSize: projectData.team_size
            });

            // ✅ ML prediction
            const predictResponse = await axios.post("http://127.0.0.1:5000/predict", { project_id: projectId });
            setPredictions(predictResponse.data);

            // Calculate end date + progress from ML
            setTimeout(() => {
                if (formattedStartDate) {
                    const calculatedEndDate = new Date(formattedStartDate);
                    calculatedEndDate.setDate(calculatedEndDate.getDate() + predictResponse.data.predicted_timeline_days_after_impact);
                    setEndDate(calculatedEndDate.toISOString().split("T")[0]);

                    const today = new Date();
                    const start = new Date(formattedStartDate);
                    const end = new Date(calculatedEndDate);
                    const progressValue = Math.min(100, ((today - start) / (end - start)) * 100);
                    setProgress(progressValue);
                }
            }, 500);

            // ✅ Gemini Timeline Prediction
            const timelineRes = await axios.post("http://localhost:4080/api/gemini/predict-timeline", {
                projectName: projectData.projectName,
                projectDescription: projectData.projectDescription,
                team_size: projectData.team_size,
                task_count: projectData.task_count,
                developer_experience: projectData.developer_experience,
                priority_level: projectData.priority_level,
                task_complexity: projectData.task_complexity,
                project_size: projectData.project_size,
                testing_coverage: projectData.testing_coverage,
                Effort_Density: projectData.Effort_Density,
                Team_Productivity: projectData.Team_Productivity,
                LoC_per_Team_Member: projectData.LoC_per_Team_Member,
                change_impact_factor: projectData.change_impact_factor
            });

            setAiTimeline(timelineRes.data.final_estimate_days_after_impact);
            setAiTimelineReason(timelineRes.data.reason);

            const aiEnd = new Date(formattedStartDate);
            aiEnd.setDate(aiEnd.getDate() + parseInt(timelineRes.data.final_estimate_days_after_impact));
            setAiEndDate(aiEnd.toISOString().split("T")[0]);

            // ✅ Gemini Defect Prediction
            const defectRes = await axios.post("http://localhost:4080/api/gemini/predict-defects", {
                projectName: projectData.projectName,
                projectDescription: projectData.projectDescription,
                defect_fix_time_minutes: projectData.defect_fix_time_minutes,
                size_added: projectData.size_added,
                size_deleted: projectData.size_deleted,
                size_modified: projectData.size_modified,
                effort_hours: projectData.effort_hours,
                task_complexity: projectData.task_complexity,
                testing_coverage: projectData.testing_coverage,
                team_key: projectData.team_key
            });

            setAiDefects(defectRes.data.predicted_defects);
            setAiDefectsReason(defectRes.data.reason);

        } catch (error) {
            console.error("Error fetching project details or Gemini predictions:", error);
        }
    };


    // Save the estimated end date as the project deadline
    const handleSaveDeadline = async () => {
        if (!selectedProject || !endDate) return;

        try {
            const response = await axios.put("http://127.0.0.1:5000/update_project_deadline", {
                project_id: selectedProject,
                project_deadline: endDate
            });

            if (response.data.message) {
                setDeadlineSaved(true); // Show success message
            }
        } catch (error) {
            console.error("Error saving project deadline:", error);
        }
    };

    const handleSaveAIDeadline = async () => {
        if (!selectedProject || !aiEndDate) return;

        try {
            const res = await axios.put("http://127.0.0.1:5000/update_project_deadline", {
                project_id: selectedProject,
                project_deadline: aiEndDate
            });
            if (res.data.message) {
                setAiDeadlineSaved(true);
            }
        } catch (error) {
            console.error("Error saving AI deadline:", error);
        }
    };


    return (
        <div>

            {/* Project Selection Dropdown */}
            <div className="mb-3 font-bold">
                <label htmlFor="select-project " className="text-xl mb-5">Select Project:</label>
                <select onChange={(e) => handleProjectSelect(e.target.value)} value={selectedProject} name="select-project" id="select-project" className="border-none bg-[#50E3C2] w-full rounded-lg font-normal">
                    <option value="">Select</option>
                    {projects.map((project) => (
                        <option key={project.projectId} value={project.projectId}>
                            {project.projectName}
                        </option>
                    ))}
                </select>
            </div>


            {/* Display Project Details */}
            {projectDetails && (
                <div>
                    <hr className="mb-5" />
                    <h3 className="text-xl font-semibold text-[#4a90e2] mb-2">Project Details</h3>
                    <div className="bg-[#50E3C2] border-none shadow-md p-3 rounded-md grid grid-cols-2">
                        <div className="col">
                            <p className="text-2xl font-semibold">{projectDetails.name}</p>
                            <p className="italic">{projectDetails.description}</p>
                        </div>
                        <div className="col p-4 rounded-xl w-max text-center grid grid-cols-2">
                            <div className="rounded-full p-10 bg-white m-1 shadow-lg">
                                <p className="italic">Requirement Changes</p>
                                <p className="font-bold text-[#4a90e2] text-4xl">{projectDetails.requirementChanges}</p>
                            </div>

                            <div className="rounded-full p-10 bg-white m-1 shadow-lg">
                                <p className="italic">Team Member Count</p>
                                <p className="font-bold text-[#4a90e2] text-4xl ">{projectDetails.teamSize}</p>
                            </div>
                        </div>

                    </div>
                </div>

            )}

            {/* Show Predictions */}
            {predictions && selectedProject && (
                <div className="">
                    <hr className="my-5" />
                    <div className="grid grid-cols-2">
                        <div className="p-3">
                            <h3 className="text-xl font-semibold text-[#4a90e2] mb-1">Predictions</h3>
                            <div className="shadow-lg border border-[#50e3c2] rounded-lg">
                                <table className="table-auto">
                                    <tbody>
                                        <tr className="">
                                            <td className="p-3 font-medium">Original Predicted Project Timeline (Days)</td>
                                            <td className="py-3 px-5 font-bold text-[#f5a623]">{predictions.predicted_timeline_days_before_impact}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium">Extra Days Due to Requirement Changes</td>
                                            <td className="py-3 px-5 font-bold text-[#f5a623]">{Math.round(predictions.predicted_timeline_days_after_impact - predictions.predicted_timeline_days_before_impact)}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium">Final Adjusted Project Timeline (Days)</td>
                                            <td className="py-3 px-5 font-bold text-[#f5a623]">{predictions.predicted_timeline_days_after_impact}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium">Predicted Defect Count</td>
                                            <td className="py-3 px-5 font-bold text-[#f5a623]">{predictions.predicted_defect_count}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Display Start and End Date */}
                        <div className="p-3">
                            <h3 className="text-xl font-semibold text-[#4a90e2] mb-1">Project Dates</h3>
                            <div className="shadow-lg border border-[#50e3c2] rounded-lg p-3 ">

                                <p className="text-md text-center">Start Date</p>
                                <div className="flex justify-center items-center">
                                    <p className="text-xl bg-[#50E3C2] text-center p-2 my-2 mx-10 rounded-md font-semibold">
                                        {startDate || "Not available"}
                                    </p>
                                </div>

                                <p className="text-md text-center mt-4">Estimated End Date</p>
                                <div className="flex justify-center items-center">
                                    {endDate ? (
                                        <p className="text-3xl bg-red-700 text-white text-center p-3 my-2 mx-10 rounded-lg font-semibold">
                                            {endDate}
                                        </p>
                                    ) : (
                                        <div
                                            className="w-20 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]"
                                        >
                                            <span
                                                className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"
                                            ></span>
                                        </div>
                                    )}
                                </div>
                                {endDate && (
                                    <div className="flex justify-center items-center my-4"> {/* Center the button */}
                                        <Tooltip content="Save Date" placement="right" className="text-black">
                                            <button
                                                onClick={handleSaveDeadline}
                                                className="p-5 rounded-full bg-[#f5a623] text-center"
                                            >
                                                <MdOutlineSaveAlt className="text-white" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                )}
                                {deadlineSaved && <p style={{ color: "green" }}> Deadline saved successfully!</p>}

                                {aiTimeline && aiDefects && (
                                    <div className="mt-10">
                                        <h3 className="text-xl font-semibold text-[#7B61FF] mb-2">🔮 AI-Based Project Prediction</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border border-[#7B61FF] rounded-lg p-4 shadow-md">
                                                <h4 className="font-bold mb-2">Predicted Timeline</h4>
                                                <p className="text-2xl font-bold text-[#7B61FF]">{aiTimeline} Days</p>
                                                <p className="text-sm text-gray-700 mt-2">🧠 {aiTimelineReason}</p>
                                            </div>
                                            <div className="border border-[#7B61FF] rounded-lg p-4 shadow-md">
                                                <h4 className="font-bold mb-2">Predicted Defects</h4>
                                                <p className="text-2xl font-bold text-[#7B61FF]">{aiDefects}</p>
                                                <p className="text-sm text-gray-700 mt-2">🧠 {aiDefectsReason}</p>
                                            </div>
                                        </div>

                                        {/* AI Estimated End Date + Save */}
                                        {aiEndDate && (
                                            <div className="mt-5">
                                                <p className="text-lg">Estimated AI End Date:</p>
                                                <p className="text-2xl font-bold text-red-600">{aiEndDate}</p>
                                                <Tooltip content="Save AI Deadline" className="text-black mt-2">
                                                    <button
                                                        onClick={handleSaveAIDeadline}
                                                        className="p-4 mt-2 rounded-full bg-[#f5a623]"
                                                    >
                                                        <MdOutlineSaveAlt className="text-white" />
                                                    </button>
                                                </Tooltip>
                                                {aiDeadlineSaved && <p style={{ color: "green" }}>AI deadline saved successfully!</p>}
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>

                    {/* Impact Explanation Table */}
                    <h4 className="text-xl font-semibold text-[#4a90e2] mb-1">Requirement Change Impact Guide</h4>
                    <div className="shadow-lg rounded-lg">
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 font-medium text-left">Requirement Changes</th>
                                    <th className="p-3 font-medium text-left">Impact Factor</th>
                                    <th className="p-3 font-medium text-left">Extra Days Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3">0 - 2</td>
                                    <td className="p-3">1.0</td>
                                    <td className="p-3">No Extra Days</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-3">3 - 5</td>
                                    <td className="p-3">1.1</td>
                                    <td className="p-3">+10% Extra Days</td>
                                </tr>
                                <tr>
                                    <td className="p-3">6+</td>
                                    <td className="p-3">1.2+</td>
                                    <td className="p-3">+20% Extra Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Navigation Button to Model Performance */}
                    <button onClick={() => navigate("/model-performance")} style={{ marginTop: "15px", padding: "10px", background: "#4A90E2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        View Model Performance
                    </button>
                </div>
            )}
            {/* Navigation Button to Task Allocation */}
            <button onClick={() => navigate("/task-allocation")}>
                Go to Task Allocation
            </button>
        </div>
    );
};

export default Dashboard;
