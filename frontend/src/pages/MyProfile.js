import React, { useState, useEffect } from 'react';
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
        <div>
            {/* <Header /> Uncomment if needed */}
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>My Profile</h1>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Personal Information Section */}
                    <div className='p-4'>
                        <h2 className='text-xl font-semibold text-[#4a90e2] mb-2'>Personal Information</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className='text-red-500'>{error}</p>
                        ) : userData ? (
                            <div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
                                <div className='my-3'>
                                    <h3 className='font-semibold'>Name</h3>
                                    <p className='text-[#4a90e2] text-xl italic mx-5 font-semibold'>{userData.name}</p>

                                    <h3 className='font-semibold'>Email</h3>
                                    <p className='text-[#4a90e2] text-xl italic mx-5 font-semibold'>{userData.email}</p>

                                    {/* Delay Prediction */}
                                    {userData.delayPrediction ? (
                                        <div className="mt-4">
                                            <h3 className='font-semibold'>Delay Probability</h3>
                                            <p className='text-red-500 font-bold text-lg mx-5'>
                                                {userData.delayPrediction.delayProbability}
                                            </p>
                                            <h3 className='font-semibold'>Reason</h3>
                                            <p className='text-gray-700 mx-5'>
                                                {userData.delayPrediction.reason}
                                            </p>
                                        </div>
                                    ) : (
                                        <button
                                            className='w-1/2 mt-4 bg-[#ff6b6b] text-white hover:bg-[#ff8787] p-3 rounded-lg font-bold'
                                            onClick={fetchDelayProbability}
                                            disabled={predicting}
                                        >
                                            {predicting ? 'Predicting...' : '🔍 Delay Probability'}
                                        </button>
                                    )}
                                </div>

                                <button className='w-1/4 mt-4 bg-[#50e3c2] text-white hover:bg-[#7ce2cc] p-4 rounded-lg font-bold'>
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <p>No user data found.</p>
                        )}

                        {/* Skill Tree Navigation */}
                        <Link to="/skilltree">
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-blue-700 transition-all duration-300">
                                🚀 View Skill Tree
                            </button>
                        </Link>
                    </div>

                    {/* User Performance Section */}
                    <div className='p-4'>
                        <h2 className='text-xl font-semibold text-[#4a90e2] mb-2'>User Performance</h2>
                        <UserInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;