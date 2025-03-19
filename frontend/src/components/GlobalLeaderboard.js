import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalLeaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/user/leaderboard');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="bg-white rounded-lg mt-5">
            {loading ? (
                <p className="text-center">Loading leaderboard...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ul className="list-none p-0">
                    {users.map((user, index) => (
                        <li
                            key={user._id}
                            className={`m-2 px-5 border-b border-gray-300 text-lg flex justify-between  ${index === 0 ? 'font-bold text-white text-4xl py-5 px-8 scale-110 mb-6 bg-[#4a90e2] rounded-full shadow-lg' : 'text-gray-700 hover:bg-slate-100'}`}
                        >
                            <span className={`font-bold italic my-2 ${index === 0 ? 'text-5xl' : 'text-3xl'}`}>
                                {index + 1}. <span className='text-xl ml-10 font-normal'>{user.name}</span>
                            </span>

                            <span className={`font-black text-3xl ${index === 0 ? ' text-white text-5xl p-5' : 'text-gray-700'}`} >{user.earnedXP} XP</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GlobalLeaderboard;
