import React, { useEffect, useState } from "react";
import { useTasksContext } from "../../hooks/useTasksContext";

const TaskModal = ({ closeModal }) => {

  const { dispatch } = useTasksContext()
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [project, setProject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [priority, setPriority] = useState('Low');

  const [projects, setProjects] = useState([]);

  // Fetch all projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (response.ok) {
        setProjects(data); // Set the projects in state
      }
    };

    fetchProjects();
  }, []);

  // Fetch members for the selected project
  useEffect(() => {
    if (!project) return; // Do nothing if no project is selected

    const fetchMembersForProject = async () => {
      try {
        console.log("Fetching members for project:", project); // Debugging
        const response = await fetch(`/api/projects/${project}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Response status:", response.status); // Debugging

        if (!response.ok) {
          throw new Error("Failed to fetch members for the project");
        }

        const data = await response.json();
        console.log("Members data:", data); // Debugging

        // Filter out null or undefined members
        const validMembers = data.filter((member) => member && member._id);
        setMembers(validMembers); // Set the fetched members to state
      } catch (error) {
        console.error("Error fetching members:", error); // Debugging
        setError("Failed to load members. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMembersForProject();
  }, [project]); // Run this effect whenever the selected project changes


  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = { taskName, taskDescription, dueDate, assignedTo, project, priority, };

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
      setError(json.errors);
    }
    if (response.ok) {
      setTaskName('');
      setTaskDescription('');
      setDueDate('');
      setAssignedTo('');
      setProject('');
      setPriority('');
      setError(null);
      console.log('New task added successfully', json);
      dispatch({ type: 'CREATE_TASKS', payload: json });

      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md"
      onClick={closeModal}
    >
      {/* Prevent closing when clicking inside the modal */}
      <div
        className="relative p-4 w-full max-w-2xl bg-[#F5A623] rounded-3xl shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4">
          <h3 className="text-4xl font-bold w-full text-white">
            Create a Task
          </h3>
          <button onClick={closeModal} className="text-white hover:text-gray-600">
            ✕
          </button>
        </div>
        <div className="p-4 bg-white rounded-xl text-black">
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div className="mb-3 font-bold">
              <label htmlFor="taskName">Task Name*</label>
              <br />
              <input
                type="text"
                id="taskName"
                name="taskName"
                onChange={(e) => setTaskName(e.target.value)}
                value={taskName}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              />
            </div>

            <div className="mb-3 font-bold">
              <label htmlFor="taskDescription">Description</label>
              <br />
              <textarea
                id="taskDescription"
                name="taskDescription"
                onChange={(e) => setTaskDescription(e.target.value)}
                value={taskDescription}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
              >
              </textarea>
            </div>

            <div className="mb-3 font-bold">
              <label>Project</label>
              <br />
              <select
                id="project"
                name="project"
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
              <label>Due Date</label>
              <br />
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                onChange={(e) => setDueDate(e.target.value)}
                value={dueDate}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal" />
            </div>

            <div className="mb-3 font-bold">
              <label>Priority</label>
              <br />
              <select
                id="priority"
                name="priority"
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
              <label>Members</label>
              <br />
              <select
                id="assignedTo"
                name="assignedTo"
                onChange={(e) => setAssignedTo(e.target.value)}
                value={assignedTo}
                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                disabled={!project} // Disable if no project is selected
              >
                <option value="">Select a member</option>
                {loading ? (
                  <option value="" disabled>
                    Loading members...
                  </option>
                ) : error ? (
                  <option value="" disabled>
                    {error}
                  </option>
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
                <input type="checkbox" value="" class="sr-only peer" />
                <div className="relative w-11 h-6 bg-[#50E3C2] rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#F5A623] dark:peer-checked:bg-[#F5A623]"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Make Private </span>
                <span className="text-xs font-light text-gray-900 italic dark:text-gray-300">(Only you and invited members have access)</span>
              </label>
            </div>

            <div className="my-5">
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
