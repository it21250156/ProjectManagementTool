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
            {/* <Header /> */}
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
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
                                    <div className='grid grid-cols-3'>
                                        <div>
                                            <h2 className='text-lg font-semibold'>{task.taskName}
                                                <span
                                                    className={`text-white mx-2 text-xs font-bold inline-block px-2 py-1 rounded-full ${task.priority === 'High'
                                                        ? 'bg-red-500'
                                                        : task.priority === 'Medium'
                                                            ? 'bg-orange-500'
                                                            : 'bg-lime-500'
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </h2>

                                            <p className='text-sm text-gray-500 my-3'>Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>

                                        </div>
                                        <div >
                                            <p className="text-md text-center">Due Date</p>
                                            <div className='flex justify-center items-center'>
                                                <p className="text-lg bg-red-700 text-white text-center py-2 px-5 my-2 mx-10 rounded-xl font-semibold">
                                                    {new Date(task.dueDate).toLocaleDateString()}

                                                </p>
                                            </div>


                                        </div>
                                        <div className="mb-3 font-bold">
                                            <label className='font-bold mr-5'>Status</label>
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                className="border-none bg-[#50E3C2] rounded-lg font-normal"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Testing">Testing</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
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
