import React, { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <div className="p-5 font-sans">
      <div className="mb-3 font-bold">
        <label>Project</label>
        <select value={project} onChange={e => setProject(e.target.value)}
          className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2">
          <option value="">Select a project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.projectName}</option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="mb-3 font-bold">
          <label>Task Type</label>
          <select name="task_type" value={taskInputs.task_type} onChange={handleInputChange}
            className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2">
            <option value="">-- Select Task Type --</option>
            <option value="Feature Development">Feature Development</option>
            <option value="Bug Fixing">Bug Fixing</option>
            <option value="Testing">Testing</option>
          </select>
        </div>

        <div className="mb-3 font-bold">
          <label>Task Complexity</label>
          <select name="task_complexity" value={taskInputs.task_complexity} onChange={handleInputChange}
            className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2">
            <option value="">-- Select Complexity --</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>

        <div className="mb-3 font-bold">
          <label>Task Priority</label>
          <select name="task_priority" value={taskInputs.task_priority} onChange={handleInputChange}
            className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2">
            <option value="">-- Select Priority --</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>

        <div className="mb-3 font-bold">
          <label>Estimated Effort Hours</label>
          <input type="number" name="estimated_effort_hours" value={taskInputs.estimated_effort_hours}
            onChange={handleInputChange}
            className="border-none bg-[#50E3C2] w-full rounded-lg font-normal p-2" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button onClick={handleMemberAllocation}
          className="px-4 py-2 bg-[#7B61FF] text-white rounded-lg hover:bg-[#684be2]">
          {loadingMember ? "Predicting..." : "Predict Best Member"}
        </button>

        <button onClick={handleTaskAllocation}
          className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3A80D2]">
          {loadingTeam ? "Predicting..." : "Predict Best Team"}
        </button>
      </div>

      {/* Results */}
      {predictedTeam && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#4a90e2] mb-2">Best Team for this Task</h3>
          <p className="bg-[#f5a623] text-white rounded-full px-5 py-2 text-xl font-bold inline-block">{predictedTeam}</p>

          {predictedTeamDetails && (
            <div className="mt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#4a90e2] mb-2">Team Details</h4>
                <ul className="text-sm bg-white border p-4 rounded-lg">
                  <li>Team Code: <b>{predictedTeamDetails.team_id}</b></li>
                  <li>Experience Level: <b>{predictedTeamDetails.team_experience_level}</b></li>
                  <li>Total Members: <b>{predictedTeamDetails.total_members}</b></li>
                  <li>Past Projects Completed: <b>{predictedTeamDetails.past_projects_completed}</b></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#4a90e2] mb-2">Why this Team?</h4>
                <table className="table-auto w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Feature</th>
                      <th className="p-2 text-left">Impact Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureImportance.map(([feature, score], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-2">{feature}</td>
                        <td className="p-2 font-bold text-[#f5a623]">{(score * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {predictedMember && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#7B61FF] mb-2">Best Member for this Task</h3>
          <p className="text-lg font-bold bg-[#7B61FF] text-white inline-block px-4 py-2 rounded-full">
            👤 {predictedMember.name}
          </p>
          <ul className="mt-2 text-gray-700 text-sm">
            <li>📊 XP: {predictedMember.earnedXP}</li>
            <li>✅ Completed Tasks: {predictedMember.completedTasks}</li>
            <li>⭐ Experience: {predictedMember.experienceLevel}</li>
            <li className="mt-2">🧠 Reason: {predictedMember.reason}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskAllocation;
