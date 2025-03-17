import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div>
            <Header />
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>My Profile</h1>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    {/* Personal Information Section */}
                    <div className='border-2 border-[#f5a623] rounded-lg p-4'>
                        <h2 className='text-xl font-semibold text-[#f5a623]'>Personal Information</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className='text-red-500'>{error}</p>
                        ) : userData ? (
                            <div className='grid grid-cols-4'>
                                <div className='my-3 col font-semibold'>
                                    <p>Name: </p>
                                    <p>Email: </p>
                                    <p>Level: </p>

                                </div>
                                <div className='my-3 col-span-3'>
                                    <p>{userData.name}</p>
                                    <p>{userData.email}</p>
                                    <p>{userData.level}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No user data found.</p>
                        )}
                        <button className='w-full mt-4 bg-blue-500 text-white hover:bg-blue-600'>Edit Profile</button>
                    </div>

                    {/* UserInfo Component */}
                    <div className='border-2 border-[#f5a623] rounded-lg p-4'>
                        <h2 className='text-xl font-semibold text-[#f5a623]'>Personal Information</h2>

                        <UserInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;