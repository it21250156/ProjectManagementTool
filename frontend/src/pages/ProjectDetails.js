import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/FullCalender.css';
import { useTasksContext } from '../hooks/useTasksContext';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, dispatch } = useTasksContext();

    // Fetch tasks for the project
    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch(`/api/tasks/project/${projectId}`);
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_TASKS', payload: json });
            }
        };
        fetchTasks();
    }, [projectId, dispatch]);

    // Handle status change
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                console.log('Updated Task:', updatedTask);
                // Update global state
                dispatch({
                    type: 'UPDATE_TASK',
                    payload: updatedTask,
                });
            } else {
                console.error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>Project Tasks</h1>
                </div>

                <div>
                    {tasks && tasks.length > 0 ? (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task._id} className='my-4 p-4 bg-white rounded-lg shadow-md'>
                                    <h2 className='text-xl font-bold'>{task.taskName}</h2>
                                    <p className='text-gray-600'>{task.description}</p>
                                    <p className='text-sm text-gray-500'>
                                        Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                    <p className='text-sm text-gray-500'>Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>
                                    <div className='mt-2'>
                                        <label className='font-bold'>Status:</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className='ml-2 p-1 border rounded'
                                        >
                                            <option value='Pending'>Pending</option>
                                            <option value='In Progress'>In Progress</option>
                                            <option value='Testing'>Testing</option>
                                            <option value='Completed'>Completed</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks found for this project.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;