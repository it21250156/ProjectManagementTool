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
                avgEffortHours: 4, // Replace with actual average if available
                onTimeDeliveryRate: 0.8, // Replace with actual rate if available
                currentTaskLoad: 3 // Replace with actual task load if available
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

    // Helper to convert probability to label
    const getDelayLabel = (prob) => {
        if (prob < 0.33) return "Low";
        if (prob < 0.66) return "Medium";
        return "High";
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {loading ? (
                <div className="flex justify-center my-8">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {message && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {message}
                        </div>
                    )}

                    {/* Evolution Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
                        <div className='flex justify-evenly'>
                            <div>
                                <h2 className="text-2xl font-bold">🎯 Level {level}</h2>
                                <p className="text-gray-600">XP: {earnedXP} / {nextLevelXP}</p>
                            </div>
                            <div className="w-44">
                                <img
                                    src={`/level-images/${level}.webp`}
                                    alt={`Level ${level} Wolf Evolution`}
                                    className="w-full max-w-md rounded-full transition-transform duration-500 ease-in-out hover:scale-105"
                                />
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                                style={{ width: `${xpProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Completed Tasks & Badges Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <h3 className="text-xl font-bold">📌 Completed Tasks</h3>
                            <p className="text-2xl font-bold text-purple-600">{completedTasks}</p>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                            <h3 className="text-xl font-bold">🎖️ Badges Earned</h3>
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                {badges.length > 0 ? (
                                    badges.map((badge, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm"
                                        >
                                            {badge}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No badges earned yet.</p>
                                )}
                            </div>
                        </div>
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
                                <span className="font-bold text-[#183153]">{localStorage.getItem('name') || "—"}</span>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <span className="font-semibold text-gray-800">Experience</span>
                                <span className="font-bold text-[#183153]">
                                    {level === 1 ? "Beginner" : level < 5 ? "Intermediate" : "Advanced"}
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