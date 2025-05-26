import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SkillTree = () => {
    const [skills, setSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [availablePoints, setAvailablePoints] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [unlockedMessage, setUnlockedMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get('/api/skills');
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setMessage('Failed to load skills.');
            }
        };

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('You are not logged in. Please log in to continue.');
                    setLoading(false);
                    navigate('/');
                    return;
                }

                const response = await axios.get('/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("User Profile Data:", response.data);

                const unlockedSkillIds = response.data.unlockedSkills.map(skill => skill._id);
                console.log("Unlocked Skill IDs:", unlockedSkillIds);

                setUserSkills(unlockedSkillIds);
                setAvailablePoints(response.data.points || 0);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setMessage('Failed to load your skills. Please try again later.');
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchSkills();
        fetchUserData();
    }, [navigate]);

    const handleUnlockSkill = async (skillId, pointsRequired, skillName) => {
        if (availablePoints < pointsRequired) {
            setMessage('Not enough points to unlock this skill.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/skills/unlock',
                { skillId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('');
            setUnlockedMessage(`🎉 ${skillName} unlocked successfully!`);
            setTimeout(() => setUnlockedMessage(''), 4000);
            
            const updatedUserResponse = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedSkillIds = updatedUserResponse.data.unlockedSkills.map(skill => skill._id);
            setUserSkills(updatedSkillIds);
            setAvailablePoints(updatedUserResponse.data.points || 0);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error unlocking skill');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getSkillIcon = (skillName) => {
        const name = skillName.toLowerCase();
        if (name.includes('javascript') || name.includes('js')) return '⚡';
        if (name.includes('react')) return '⚛️';
        if (name.includes('python')) return '🐍';
        if (name.includes('node')) return '🟢';
        if (name.includes('database') || name.includes('sql')) return '🗄️';
        if (name.includes('api')) return '🔗';
        if (name.includes('design') || name.includes('ui')) return '🎨';
        if (name.includes('security')) return '🔐';
        if (name.includes('cloud')) return '☁️';
        if (name.includes('mobile')) return '📱';
        return '🚀';
    };

    const canUnlockSkill = (pointsRequired) => availablePoints >= pointsRequired;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
            <div className="max-w-none mx-auto p-6">
                {/* Enhanced Header */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 shadow-2xl relative overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full"></div>
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/20 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-extrabold text-white mb-2">🌳 Skill Tree</h1>
                            <p className="text-white/90 text-xl">Unlock your potential and grow your abilities</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="text-center bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-2">Available Points</h2>
                                <div className="text-4xl font-extrabold text-yellow-300">⭐ {availablePoints}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Success Message */}
                        {unlockedMessage && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-400"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-lg">🎉</span>
                                    </div>
                                    <span className="font-bold text-lg">{unlockedMessage}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">⚠️</span>
                                    <span className="font-semibold">{message}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {skills.map((skill, index) => {
                                const isUnlocked = userSkills.includes(skill._id);
                                const canUnlock = canUnlockSkill(skill.pointsRequired);
                                const skillIcon = getSkillIcon(skill.name);

                                return (
                                    <motion.div
                                        key={skill._id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl ${
                                            isUnlocked 
                                                ? 'bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700' 
                                                : canUnlock
                                                    ? 'bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-purple-50 border border-blue-200'
                                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300'
                                        }`}
                                    >
                                        {/* Shimmer Effect for Unlocked Skills */}
                                        {isUnlocked && (
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                            </div>
                                        )}
                                        
                                        {/* Card Content */}
                                        <div className="relative p-6">
                                            {/* Skill Icon */}
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                                                isUnlocked 
                                                    ? 'bg-white/20' 
                                                    : canUnlock 
                                                        ? 'bg-blue-500' 
                                                        : 'bg-gray-400'
                                            }`}>
                                                <span className={`text-2xl ${isUnlocked ? 'text-white' : canUnlock ? 'text-white' : 'text-gray-600'}`}>
                                                    {skillIcon}
                                                </span>
                                            </div>

                                            {/* Skill Info */}
                                            <h3 className={`text-xl font-bold mb-2 ${
                                                isUnlocked ? 'text-white' : 'text-gray-800'
                                            }`}>
                                                {skill.name}
                                            </h3>
                                            
                                            <p className={`text-sm mb-4 leading-relaxed ${
                                                isUnlocked ? 'text-white/90' : 'text-gray-600'
                                            }`}>
                                                {skill.description}
                                            </p>

                                            {/* Points Required */}
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                                                isUnlocked 
                                                    ? 'bg-white/20 text-white' 
                                                    : canUnlock 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                <span>⭐</span>
                                                {skill.pointsRequired} Points
                                            </div>

                                            {/* Action Button */}
                                            {isUnlocked ? (
                                                <motion.div 
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-full bg-white/20 text-white font-bold py-3 rounded-xl text-center border-2 border-white/30"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>✅</span>
                                                        <span>Unlocked</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: canUnlock ? 1.02 : 1 }}
                                                    whileTap={{ scale: canUnlock ? 0.98 : 1 }}
                                                    className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                                                        canUnlock
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                    onClick={() => canUnlock && handleUnlockSkill(skill._id, skill.pointsRequired, skill.name)}
                                                    disabled={!canUnlock}
                                                >
                                                    {canUnlock ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>🔓</span>
                                                            <span>Unlock Skill</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>🔒</span>
                                                            <span>Insufficient Points</span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>

                                        {/* Unlock Status Indicator */}
                                        {isUnlocked && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-lg">👑</span>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Empty State */}
                        {skills.length === 0 && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <div className="text-6xl mb-4">🌱</div>
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">No Skills Available</h3>
                                <p className="text-gray-500">Skills will appear here when they become available.</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default SkillTree;