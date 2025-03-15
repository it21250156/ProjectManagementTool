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
            };
        }
        fetchTasks();
    }, [projectId, dispatch,]);

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
                                    <p className='text-sm text-gray-500'>Assigned To: {task.assignedTo}</p>
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