import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../assets/css/FullCalender.css';
import { useTasksContext } from '../hooks/useTasksContext';
import { 
    Calendar, 
    Clock, 
    User, 
    AlertCircle, 
    CheckCircle, 
    PlayCircle, 
    TestTube, 
    Hourglass,
    TrendingUp,
    Bot,
    X,
    Info
} from 'lucide-react';

// Import GIFs
import AnimationWow from '../assets/Animation_wow.gif';
import AnimationConcerned from '../assets/Animation_concerned.gif';
import AnimationHappy from '../assets/Animation_happy.gif';
import AnimationAngry from '../assets/Animation_angry.gif';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { tasks, dispatch } = useTasksContext();
    const [notifications, setNotifications] = useState([]);
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [projectCompletion, setProjectCompletion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [aiResponse, setAiResponse] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [taskGifs, setTaskGifs] = useState({});

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
                calculateProjectCompletion(json);
                updateTaskGifs(json);
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

    const getDeadlineGif = (dueDate, status) => {
        if (status === 'Completed') {
            return AnimationWow;
        }

        const currentDate = new Date();
        const due = new Date(dueDate);
        const timeDiff = due - currentDate;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        if (daysDiff < 0) {
            return AnimationAngry;
        } else if (daysDiff <= 1) {
            return AnimationConcerned;
        } else {
            return AnimationHappy;
        }
    };

    const updateTaskGifs = (taskList) => {
        const newTaskGifs = {};
        taskList.forEach(task => {
            newTaskGifs[task._id] = getDeadlineGif(task.dueDate, task.status);
        });
        setTaskGifs(newTaskGifs);
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

                const updatedTasks = tasks.map(task =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                );
                calculateProjectCompletion(updatedTasks);

                setTaskGifs(prev => ({
                    ...prev,
                    [taskId]: getDeadlineGif(updatedTask.dueDate, newStatus)
                }));

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

    useEffect(() => {
        console.log("Tasks updated:", tasks);
        updateTaskGifs(tasks);
    }, [tasks]);

    const handleAIHelp = async (task) => {
        setAiLoading(true);
        setSelectedTaskId(task._id);
        setAiResponse(null);
        setAiError(null);

        try {
            const response = await fetch("/api/gemini/estimate-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskName: task.taskName,
                    taskDescription: task.taskDescription || "",
                    complexity: task.priority || "Medium",
                    experienceLevel: "Junior"
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to get AI response");

            setAiResponse(data);
        } catch (error) {
            setAiError(error.message);
        } finally {
            setAiLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="h-4 w-4" />;
            case 'In Progress': return <PlayCircle className="h-4 w-4" />;
            case 'Testing': return <TestTube className="h-4 w-4" />;
            default: return <Hourglass className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-orange-500';
            case 'Low': return 'bg-lime-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-white text-3xl lg:text-4xl font-bold">
                                        Project Tasks
                                    </h1>
                                    <p className="text-white/80 text-lg mt-1">
                                        Track and manage project progress
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {notifications.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg">
                            {notifications.map((note, index) => (
                                <p key={index} className="mb-1 last:mb-0">{note}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Tasks Section */}
                    <div className="xl:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
                                <h2 className="text-2xl font-bold text-[#4a90e2]">Tasks Overview</h2>
                                <p className="text-gray-600 mt-1">{tasks.length} total tasks</p>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="p-12 flex justify-center">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-[#4a90e2] animate-bounce"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-3 h-3 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                ) : tasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {tasks.map((task, index) => (
                                            <div key={task._id} className="bg-gradient-to-r from-white to-gray-50/50 rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                                    {/* Task Info */}
                                                    <div className="lg:col-span-6">
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <img
                                                                src={taskGifs[task._id]}
                                                                alt="Task Status Animation"
                                                                className="w-12 h-12 rounded-lg flex-shrink-0"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                                        {task.taskName}
                                                                    </h3>
                                                                    <span className={`${getPriorityColor(task.priority)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                                                                        {task.priority}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                                    <User className="h-4 w-4 mr-1" />
                                                                    {task.assignedTo?.name || 'Unassigned'}
                                                                </div>

                                                                {task.estimatedDuration && (() => {
                                                                    const hours = Math.floor(task.estimatedDuration);
                                                                    const minutes = Math.round((task.estimatedDuration - hours) * 60);
                                                                    return (
                                                                        <div className="text-sm text-[#4a90e2] flex items-center gap-1 group relative">
                                                                            <Clock className="h-4 w-4" />
                                                                            <span className="font-medium">
                                                                                {hours}h{minutes > 0 ? ` ${minutes}m` : ''}
                                                                            </span>
                                                                            <Info className="h-3 w-3 text-gray-400 cursor-help" />
                                                                            <div className="absolute top-6 left-0 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 z-10">
                                                                                Estimated using COCOMO-inspired formula considering complexity and experience.
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Due Date */}
                                                    <div className="lg:col-span-3">
                                                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl text-center">
                                                            <div className="flex items-center justify-center mb-1">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                <span className="text-xs font-medium">Due Date</span>
                                                            </div>
                                                            <p className="font-bold">
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Status & Actions */}
                                                    <div className="lg:col-span-3">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                                <div className="relative">
                                                                    <select
                                                                        value={task.status}
                                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                                        className="w-full bg-[#50E3C2] text-white font-medium px-3 py-2 rounded-lg border-none appearance-none cursor-pointer pr-8"
                                                                    >
                                                                        <option value="Pending">Pending</option>
                                                                        <option value="In Progress">In Progress</option>
                                                                        <option value="Testing">Testing</option>
                                                                        <option value="Completed">Completed</option>
                                                                    </select>
                                                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
                                                                        {getStatusIcon(task.status)}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {task.status !== "Completed" && (
                                                                <button
                                                                    onClick={() => handleAIHelp(task)}
                                                                    className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white text-sm font-medium py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                                                >
                                                                    <Bot className="h-4 w-4 mr-2" />
                                                                    AI Assistant
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Response */}
                                                {selectedTaskId === task._id && (aiResponse || aiLoading || aiError) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        {aiLoading && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex items-center">
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                                    <span className="text-blue-700 font-medium">AI is analyzing...</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {aiResponse && (
                                                            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-semibold text-[#4a90e2] flex items-center">
                                                                        <Bot className="h-4 w-4 mr-2" />
                                                                        AI Analysis
                                                                    </h4>
                                                                    <button
                                                                        onClick={() => setSelectedTaskId(null)}
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2 text-sm">
                                                                    <p><strong>⏱ Estimated Time:</strong> {aiResponse.estimatedDuration} hours</p>
                                                                    <p><strong>⚠️ Risk Level:</strong> {aiResponse.risk}</p>
                                                                    <p className="text-gray-600 italic">💡 {aiResponse.reason}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {aiError && (
                                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                                <div className="flex items-center">
                                                                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                                                                    <span className="text-red-700 font-medium">Error: {aiError}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="bg-gray-50 rounded-xl p-8">
                                            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
                                            <p className="text-gray-500">Tasks will appear here when they are created for this project.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Project Progress */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-2 rounded-lg mr-3">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#4a90e2]">Project Progress</h3>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                                    <span className="text-2xl font-bold text-[#4a90e2]">{projectCompletion}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${projectCompletion}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* User Progress */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-[#50E3C2] to-[#f5a623] p-2 rounded-lg mr-3">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#4a90e2]">Your Progress</h3>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Task Completion</span>
                                    <span className="text-2xl font-bold text-[#50E3C2]">{completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-[#50E3C2] to-[#f5a623] h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gradient-to-br from-[#4a90e2]/10 to-[#4a90e2]/20 p-4 rounded-xl border border-[#4a90e2]/20">
                                <h4 className="font-bold text-[#4a90e2] mb-1">Total Tasks</h4>
                                <p className="text-2xl font-bold text-[#4a90e2]">{tasks.length}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-[#50E3C2]/10 to-[#50E3C2]/20 p-4 rounded-xl border border-[#50E3C2]/20">
                                <h4 className="font-bold text-[#4a90e2] mb-1">Completed</h4>
                                <p className="text-2xl font-bold text-[#4a90e2]">
                                    {tasks.filter(task => task.status === 'Completed').length}
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-[#f5a623]/10 to-[#f5a623]/20 p-4 rounded-xl border border-[#f5a623]/20">
                                <h4 className="font-bold text-[#4a90e2] mb-1">In Progress</h4>
                                <p className="text-2xl font-bold text-[#4a90e2]">
                                    {tasks.filter(task => task.status === 'In Progress').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;