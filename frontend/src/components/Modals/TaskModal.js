import React, { useEffect, useState } from "react";
import { useTasksContext } from "../../hooks/useTasksContext";
import { X, Clock, CheckSquare } from 'lucide-react';

const TaskModal = ({ closeModal }) => {
  const { dispatch } = useTasksContext();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Low');
  const [complexity, setComplexity] = useState('Low');
  const [effortEstimate, setEffortEstimate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!project) {
      setMembers([]);
      setLoading(false);
      return;
    }
    
    const fetchMembersForProject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects/${project}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data.filter((member) => member && member._id));
        setError(null);
      } catch (err) {
        setError("Failed to load members. Please try again later.");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembersForProject();
  }, [project]);

  const fetchEstimatedDuration = async () => {
    if (!assignedTo || !complexity || !effortEstimate) {
      setError("Please select a member and fill effort estimate + complexity to get a prediction.");
      return;
    }
  
    try {
      const res = await fetch("/api/tasks/estimate-duration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          assignedTo,       
          complexity,
          effortEstimate
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const floatHours = parseFloat(data.estimatedDuration);
        const hours = Math.floor(floatHours);
        const minutes = Math.round((floatHours - hours) * 60);
        setEstimatedDuration(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        setError(null);
      } else {
        setError(data.message || "Failed to estimate duration");
      }
      
    } catch (err) {
      setError("Something went wrong while estimating duration");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Task name is required.");
      return;
    }

    const task = {
      taskName: taskName.trim(),
      description: taskDescription.trim(),
      dueDate,
      assignedTo,
      project,
      priority,
      complexity,
      effortEstimate,
      isPrivate
    };

    try {
      const response = await fetch('/api/tasks/add', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.errors || json.message || "Something went wrong.");
      } else {
        // Reset form
        setTaskName('');
        setTaskDescription('');
        setDueDate('');
        setAssignedTo('');
        setProject('');
        setPriority('Low');
        setComplexity('Low');
        setEffortEstimate('');
        setEstimatedDuration(null);
        setIsPrivate(false);
        setError(null);

        dispatch({ type: 'CREATE_TASKS', payload: json.task });
        closeModal();
      }
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error(err);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md p-4" 
      onClick={handleOverlayClick}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <CheckSquare className="mr-2 h-6 w-6" />
              Create New Task
            </h3>
            <button 
              onClick={closeModal} 
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Name */}
            <div>
              <label htmlFor="taskName" className="block text-sm font-semibold text-gray-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                id="taskName"
                required
                onChange={(e) => setTaskName(e.target.value)}
                value={taskName}
                placeholder="Enter task name"
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="taskDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="taskDescription"
                rows="3"
                onChange={(e) => setTaskDescription(e.target.value)}
                value={taskDescription}
                placeholder="Describe the task..."
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium resize-none"
              />
            </div>

            {/* Project */}
            <div>
              <label htmlFor="project" className="block text-sm font-semibold text-gray-700 mb-2">
                Project
              </label>
              <select
                id="project"
                onChange={(e) => setProject(e.target.value)}
                value={project}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
              >
                <option value="">Select a project</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.projectName}
                  </option>
                ))}
              </select>
            </div>



            {/* Assigned To */}
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-semibold text-gray-700 mb-2">
                Assigned To
              </label>
              <select
                id="assignedTo"
                onChange={(e) => setAssignedTo(e.target.value)}
                value={assignedTo}
                disabled={!project}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!project ? "Select a project first" : "Select a member"}
                </option>
                {loading ? (
                  <option value="" disabled>Loading members...</option>
                ) : (
                  members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Complexity */}
            <div>
              <label htmlFor="complexity" className="block text-sm font-semibold text-gray-700 mb-2">
                Complexity
              </label>
              <select
                id="complexity"
                onChange={(e) => setComplexity(e.target.value)}
                value={complexity}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Effort Estimate */}
            <div>
              <label htmlFor="effortEstimate" className="block text-sm font-semibold text-gray-700 mb-2">
                Effort Estimate (hours)
              </label>
              <input
                type="number"
                id="effortEstimate"
                min="0.5"
                step="0.5"
                onChange={(e) => setEffortEstimate(e.target.value)}
                value={effortEstimate}
                placeholder="e.g., 8"
                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
              />
            </div>

            {/* Private Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#4a90e2]/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#4a90e2] peer-checked:to-[#50E3C2]"></div>
                <div className="ml-3">
                  <span className="text-sm font-semibold text-gray-900">Make Private</span>
                  <p className="text-xs text-gray-600">Only you and invited members have access</p>
                </div>
              </label>
            </div>

            {/* Duration Estimation */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Task Duration Estimation</h4>
              
              <button
                type="button"
                onClick={fetchEstimatedDuration}
                disabled={!assignedTo || !complexity || !effortEstimate}
                className="w-full bg-gradient-to-r from-[#7B61FF] to-[#674AD2] hover:from-[#674AD2] hover:to-[#7B61FF] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:cursor-not-allowed"
              >
                <Clock className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Estimate Task Duration
              </button>

              {estimatedDuration && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-lg font-semibold text-green-800 flex items-center justify-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Estimated Completion Time: {estimatedDuration}
                  </div>
                </div>
              )}

              {/* Due Date - moved here */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  onChange={(e) => setDueDate(e.target.value)}
                  value={dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] hover:from-[#50E3C2] hover:to-[#4a90e2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <CheckSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;