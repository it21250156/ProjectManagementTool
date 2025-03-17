import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
    const { projectId } = useParams(); // ✅ Get project ID from URL
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!projectId) {
                setError('Project ID is missing.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/projects/${projectId}/leaderboard`); // ✅ Fetch leaderboard for project
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError(error.response?.data?.message || 'Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [projectId]); // ✅ Reload leaderboard when projectId changes

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">🏆 Project Leaderboard</h2>

            {loading ? (
                <p className="text-center">Loading leaderboard...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-center text-gray-500">No completed tasks yet.</p>
            ) : (
                <ul className="list-none p-0">
                    {users.map((user, index) => (
                        <li
                            key={user.memberId}
                            className={`p-2 border-b border-gray-300 text-lg flex justify-between ${
                                index === 0 ? 'font-bold text-yellow-500' : 'text-gray-700'
                            }`}
                        >
                            <span>
                                {index + 1}. {user.name}
                            </span>
                            <span>{user.points} points</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Leaderboard;
