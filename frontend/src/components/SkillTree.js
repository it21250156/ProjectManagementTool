import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SkillTree = () => {
    const [skills, setSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]); // ✅ Track only skill IDs
    const [availablePoints, setAvailablePoints] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
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

                console.log("User Profile Data:", response.data); // ✅ Debugging

                // ✅ Store only skill IDs
                const unlockedSkillIds = response.data.unlockedSkills.map(skill => skill._id);
                console.log("Unlocked Skill IDs:", unlockedSkillIds); // ✅ Debugging

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
    }, [navigate]); // ✅ Fetch fresh data on page load

    const handleUnlockSkill = async (skillId, pointsRequired) => {
        if (availablePoints < pointsRequired) {
            setMessage('Not enough points to unlock this skill.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/skills/unlock',
                { skillId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            
            // ✅ Fetch updated user data immediately after unlocking a skill
            const updatedUserResponse = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updatedSkillIds = updatedUserResponse.data.unlockedSkills.map(skill => skill._id);
            setUserSkills(updatedSkillIds);
            setAvailablePoints(updatedUserResponse.data.points || 0);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error unlocking skill');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="container max-w-4xl mx-auto p-4">
                <h1 className="text-4xl font-bold text-blue-600 mb-6">🌳 Skill Tree</h1>

                {loading ? (
                    <div className="flex justify-center my-8">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {message && (
                            <div className="bg-yellow-200 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                                {message}
                            </div>
                        )}

                        {/* Available Points Section */}
                        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
                            <h2 className="text-2xl font-bold">⭐ Available Points: {availablePoints}</h2>
                        </div>

                        {/* Skill Tree Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skills.map((skill) => {
                                const isUnlocked = userSkills.includes(skill._id); // ✅ Fix comparison

                                return (
                                    <div
                                        key={skill._id}
                                        className={`p-4 rounded-lg shadow-md transition-all ${
                                            isUnlocked ? 'bg-green-300' : 'bg-white'
                                        }`}
                                    >
                                        <h3 className="text-xl font-semibold">{skill.name}</h3>
                                        <p className="text-gray-700">{skill.description}</p>
                                        <p className="font-bold">Points Required: {skill.pointsRequired}</p>

                                        {isUnlocked ? (
                                            <button className="w-full mt-2 p-2 bg-green-500 text-white rounded" disabled>
                                                Unlocked
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                                onClick={() => handleUnlockSkill(skill._id, skill.pointsRequired)}
                                            >
                                                Unlock
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default SkillTree;
