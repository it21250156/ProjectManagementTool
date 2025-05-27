import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GlobalLeaderboard from '../components/GlobalLeaderboard';

const UserInfo = () => {
    const [earnedXP, setEarnedXP] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [badges, setBadges] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState(1);
    const [delayPrediction, setDelayPrediction] = useState(null);
    const [profileName, setProfileName] = useState(''); 

    const navigate = useNavigate();
    const getNextLevelXP = (lvl) => Math.pow(2, lvl) * 50;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('You are not logged in. Please log in to continue.');
                    setLoading(false);
                    navigate('/');
                    return;
                }

                // Fetch XP, tasks, badges, level
                const xpResponse = await axios.get('/api/projects/user-total-xp', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEarnedXP(xpResponse.data.earnedXP);
                setCompletedTasks(xpResponse.data.completedTasks);
                setBadges(xpResponse.data.badges);
                setLevel(xpResponse.data.level);

                // Fetch user profile info (including name)
                const profileResponse = await axios.get('/api/users/profile-info', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfileName(profileResponse.data.name);

            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response?.status === 401) {
                    navigate('/');
                } else {
                    setMessage('Failed to load data. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchUserData();
    }, [navigate]);

    const nextLevelXP = getNextLevelXP(level);
    const xpProgress = Math.min((earnedXP / nextLevelXP) * 100, 100);

    const handleViewDelayProbability = async () => {
        try {
            const response = await axios.post('/api/gemini/profile-delay-prediction', {
                level,
                completedTasks,
                avgEffortHours: 4, 
                onTimeDeliveryRate: 0.8, 
                currentTaskLoad: 3 
            });

            setDelayPrediction({
                delayProbability: response.data.delayProbability,
                reason: response.data.reason
            });
        } catch (error) {
            console.error("Error getting delay probability:", error);
            setMessage("Failed to fetch delay probability.");
        }
    };

    const getDelayLabel = (prob) => {
        if (prob < 0.33) return "Low";
        if (prob < 0.66) return "Medium";
        return "High";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                    </div>
                </div>
            ) : (
                <>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl">⚠️</span>
                                {message}
                            </div>
                        </motion.div>
                    )}

                    {/* Level Evolution Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-8 mb-8 border border-blue-100"
                    >
                        <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
                            <div className='text-center lg:text-left'>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        🎯 Level {level}
                                    </h2>
                                    <p className="text-gray-600 text-lg font-medium">
                                        XP: <span className="text-blue-600 font-bold">{earnedXP}</span> / <span className="text-purple-600 font-bold">{nextLevelXP}</span>
                                    </p>
                                </motion.div>
                            </div>

                            {/* Evolution Image */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="w-48 h-48"
                            >
                                <img
                                    src={`/level-images/${level}.webp`}
                                    alt={`Level ${level} Wolf Evolution`}
                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-3xl"
                                />
                            </motion.div>
                        </div>

                        {/* Enhanced XP Progress Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="mt-8"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">Progress to Next Level</span>
                                <span className="text-sm font-bold text-blue-600">{xpProgress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpProgress}%` }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 my-8"
                    ></motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Completed Tasks Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl">📌</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Completed Tasks</h3>
                                <motion.p
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                                >
                                    {completedTasks}
                                </motion.p>
                            </div>
                        </motion.div>



                        {/* Badges Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg rounded-2xl p-6 border border-purple-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl">🎖️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Badges Earned</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {badges.length > 0 ? (
                                        badges.map((badge, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                                                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-transform duration-200"
                                            >
                                                {badge}
                                            </motion.span>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            className="text-center py-4"
                                        >
                                            <div className="text-4xl mb-2">🏆</div>
                                            <p className="text-gray-500 font-medium">No badges earned yet</p>
                                            <p className="text-sm text-gray-400 mt-1">Complete tasks to earn your first badge!</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Profile Card */}
                    <div className="rounded-t-2xl rounded-b-lg overflow-hidden shadow-lg border border-gray-200">
                        {/* Header */}
                        <div className="bg-yellow-300 px-6 py-6 rounded-t-2xl">
                            <h1 className="text-4xl font-extrabold italic text-white text-center">My Performance</h1>
                        </div>
                        {/* Personal Info */}
                        <div className="bg-white px-8 py-6">
                            <h2 className="text-lg font-bold text-[#183153] mb-4">Personal Information</h2>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Name</span>
                                <span className="font-bold text-[#183153]">{profileName || "—"}</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Experience</span>
                                <span className="font-bold text-[#183153]">
                                    {level === 1 ? "Beginner" : level < 8 ? "Intermediate" : "Advanced"}
                                </span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Completed Tasks</span>
                                <span className="font-bold">{completedTasks}</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Earned XP</span>
                                <span className="font-bold">{earnedXP}</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Level</span>
                                <span className="font-bold">{level}</span>
                            </div>
                        </div>
                        {/* Delay Probability */}
                        <div className="bg-yellow-100 px-8 py-6 border-t border-yellow-200">
                            <div className="flex items-center mb-2">
                                <span className="text-yellow-700 text-2xl mr-2">⚠️</span>
                                <span className="font-bold text-yellow-700 text-lg">Delay Probability</span>
                            </div>
                            {delayPrediction ? (
                                <>
                                    <div className="font-bold text-yellow-800 text-xl mb-1">
                                        Delay Probability: <span>{getDelayLabel(delayPrediction.delayProbability)}</span>
                                    </div>
                                    <div className="text-gray-800 text-base">
                                        {delayPrediction.reason}
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={handleViewDelayProbability}
                                    className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
                                >
                                    View Delay Probability
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default UserInfo;