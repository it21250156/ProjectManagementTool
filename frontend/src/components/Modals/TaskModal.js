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
  const [complexity, setComplexity] = useState('Low'); // ✅ NEW
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
        setMembers(data.filter((m) => m && m._id));
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembersForProject();
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { taskName, taskDescription, dueDate, assignedTo, project, priority, complexity }; // ✅ Include complexity

    const response = await fetch('/api/tasks/add', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const json = await response.json();
    if (!response.ok) setError(json.errors);
    if (response.ok) {
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setAssignedTo('');
      setProject('');
      setPriority('Low');
      setComplexity('Low'); // ✅ Reset complexity
      setError(null);
      dispatch({ type: 'CREATE_TASKS', payload: json });
      closeModal();
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
              <input type="text" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" />
            </div>

            <div className="mb-3 font-bold">
              <label htmlFor="taskDescription">Description</label><br />
              <textarea id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" />
            </div>

            <div className="mb-3 font-bold">
              <label>Project</label><br />
              <select value={project} onChange={(e) => setProject(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal">
                <option value="">Select a project</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.projectName}</option>)}
              </select>
            </div>

            <div className="mb-3 font-bold">
              <label>Due Date</label><br />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" />
            </div>

            <div className="mb-3 font-bold">
              <label>Priority</label><br />
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* ✅ NEW: Complexity field */}
            <div className="mb-3 font-bold">
              <label>Complexity</label><br />
              <select value={complexity} onChange={(e) => setComplexity(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-3 font-bold">
              <label>Members</label><br />
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" disabled={!project}>
                <option value="">Select a member</option>
                {loading ? <option value="" disabled>Loading members...</option> :
                  error ? <option value="" disabled>{error}</option> :
                    members.map((m) => (
                      <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                    ))}
              </select>
            </div>

            <div className="my-5">
              <button type="submit" className="flex w-1/3 justify-center mx-auto rounded-md bg-[#4A90E2] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-[#4A90E2]">
                Create Task
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
