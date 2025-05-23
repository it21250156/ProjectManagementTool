import React, { useEffect, useState } from "react";
import { useTasksContext } from "../../hooks/useTasksContext";

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

  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (response.ok) setProjects(data);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!project) return;
    const fetchMembersForProject = async () => {
      try {
        const response = await fetch(`/api/projects/${project}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data.filter((member) => member && member._id));
      } catch (err) {
        setError("Failed to load members. Please try again later.");
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

    const task = {
      taskName,
      description: taskDescription,
      dueDate,
      assignedTo,
      project,
      priority,
      complexity,
      effortEstimate
    };

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
      setError(json.errors || "Something went wrong.");
    } else {
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setAssignedTo('');
      setProject('');
      setPriority('Low');
      setComplexity('Low');
      setEffortEstimate('');
      setEstimatedDuration(json.estimatedDuration); // ⏱ Display predicted duration
      setError(null);

      dispatch({ type: 'CREATE_TASKS', payload: json.task });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md" onClick={closeModal}>
      <div className="relative p-4 w-full max-w-2xl bg-[#F5A623] rounded-3xl shadow-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4">
          <h3 className="text-4xl font-bold w-full text-white">Create a Task</h3>
          <button onClick={closeModal} className="text-white hover:text-gray-600">✕</button>
        </div>
        <div className="p-4 bg-white rounded-xl text-black">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 font-bold">
              <label htmlFor="taskName">Task Name*</label><br />
              <input
                type="text"
                id="taskName"
                onChange={(e) => setTaskName(e.target.value)}
                value={taskName}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              />
            </div>

            <div className="mb-3 font-bold">
              <label htmlFor="taskDescription">Description</label><br />
              <textarea
                id="taskDescription"
                onChange={(e) => setTaskDescription(e.target.value)}
                value={taskDescription}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              ></textarea>
            </div>

            <div className="mb-3 font-bold">
              <label>Project</label><br />
              <select
                id="project"
                onChange={(e) => setProject(e.target.value)}
                value={project}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal">
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 font-bold">
              <label>Due Date</label><br />
              <input
                type="date"
                id="dueDate"
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" />
            </div>

            <div className="mb-3 font-bold">
              <label>Priority</label><br />
              <select
                id="priority"
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-3 font-bold">
              <label>Complexity</label><br />
              <select
                id="complexity"
                onChange={(e) => setComplexity(e.target.value)}
                value={complexity}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-3 font-bold">
              <label>Effort Estimate (hours)</label><br />
              <input
                type="number"
                id="effortEstimate"
                onChange={(e) => setEffortEstimate(e.target.value)}
                value={effortEstimate}
                placeholder="e.g., 8"
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              />
            </div>

            <div className="mb-3 font-bold">
              <label>Members</label><br />
              <select
                id="assignedTo"
                onChange={(e) => setAssignedTo(e.target.value)}
                value={assignedTo}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                disabled={!project}
              >
                <option value="">Select a member</option>
                {loading ? (
                  <option value="" disabled>Loading members...</option>
                ) : error ? (
                  <option value="" disabled>{error}</option>
                ) : (
                  members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mt-10 font-bold">
              <label className="inline-flex items-center me-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-[#50E3C2] rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5A623]"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">Make Private </span>
                <span className="text-xs font-light text-gray-900 italic">(Only you and invited members have access)</span>
              </label>
            </div>


            <div className="my-5">

              <div className="mb-3 font-bold">
                <button
                  type="button"
                  onClick={fetchEstimatedDuration}
                  className="rounded-md bg-[#7B61FF] text-white px-4 py-2 font-semibold shadow hover:bg-[#674AD2]"
                >
                  Estimate Task Duration
                </button>

                {estimatedDuration && (
                  <div className="text-center mt-3 text-md font-semibold text-green-700">
                    ⏱ Estimated Completion Time: {estimatedDuration} 
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="flex w-1/3 justify-center mx-auto rounded-md bg-[#4A90E2] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-[#4A90E2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C71B1]"
              >
                Create Task
              </button>
              {error && <div className='error'> {error} </div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;