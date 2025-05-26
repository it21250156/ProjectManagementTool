import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
    const { projectId } = useParams();
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
                const response = await axios.get(`/api/projects/${projectId}/leaderboard`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError(error.response?.data?.message || 'Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [projectId]);

    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '🏅';
    };

    const getRankGradient = (index) => {
        if (index === 0) return 'from-yellow-400 to-yellow-600';
        if (index === 1) return 'from-gray-400 to-gray-600';
        if (index === 2) return 'from-amber-600 to-amber-800';
        return 'from-blue-400 to-blue-600';
    };

    const getPointsDisplay = (points) => {
        if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
        return points.toString();
    };

    return (
        <div className="bg-white shadow-2xl rounded-3xl p-8 border-4 border-gradient-to-r from-yellow-400 to-purple-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <div className="flex justify-center items-center mb-4">
                    <span className="text-4xl animate-bounce mr-2">👑</span>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Hall of Fame
                    </h2>
                    <span className="text-4xl animate-bounce ml-2">👑</span>
                </div>
                <p className="text-gray-600 italic">Where legends are made!</p>
            </div>

            {loading ? (
                // Enhanced Loading Animation
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="flex space-x-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-bounce"></div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                    <p className="text-gray-500 animate-pulse">Loading champions...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-gray-500 text-lg">The competition is about to begin!</p>
                    <p className="text-gray-400">Complete tasks to earn your spot on the leaderboard</p>
                </div>
            ) : (
                <div className="space-y-4 relative z-10">
                    {users.map((user, index) => (
                        <div
                            key={user.memberId}
                            className={`transform transition-all duration-300 hover:scale-105 ${
                                index === 0 ? 'animate-pulse' : ''
                            }`}
                        >
                            {/* Special treatment for top 3 */}
                            {index < 3 ? (
                                <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${getRankGradient(index)} text-white shadow-xl border-2 ${
                                    index === 0 ? 'border-yellow-300 shadow-yellow-400/50' :
                                    index === 1 ? 'border-gray-300 shadow-gray-400/50' :
                                    'border-amber-300 shadow-amber-400/50'
                                }`}>
                                    {/* Sparkle effect for winner */}
                                    {index === 0 && (
                                        <div className="absolute -top-2 -right-2 animate-ping">
                                            <span className="text-2xl">✨</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-4xl animate-bounce">
                                                {getRankIcon(index)}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold drop-shadow-lg">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm opacity-90">
                                                    {index === 0 ? '🔥 Champion' : 
                                                     index === 1 ? '⚡ Runner-up' : 
                                                     '💪 Third Place'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold drop-shadow-lg">
                                                {getPointsDisplay(user.points)}
                                            </p>
                                            <p className="text-sm opacity-90">points</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Regular participants
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500">Team Member</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-700">
                                                {getPointsDisplay(user.points)}
                                            </p>
                                            <p className="text-sm text-gray-500">points</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Motivational Footer */}
            {users.length > 0 && (
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
                    <p className="text-lg font-semibold text-purple-800 mb-2">
                        🎯 Keep pushing boundaries!
                    </p>
                    <p className="text-purple-600">
                        Every task completed brings you closer to the top!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;