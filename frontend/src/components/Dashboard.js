import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Save, 
    Calendar, 
    Clock, 
    Users, 
    RefreshCcw, 
    TrendingUp, 
    Bot, 
    Brain, 
    BarChart3,
    Target,
    AlertTriangle,
    CheckCircle,
    Zap,
    Info,
    ArrowRight,
    Database
} from "lucide-react";

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
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch available projects from MongoDB
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/get_projects")
            .then(response => setProjects(response.data))
            .catch(error => console.error("Error fetching projects:", error));
    }, []);

    // Handle project selection
    const handleProjectSelect = async (projectId) => {
        if (!projectId) return;
        
        setSelectedProject(projectId);
        setLoading(true);
        setDeadlineSaved(false);
        setAiDeadlineSaved(false);

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

            // ML prediction
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
                    const progressValue = Math.min(100, Math.max(0, ((today - start) / (end - start)) * 100));
                    setProgress(progressValue);
                }
            }, 500);

            // Gemini Timeline Prediction
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

            // Gemini Defect Prediction
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
            console.error("Error fetching project details or predictions:", error);
        } finally {
            setLoading(false);
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
                setDeadlineSaved(true);
                setTimeout(() => setDeadlineSaved(false), 3000);
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
                setTimeout(() => setAiDeadlineSaved(false), 3000);
            }
        } catch (error) {
            console.error("Error saving AI deadline:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Project Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-2 rounded-lg mr-3">
                        <Database className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#4a90e2]">Select Project</h3>
                </div>
                
                <div className="relative">
                    <select 
                        onChange={(e) => handleProjectSelect(e.target.value)} 
                        value={selectedProject}
                        className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] font-medium px-4 py-3 rounded-lg border-none appearance-none cursor-pointer text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <option value="" className="bg-white text-gray-800">Choose a project to analyze...</option>
                        {projects.map((project) => (
                            <option key={project.projectId} value={project.projectId} className="bg-white text-gray-800">
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-12">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-4 h-4 rounded-full bg-[#4a90e2] animate-bounce"></div>
                            <div className="w-4 h-4 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-4 h-4 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <p className="text-lg font-medium text-[#4a90e2]">Analyzing project data...</p>
                        <p className="text-gray-600 mt-1">This may take a few moments</p>
                    </div>
                </div>
            )}

            {/* Project Details */}
            {projectDetails && !loading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
                        <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            Project Overview
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-2xl font-bold text-[#4a90e2] mb-2">{projectDetails.name}</h4>
                                    <p className="text-gray-600 text-lg italic leading-relaxed">{projectDetails.description}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full w-fit mx-auto mb-3">
                                        <RefreshCcw className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Requirement Changes</p>
                                    <p className="text-3xl font-bold text-[#4a90e2]">{projectDetails.requirementChanges}</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full w-fit mx-auto mb-3">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Team Size</p>
                                    <p className="text-3xl font-bold text-[#4a90e2]">{projectDetails.teamSize}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Predictions */}
            {predictions && selectedProject && !loading && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* ML Predictions */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
                            <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                ML Model Predictions
                            </h3>
                            <p className="text-gray-600 mt-1">Data-driven timeline analysis</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Original Timeline</span>
                                        <span className="text-2xl font-bold text-[#4a90e2]">{predictions.predicted_timeline_days_before_impact} days</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Extra Days (Changes)</span>
                                        <span className="text-2xl font-bold text-orange-600">+{Math.round(predictions.predicted_timeline_days_after_impact - predictions.predicted_timeline_days_before_impact)} days</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Final Timeline</span>
                                        <span className="text-2xl font-bold text-green-600">{predictions.predicted_timeline_days_after_impact} days</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Predicted Defects</span>
                                        <span className="text-2xl font-bold text-red-600">{predictions.predicted_defect_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Timeline */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#50E3C2]/10 to-[#f5a623]/10 border-b border-gray-200/50 p-6">
                            <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                Project Timeline
                            </h3>
                            <p className="text-gray-600 mt-1">Key dates and milestones</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Start Date */}
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600 mb-2">Project Start Date</p>
                                <div className="bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white px-6 py-3 rounded-lg font-bold text-lg">
                                    {startDate ? new Date(startDate).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : "Not available"}
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-600 mb-2">ML Predicted End Date</p>
                                {endDate ? (
                                    <div>
                                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg font-bold text-xl mb-4">
                                            {new Date(endDate).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        
                                        <button
                                            onClick={handleSaveDeadline}
                                            className="bg-gradient-to-r from-[#f5a623] to-[#e09612] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save as Deadline
                                        </button>
                                        
                                        {deadlineSaved && (
                                            <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center justify-center">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Deadline saved successfully!
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 border-4 border-[#50E3C2] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Predictions */}
            {aiTimeline && aiDefects && !loading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-gray-200/50 p-6">
                        <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                            <Bot className="h-5 w-5 mr-2" />
                            AI-Powered Analysis
                        </h3>
                        <p className="text-gray-600 mt-1">Advanced AI insights and recommendations</p>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* AI Timeline */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg mr-3">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#4a90e2]">AI Timeline Prediction</h4>
                                </div>
                                <div className="text-center mb-4">
                                    <p className="text-4xl font-bold text-purple-600 mb-2">{aiTimeline} Days</p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <Brain className="h-4 w-4 inline mr-2" />
                                        {aiTimelineReason}
                                    </p>
                                </div>
                            </div>
                            
                            {/* AI Defects */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg mr-3">
                                        <AlertTriangle className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#4a90e2]">AI Defect Prediction</h4>
                                </div>
                                <div className="text-center mb-4">
                                    <p className="text-4xl font-bold text-red-600 mb-2">{aiDefects}</p>
                                    <p className="text-sm text-gray-600">Estimated defects</p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <Brain className="h-4 w-4 inline mr-2" />
                                        {aiDefectsReason}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI End Date */}
                        {aiEndDate && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                                <div className="text-center space-y-4">
                                    <h4 className="text-lg font-bold text-[#4a90e2] flex items-center justify-center">
                                        <Target className="h-5 w-5 mr-2" />
                                        AI Predicted End Date
                                    </h4>
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-xl">
                                        {new Date(aiEndDate).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={handleSaveAIDeadline}
                                        className="bg-gradient-to-r from-[#f5a623] to-[#e09612] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save AI Deadline
                                    </button>
                                    
                                    {aiDeadlineSaved && (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            AI deadline saved successfully!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Impact Guide */}
            {predictions && !loading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b border-gray-200/50 p-6">
                        <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Requirement Change Impact Guide
                        </h3>
                        <p className="text-gray-600 mt-1">Understanding how changes affect your timeline</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left p-4 font-semibold text-gray-700">Requirement Changes</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Impact Factor</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Timeline Effect</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">0 - 2 Changes</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">1.0x</span>
                                    </td>
                                    <td className="p-4 text-green-600 font-medium">No Extra Days</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">3 - 5 Changes</td>
                                    <td className="p-4">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">1.1x</span>
                                    </td>
                                    <td className="p-4 text-yellow-600 font-medium">+10% Extra Days</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">6+ Changes</td>
                                    <td className="p-4">
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">1.2x+</span>
                                    </td>
                                    <td className="p-4 text-red-600 font-medium">+20% Extra Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            {selectedProject && !loading && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate("/model-performance")}
                        className="flex-1 bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        View Model Performance
                    </button>
                    
                    <button 
                        onClick={() => navigate("/task-allocation")}
                        className="flex-1 bg-gradient-to-r from-[#50E3C2] to-[#f5a623] text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                        <Users className="h-5 w-5 mr-2" />
                        Go to Task Allocation
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;