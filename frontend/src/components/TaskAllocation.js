import React, { useState, useEffect } from "react";
import {
  Users,
  Target,
  Zap,
  BarChart3,
  Bot,
  Brain,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Database,
  Settings,
  Star,
  Trophy,
  User,
  Activity,
  AlertCircle,
  Info
} from "lucide-react";

import axios from 'axios';

const TaskAllocation = () => {
  const [taskInputs, setTaskInputs] = useState({
    task_type: "",
    task_complexity: "",
    task_priority: "",
    estimated_effort_hours: ""
  });

  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);

  const [predictedTeam, setPredictedTeam] = useState(null);
  const [featureImportance, setFeatureImportance] = useState([]);

  const [predictedMember, setPredictedMember] = useState(null);
  const [memberReason, setMemberReason] = useState("");

  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingMember, setLoadingMember] = useState(false);

  // Fetch all projects
  useEffect(() => {
    axios.get("/api/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error("Failed to fetch projects:", err));
  }, []);

  // Fetch members when project changes
  useEffect(() => {
    if (!project) return;
    axios.get(`/api/projects/${project}/members`)
      .then(res => setMembers(res.data))
      .catch(err => console.error("Failed to fetch members:", err));
  }, [project]);

  // Fetch teams
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/get_teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error("Failed to fetch teams:", err));
  }, []);

  const handleInputChange = (e) => {
    setTaskInputs({ ...taskInputs, [e.target.name]: e.target.value });
  };

  const handleTaskAllocation = async () => {
    const { task_type, task_complexity, task_priority, estimated_effort_hours } = taskInputs;
    if (!task_type || !task_complexity || !task_priority || !estimated_effort_hours) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoadingTeam(true);
      const response = await axios.post("http://127.0.0.1:5000/predict_task_allocation", {
        task_type,
        task_complexity: parseInt(task_complexity),
        task_priority: parseInt(task_priority),
        estimated_effort_hours: parseFloat(estimated_effort_hours)
      });

      const sorted = Object.entries(response.data.feature_importance)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setPredictedTeam(response.data.predicted_best_team);
      setFeatureImportance(sorted);
    } catch (err) {
      console.error("Team prediction failed:", err);
      alert("⚠️ Could not predict best team.");
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleMemberAllocation = async () => {
    const { task_type, task_complexity, task_priority, estimated_effort_hours } = taskInputs;

    if (!project) {
      alert("⚠️ Please select a project.");
      return;
    }

    if (!task_type || !task_complexity || !task_priority || !estimated_effort_hours) {
      alert("⚠️ Please fill in all task fields.");
      return;
    }

    try {
      setLoadingMember(true);

      const response = await axios.post("http://localhost:4080/api/gemini/allocate-member", {
        taskName: task_type,
        complexity: task_complexity === "1" ? "Low" : task_complexity === "2" ? "Medium" : "High",
        priority: task_priority === "1" ? "Low" : task_priority === "2" ? "Medium" : "High",
        estimatedEffort: parseFloat(estimated_effort_hours),
        members: members.map(m => m._id)
      });

      setPredictedMember({
        name: response.data.best_member,
        experienceLevel: response.data.experienceLevel,
        completedTasks: response.data.completedTasks,
        earnedXP: response.data.earnedXP,
        reason: response.data.reason
      });
    } catch (err) {
      console.error("Member prediction failed:", err);
      alert("⚠️ Could not predict best member.");
    } finally {
      setLoadingMember(false);
    }
  };

  const predictedTeamDetails = teams.find(team => team.team_id === predictedTeam);

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case "1": return "bg-green-100 text-green-800 border-green-200";
      case "2": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "3": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "1": return "bg-blue-100 text-blue-800 border-blue-200";
      case "2": return "bg-orange-100 text-orange-800 border-orange-200";
      case "3": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-3xl lg:text-4xl font-bold">
                    Intelligent Task Allocation
                  </h1>
                  <p className="text-white/80 text-lg mt-1">
                    AI-powered team and member assignment optimization
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <Bot className="h-5 w-5 mr-2" />
                    <span className="font-medium">AI Powered</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <Target className="h-5 w-5 mr-2" />
                    <span className="font-medium">Smart Matching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-2 rounded-lg mr-3">
              <Database className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#4a90e2]">Select Project</h3>
          </div>
          
          <div className="relative">
            <select 
              value={project} 
              onChange={e => setProject(e.target.value)}
              className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] font-medium px-4 py-3 rounded-lg border-none appearance-none cursor-pointer text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <option value="" className="bg-white text-gray-800">Choose a project...</option>
              {projects.map(p => (
                <option key={p._id} value={p._id} className="bg-white text-gray-800">
                  {p.projectName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Task Configuration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
            <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Task Configuration
            </h3>
            <p className="text-gray-600 mt-1">Define task parameters for optimal allocation</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Task Type
                </label>
                <div className="relative">
                  <select 
                    name="task_type" 
                    value={taskInputs.task_type} 
                    onChange={handleInputChange}
                    className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] font-medium px-4 py-3 rounded-lg border-none appearance-none cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <option value="" className="bg-white text-gray-800">-- Select Task Type --</option>
                    <option value="Feature Development" className="bg-white text-gray-800">Feature Development</option>
                    <option value="Bug Fixing" className="bg-white text-gray-800">Bug Fixing</option>
                    <option value="Testing" className="bg-white text-gray-800">Testing</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Task Complexity */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Task Complexity
                </label>
                <div className="relative">
                  <select 
                    name="task_complexity" 
                    value={taskInputs.task_complexity} 
                    onChange={handleInputChange}
                    className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] font-medium px-4 py-3 rounded-lg border-none appearance-none cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <option value="" className="bg-white text-gray-800">-- Select Complexity --</option>
                    <option value="1" className="bg-white text-gray-800">Low</option>
                    <option value="2" className="bg-white text-gray-800">Medium</option>
                    <option value="3" className="bg-white text-gray-800">High</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Task Priority */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Task Priority
                </label>
                <div className="relative">
                  <select 
                    name="task_priority" 
                    value={taskInputs.task_priority} 
                    onChange={handleInputChange}
                    className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] font-medium px-4 py-3 rounded-lg border-none appearance-none cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <option value="" className="bg-white text-gray-800">-- Select Priority --</option>
                    <option value="1" className="bg-white text-gray-800">Low</option>
                    <option value="2" className="bg-white text-gray-800">Medium</option>
                    <option value="3" className="bg-white text-gray-800">High</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Estimated Effort Hours */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Estimated Effort Hours
                </label>
                <input 
                  type="number" 
                  name="estimated_effort_hours" 
                  value={taskInputs.estimated_effort_hours}
                  onChange={handleInputChange}
                  placeholder="Enter hours..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={handleMemberAllocation}
                disabled={loadingMember}
                className="flex-1 bg-gradient-to-r from-[#7B61FF] to-[#9c88ff] text-white font-medium py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {loadingMember ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing Members...
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 mr-2" />
                    Predict Best Member
                  </>
                )}
              </button>

              <button 
                onClick={handleTaskAllocation}
                disabled={loadingTeam}
                className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#6ba3e8] text-white font-medium py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {loadingTeam ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing Teams...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 mr-2" />
                    Predict Best Team
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Task Summary */}
        {(taskInputs.task_type || taskInputs.task_complexity || taskInputs.task_priority || taskInputs.estimated_effort_hours) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-[#50E3C2] to-[#f5a623] p-2 rounded-lg mr-3">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#4a90e2]">Task Summary</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {taskInputs.task_type && (
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {taskInputs.task_type}
                </span>
              )}
              {taskInputs.task_complexity && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getComplexityColor(taskInputs.task_complexity)}`}>
                  {taskInputs.task_complexity === "1" ? "Low" : taskInputs.task_complexity === "2" ? "Medium" : "High"} Complexity
                </span>
              )}
              {taskInputs.task_priority && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(taskInputs.task_priority)}`}>
                  {taskInputs.task_priority === "1" ? "Low" : taskInputs.task_priority === "2" ? "Medium" : "High"} Priority
                </span>
              )}
              {taskInputs.estimated_effort_hours && (
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {taskInputs.estimated_effort_hours} Hours
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Team Prediction Results */}
          {predictedTeam && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#6ba3e8]/10 border-b border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  ML Team Prediction
                </h3>
                <p className="text-gray-600 mt-1">Data-driven team selection</p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-[#f5a623] to-[#e09612] text-white px-8 py-4 rounded-2xl font-bold text-2xl inline-block shadow-lg">
                    <Trophy className="h-6 w-6 inline mr-2" />
                    Team {predictedTeam}
                  </div>
                </div>

                {predictedTeamDetails && (
                  <div className="space-y-6">
                    {/* Team Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-bold text-[#4a90e2] mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Team Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#4a90e2]">{predictedTeamDetails.team_experience_level}</p>
                          <p className="text-sm text-gray-600">Experience Level</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#4a90e2]">{predictedTeamDetails.total_members}</p>
                          <p className="text-sm text-gray-600">Total Members</p>
                        </div>
                        <div className="text-center col-span-2">
                          <p className="text-2xl font-bold text-[#4a90e2]">{predictedTeamDetails.past_projects_completed}</p>
                          <p className="text-sm text-gray-600">Projects Completed</p>
                        </div>
                      </div>
                    </div>

                    {/* Feature Importance */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <h4 className="font-bold text-[#4a90e2] mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Decision Factors
                      </h4>
                      <div className="space-y-3">
                        {featureImportance.map(([feature, score], i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                            <span className="font-medium text-gray-700">{feature}</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] h-2 rounded-full" 
                                  style={{width: `${score * 100}%`}}
                                ></div>
                              </div>
                              <span className="font-bold text-[#f5a623] text-sm">{(score * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Prediction Results */}
          {predictedMember && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#7B61FF]/10 to-[#9c88ff]/10 border-b border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Member Prediction
                </h3>
                <p className="text-gray-600 mt-1">Intelligent member matching</p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-[#7B61FF] to-[#9c88ff] text-white px-8 py-4 rounded-2xl font-bold text-xl inline-block shadow-lg">
                    <User className="h-6 w-6 inline mr-2" />
                    {predictedMember.name}
                  </div>
                </div>

                {/* Member Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg w-fit mx-auto mb-2">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-[#7B61FF]">{predictedMember.earnedXP}</p>
                    <p className="text-xs text-gray-600">Experience Points</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg w-fit mx-auto mb-2">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{predictedMember.completedTasks}</p>
                    <p className="text-xs text-gray-600">Completed Tasks</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg w-fit mx-auto mb-2">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-lg font-bold text-orange-600">{predictedMember.experienceLevel}</p>
                    <p className="text-xs text-gray-600">Experience Level</p>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-[#4a90e2] mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Analysis
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{predictedMember.reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading States */}
        {(loadingTeam || loadingMember) && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
              <div className="flex items-center space-x-2 mb-4 justify-center">
                <div className="w-4 h-4 rounded-full bg-[#4a90e2] animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-lg font-medium text-[#4a90e2]">
                {loadingTeam ? "Analyzing teams..." : "Analyzing members..."}
              </p>
              <p className="text-gray-600 mt-1">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAllocation;