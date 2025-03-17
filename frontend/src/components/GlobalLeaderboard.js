import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalLeaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/user/leaderboard'); // ✅ Fetch top 5 users
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
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">🌍 Global Leaderboard</h2>

            {loading ? (
                <p className="text-center">Loading leaderboard...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ul className="list-none p-0">
                    {users.map((user, index) => (
                        <li
                            key={user._id}
                            className={`p-2 border-b border-gray-300 text-lg flex justify-between ${
                                index === 0 ? 'font-bold text-yellow-500' : 'text-gray-700'
                            }`}
                        >
                            <span>
                                {index + 1}. {user.name}
                            </span>
                            <span>{user.earnedXP} XP</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GlobalLeaderboard;
