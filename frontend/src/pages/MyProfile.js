import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import { Link, useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [predicting, setPredicting] = useState(false); // Loading for delay prediction

    const navigate = useNavigate();

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You are not logged in. Please log in to continue.');
                    setLoading(false);
                    navigate('/');
                    return;
                }

                const response = await fetch('/api/users/profile-info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to load user profile. Please try again later.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    // Handle delay prediction using Gemini API
    const fetchDelayProbability = async () => {
        if (!userData) return;

        try {
            setPredicting(true);
            const response = await fetch('/api/gemini/profile-delay-prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    level: userData.level || 0,
                    completedTasks: userData.completedTasks || 0,
                    avgEffortHours: userData.avgEffortHours || 0,
                    onTimeDeliveryRate: userData.onTimeDeliveryRate || 0,
                    currentTaskLoad: userData.currentTaskLoad || 0
                })
            });

            if (!response.ok) {
                throw new Error('Failed to predict delay');
            }

            const result = await response.json();
            setUserData(prev => ({
                ...prev,
                delayPrediction: {
                    delayProbability: result.delayProbability,
                    reason: result.reason
                }
            }));
        } catch (err) {
            console.error('Failed to predict delay probability', err);
        } finally {
            setPredicting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
            <div className='m-4'>
                {/* Header Section with Enhanced Gradient */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-r from-[#4a90e2] via-[#5b9bd5] to-[#6fa8dc] shadow-xl relative overflow-hidden'
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className='text-white text-4xl font-extrabold mb-2'>👤 My Profile</h1>
                            <p className='text-white/90 text-lg'>Manage your account and track your progress</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🚀</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
                    {/* Personal Information Section */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className='space-y-6'
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4a90e2] to-[#5b9bd5] p-4">
                                <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                                    📋 Personal Information
                                </h2>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                ) : userData ? (
                                    <div className='space-y-6'>
                                        <div className='space-y-4'>
                                            <div className="group">
                                                <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Name</label>
                                                <div className="mt-1 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                                                    <p className='text-[#4a90e2] text-xl font-bold'>{userData.name}</p>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                                                <div className="mt-1 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-400">
                                                    <p className='text-[#4a90e2] text-xl font-bold'>{userData.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button className='w-full bg-gradient-to-r from-[#50e3c2] to-[#7ce2cc] text-white hover:from-[#7ce2cc] hover:to-[#50e3c2] p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg'>
                                            ✏️ Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No user data found.</p>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Navigation Buttons */}
                        <div className="space-y-6">
                            <Link to={"/skilltree"}>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-1 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 m-5"
                                >
                                    {/* Animated Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                    </div>

                                    <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-700 rounded-xl px-6 py-5 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                                    <span className="text-2xl">🌳</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Skill Tree</h3>
                                                    <p className="text-white/80 text-sm">Track your growth</p>
                                                </div>
                                            </div>
                                            <div className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link to={"/predict-delay"}>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-1 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 m-5"
                                >
                                    {/* Animated Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                    </div>

                                    <div className="relative bg-gradient-to-r from-violet-600 to-indigo-700 rounded-xl px-6 py-5 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                                    <span className="text-2xl">📊</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Delay Prediction</h3>
                                                    <p className="text-white/80 text-sm">Analyze probabilities</p>
                                                </div>
                                            </div>
                                            <div className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* UserInfo Component */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className='space-y-6'
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-[#f5a623] to-[#fac56f] p-4">
                                <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                                    📈 User Performance
                                </h2>
                            </div>

                            <div className="p-6">
                                <UserInfo />
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default MyProfile;