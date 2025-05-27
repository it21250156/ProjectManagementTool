import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [delayPrediction, setDelayPrediction] = useState(null);
    const [predicting, setPredicting] = useState(false);
    
    // Performance data
    const [earnedXP, setEarnedXP] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [badges, setBadges] = useState([]);
    const [level, setLevel] = useState(1);

    const navigate = useNavigate();

    const getNextLevelXP = (lvl) => Math.pow(2, lvl) * 50;

    // Fetch user profile data and performance data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You are not logged in. Please log in to continue.');
                    setLoading(false);
                    navigate('/');
                    return;
                }

                // Fetch user profile info
                const profileResponse = await axios.get('/api/users/profile-info', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(profileResponse.data);

                // Fetch performance data (XP, tasks, badges, level)
                const xpResponse = await axios.get('/api/projects/user-total-xp', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEarnedXP(xpResponse.data.earnedXP);
                setCompletedTasks(xpResponse.data.completedTasks);
                setBadges(xpResponse.data.badges);
                setLevel(xpResponse.data.level);

            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response?.status === 401) {
                    navigate('/');
                } else {
                    setError('Failed to load user data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Handle delay prediction using Gemini API
    const fetchDelayProbability = async () => {
        if (!userData) return;

        try {
            setPredicting(true);
            const response = await axios.post('/api/gemini/profile-delay-prediction', {
                level,
                completedTasks,
                avgEffortHours: userData.avgEffortHours || 4,
                onTimeDeliveryRate: userData.onTimeDeliveryRate || 0.8,
                currentTaskLoad: userData.currentTaskLoad || 3
            });

            setDelayPrediction({
                delayProbability: response.data.delayProbability,
                reason: response.data.reason
            });
        } catch (err) {
            console.error('Failed to predict delay probability', err);
        } finally {
            setPredicting(false);
        }
    };

    const getDelayLabel = (prob) => {
        if (prob < 0.33) return "Low";
        if (prob < 0.66) return "Medium";
        return "High";
    };

    const nextLevelXP = getNextLevelXP(level);
    const xpProgress = Math.min((earnedXP / nextLevelXP) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
            <div className='m-4'>
                {/* Header Section */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='mx-0 my-2 p-6 rounded-2xl bg-gradient-to-r from-[#4a90e2] via-[#5b9bd5] to-[#6fa8dc] shadow-xl relative overflow-hidden'
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className='text-white text-3xl font-extrabold mb-1'>👤 My Profile</h1>
                            <p className='text-white/90 text-base'>Manage your account and track your progress</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-3xl">🚀</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
                    {/* Personal Information Section */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className='xl:col-span-1 space-y-4'
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4a90e2] to-[#5b9bd5] p-3">
                                <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                                    📋 Personal Information
                                </h2>
                            </div>

                            <div className="p-4">
                                {loading ? (
                                    <div className="flex justify-center py-6">
                                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                        {error}
                                    </div>
                                ) : userData ? (
                                    <div className='space-y-4'>
                                        <div className='space-y-3'>
                                            <div>
                                                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Name</label>
                                                <div className="mt-1 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                                                    <p className='text-[#4a90e2] text-lg font-bold'>{userData.name}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                                                <div className="mt-1 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-400">
                                                    <p className='text-[#4a90e2] text-lg font-bold'>{userData.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button className='w-full bg-gradient-to-r from-[#50e3c2] to-[#7ce2cc] text-white hover:from-[#7ce2cc] hover:to-[#50e3c2] p-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm'>
                                            ✏️ Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4 text-sm">No user data found.</p>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="space-y-3">
                            <Link to={"/skilltree"}>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 p-1 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                                >
                                    <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-700 rounded-lg px-4 py-3 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">🌳</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm">Skill Tree</h3>
                                                    <p className="text-white/80 text-xs">Track growth</p>
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link to={"/predict-delay"}>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 p-1 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                                >
                                    <div className="relative bg-gradient-to-r from-violet-600 to-indigo-700 rounded-lg px-4 py-3 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">📊</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm">Delay Prediction</h3>
                                                    <p className="text-white/80 text-xs">Analyze probabilities</p>
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Performance Section */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className='xl:col-span-2 space-y-4'
                    >
                        {/* Level Evolution Card */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-[#f5a623] to-[#fac56f] p-3">
                                <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                                    🎯 Level Progress
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className='flex flex-col md:flex-row items-center gap-4'>
                                    <div className='text-center md:text-left flex-1'>
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                            Level {level}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            XP: <span className="text-blue-600 font-bold">{earnedXP}</span> / <span className="text-purple-600 font-bold">{nextLevelXP}</span>
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${xpProgress}%` }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                                            ></motion.div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{xpProgress.toFixed(1)}% to next level</p>
                                    </div>
                                    <div className="w-24 h-24 md:w-32 md:h-32">
                                        <img
                                            src={`/level-images/${level}.webp`}
                                            alt={`Level ${level}`}
                                            className="w-full h-full object-cover rounded-full shadow-lg border-4 border-gradient-to-r from-blue-400 to-purple-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Completed Tasks */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">📌</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Tasks</h3>
                                        <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-4 border border-purple-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🎖️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Badges</h3>
                                        <p className="text-2xl font-bold text-purple-600">{badges.length}</p>
                                    </div>
                                </div>
                                {badges.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {badges.slice(0, 3).map((badge, index) => (
                                            <span
                                                key={index}
                                                className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                        {badges.length > 3 && (
                                            <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                +{badges.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3">
                                <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                                    📊 Performance Summary
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Experience</p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {level === 1 ? "Beginner" : level < 8 ? "Intermediate" : "Advanced"}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Level</p>
                                        <p className="text-sm font-bold text-gray-800">{level}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Total XP</p>
                                        <p className="text-sm font-bold text-gray-800">{earnedXP}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Tasks</p>
                                        <p className="text-sm font-bold text-gray-800">{completedTasks}</p>
                                    </div>
                                </div>

                                {/* Delay Prediction */}
                                <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-600 text-lg">⚠️</span>
                                            <span className="font-bold text-yellow-700 text-sm">Delay Probability</span>
                                        </div>
                                    </div>
                                    {delayPrediction ? (
                                        <div>
                                            <div className="font-bold text-yellow-800 text-sm mb-1">
                                                Risk Level: <span className="text-base">{getDelayLabel(delayPrediction.delayProbability)}</span>
                                            </div>
                                            <div className="text-gray-700 text-xs">
                                                {delayPrediction.reason}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={fetchDelayProbability}
                                            disabled={predicting}
                                            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-white font-semibold py-2 px-3 rounded text-xs transition-colors duration-200"
                                        >
                                            {predicting ? 'Analyzing...' : 'Analyze Delay Risk'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default MyProfile;