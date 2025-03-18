import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/FullCalender.css';
import { useTasksContext } from '../hooks/useTasksContext';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, dispatch } = useTasksContext();
    const [notifications, setNotifications] = useState([]); // ✅ Store multiple notifications

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

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
    
            if (response.ok) {
                const updatedTask = await response.json();
                dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    
                // ✅ Show notifications
                let newNotifications = [
                    `✅ Task completed! Earned ${updatedTask.totalXP} XP (Base: ${updatedTask.baseXP}, Bonus: ${updatedTask.bonusXP})`
                ];
    
                if (updatedTask.activatedSkills.length > 0) {
                    newNotifications.push(`🔥 Activated Skills: ${updatedTask.activatedSkills.join(", ")}`);
                }
    
                if (updatedTask.levelUp) {
                    newNotifications.push(`🎉 You leveled up to Level ${updatedTask.level}!`);
                }
    
                if (updatedTask.newBadges.length > 0) {
                    updatedTask.newBadges.forEach(badge => {
                        newNotifications.push(`🏅 New Badge Earned: ${badge}`);
                    });
                }
    
                setNotifications(newNotifications);
    
                // Auto-hide notifications after 5 seconds
                setTimeout(() => {
                    setNotifications([]);
                }, 5000);
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

                {/* ✅ Show Notifications */}
                {notifications.length > 0 && (
                    <div className="bg-green-500 text-white p-4 rounded-md text-center mb-4">
                        {notifications.map((note, index) => (
                            <p key={index}>{note}</p>
                        ))}
                    </div>
                )}

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
