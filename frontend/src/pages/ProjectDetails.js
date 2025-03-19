import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/FullCalender.css';
import { useTasksContext } from '../hooks/useTasksContext';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, dispatch } = useTasksContext();
    const [notifications, setNotifications] = useState([]);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [projectCompletion, setProjectCompletion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
        fetchUserProgress();
    }, [projectId, dispatch]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`/api/tasks/project/${projectId}`);
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_TASKS', payload: json });
                setLocalTasks(json);
                calculateProjectCompletion(json);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchUserProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/projects/${projectId}/user-progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            setCompletionPercentage(data.completionPercentage || 0);
        } catch (error) {
            console.error("Error fetching user progress:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProjectCompletion = (taskList) => {
        const totalTasks = taskList.length;
        if (totalTasks === 0) {
            setProjectCompletion(0);
            return;
        }

        const completedTasks = taskList.filter(task => task.status === 'Completed').length;
        setProjectCompletion(Math.round((completedTasks / totalTasks) * 100));
    };

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

                // ✅ Update local state immediately
                const updatedTasks = localTasks.map(task =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                );
                setLocalTasks(updatedTasks);
                calculateProjectCompletion(updatedTasks); // ✅ Update Project Completion Live

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
                setTimeout(() => setNotifications([]), 5000);

                fetchUserProgress();
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
            <div className="m-4">
                <div className="mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]">
                    <h1 className="text-white text-4xl font-extrabold italic">Project Tasks</h1>
                </div>

                {notifications.length > 0 && (
                    <div className="bg-green-500 text-white p-4 rounded-md text-center mb-4">
                        {notifications.map((note, index) => (
                            <p key={index}>{note}</p>
                        ))}
                    </div>
                )}

                {/* ✅ Live Project Progress */}
                <div className="my-4 p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-lg font-bold">📊 Total Project Completion: {projectCompletion}%</h2>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${projectCompletion}%` }}
                        ></div>
                    </div>
                </div>

                <div className="my-4 p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-lg font-bold">💪 Your Task Completion: {completionPercentage}%</h2>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div>
                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : localTasks.length > 0 ? (
                        <ul>
                            {localTasks.map((task) => (
                                <li key={task._id} className="my-4 p-4 bg-white rounded-lg shadow-md">
                                    <h2 className="text-xl font-bold">{task.taskName}</h2>
                                    <p className="text-gray-600">{task.description}</p>
                                    <p className="text-sm text-gray-500">
                                        Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Assigned To: {task.assignedTo?.name || 'Unassigned'}
                                    </p>
                                    <div className="mt-2">
                                        <label className="font-bold">Status:</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className="ml-2 p-1 border rounded"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Testing">Testing</option>
                                            <option value="Completed">Completed</option>
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
