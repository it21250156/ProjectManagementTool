import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Trophy, 
    Crown, 
    Star, 
    TrendingUp, 
    Zap, 
    Medal, 
    Target,
    Award,
    ChevronUp,
    Users,
    Sparkles,
    Flame
} from 'lucide-react';

// Import celebration GIFs (you'll need to add these to your assets)
import AnimationWinner from '../assets/Animation_winner.gif';
import AnimationCelebration from '../assets/Animation_celebration.gif';
import AnimationTrophy from '../assets/Animation_trophy.gif';

const GlobalLeaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/user/leaderboard');
                setUsers(response.data);
                
                // Find current user's rank (you'll need to implement this based on your auth system)
                const currentUser = response.data.find(user => user.isCurrentUser);
                if (currentUser) {
                    setCurrentUserRank(response.data.indexOf(currentUser) + 1);
                }
                
                // Show celebration effect for top performers
                if (response.data.length > 0) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
            case 2: return <Medal className="h-6 w-6 text-gray-400" />;
            case 3: return <Award className="h-6 w-6 text-amber-600" />;
            default: return <Target className="h-5 w-5 text-[#4a90e2]" />;
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-400/50";
        } else if (rank === 2) {
            return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 shadow-gray-400/50";
        } else if (rank === 3) {
            return "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 shadow-amber-500/50";
        } else if (rank <= 10) {
            return "bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] shadow-blue-400/50";
        } else {
            return "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-400/30";
        }
    };

    const getXPColor = (rank) => {
        if (rank <= 3) return "text-yellow-600 font-black";
        if (rank <= 10) return "text-[#4a90e2] font-bold";
        return "text-gray-600 font-semibold";
    };

    const getPodiumHeight = (rank) => {
        if (rank === 1) return "h-32";
        if (rank === 2) return "h-24";
        if (rank === 3) return "h-20";
        return "h-16";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <Trophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#4a90e2]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#4a90e2] mb-2">Loading Champions...</h3>
                            <p className="text-gray-600">Fetching the hall of fame</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Zap className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-400 animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random()}s`
                            }}
                        ></div>
                    ))}
                </div>
            )}

            <div className="relative z-10 p-4 lg:p-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="mb-12 text-center">
                    <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-8 lg:p-12 rounded-3xl shadow-2xl shadow-yellow-500/25 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                                        <Crown className="h-16 w-16 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <Sparkles className="h-6 w-6 text-white animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-white text-5xl lg:text-7xl font-black mb-4 tracking-tight">
                                HALL OF FAME
                            </h1>
                            <p className="text-white/90 text-xl lg:text-2xl font-bold mb-4">
                                🏆 Global Champions Leaderboard 🏆
                            </p>
                            <div className="flex justify-center items-center space-x-4 text-white/80">
                                <Users className="h-5 w-5" />
                                <span className="font-semibold">{users.length} Warriors Competing</span>
                                <Flame className="h-5 w-5 text-orange-300" />
                                <span className="font-semibold">Live Rankings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top 3 Podium */}
                {users.length >= 3 && (
                    <div className="mb-12">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                            <h2 className="text-3xl font-black text-center text-white mb-8 flex items-center justify-center">
                                <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
                                TOP CHAMPIONS
                                <Trophy className="h-8 w-8 ml-3 text-yellow-400" />
                            </h2>
                            
                            <div className="flex justify-center items-end space-x-4 lg:space-x-8">
                                {/* 2nd Place */}
                                <div className="text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="relative mb-4">
                                        <img
                                            src={AnimationCelebration}
                                            alt="Second Place"
                                            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full mx-auto border-4 border-gray-400 shadow-lg"
                                        />
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                            #2
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-t from-gray-600 to-gray-400 h-24 lg:h-32 rounded-t-xl flex items-end pb-4">
                                        <div className="w-full text-center text-white">
                                            <p className="font-bold text-lg">{users[1]?.name}</p>
                                            <p className="text-2xl font-black">{users[1]?.earnedXP} XP</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 1st Place */}
                                <div className="text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="relative mb-4">
                                        <img
                                            src={AnimationWinner}
                                            alt="First Place"
                                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50"
                                        />
                                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-lg font-black px-3 py-2 rounded-full animate-pulse">
                                            👑 #1
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-t from-yellow-600 to-yellow-400 h-32 lg:h-40 rounded-t-xl flex items-end pb-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent"></div>
                                        <div className="w-full text-center text-white relative z-10">
                                            <Crown className="h-6 w-6 mx-auto mb-2" />
                                            <p className="font-black text-xl">{users[0]?.name}</p>
                                            <p className="text-3xl font-black">{users[0]?.earnedXP} XP</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div className="text-center transform hover:scale-105 transition-all duration-300">
                                    <div className="relative mb-4">
                                        <img
                                            src={AnimationTrophy}
                                            alt="Third Place"
                                            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full mx-auto border-4 border-amber-600 shadow-lg"
                                        />
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white text-sm font-bold px-2 py-1 rounded-full">
                                            #3
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-t from-amber-700 to-amber-500 h-20 lg:h-28 rounded-t-xl flex items-end pb-4">
                                        <div className="w-full text-center text-white">
                                            <p className="font-bold text-lg">{users[2]?.name}</p>
                                            <p className="text-2xl font-black">{users[2]?.earnedXP} XP</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4a90e2]/20 via-[#50E3C2]/20 to-[#f5a623]/20 p-6 border-b border-white/10">
                        <h2 className="text-3xl font-black text-white flex items-center">
                            <TrendingUp className="h-8 w-8 mr-3 text-[#50E3C2]" />
                            GLOBAL RANKINGS
                            <Flame className="h-8 w-8 ml-3 text-orange-400 animate-pulse" />
                        </h2>
                        <p className="text-white/80 text-lg mt-2">Battle for supremacy • Climb the ranks • Earn glory</p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-3">
                            {users.map((user, index) => {
                                const rank = index + 1;
                                const isTopTier = rank <= 10;
                                const isCurrentUser = user.isCurrentUser;
                                
                                return (
                                    <div
                                        key={user._id || index}
                                        className={`
                                            relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                                            ${isCurrentUser ? 'ring-4 ring-[#50E3C2] ring-opacity-50' : ''}
                                            ${isTopTier ? 'bg-gradient-to-r from-white/20 to-white/10' : 'bg-white/5'}
                                            backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10
                                        `}
                                    >
                                        {/* Rank indicator glow effect */}
                                        {rank <= 3 && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl"></div>
                                        )}

                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center space-x-4 lg:space-x-6">
                                                {/* Rank Badge */}
                                                <div className={`
                                                    ${getRankBadge(rank)} 
                                                    text-white font-black text-lg lg:text-xl 
                                                    px-4 py-2 lg:px-6 lg:py-3 rounded-xl 
                                                    shadow-lg flex items-center justify-center 
                                                    min-w-[60px] lg:min-w-[80px]
                                                    ${rank <= 3 ? 'animate-pulse' : ''}
                                                `}>
                                                    <span className="mr-2">#{rank}</span>
                                                    {getRankIcon(rank)}
                                                </div>

                                                {/* User Info */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className={`
                                                            w-12 h-12 lg:w-16 lg:h-16 rounded-full 
                                                            bg-gradient-to-br from-[#4a90e2] to-[#50E3C2] 
                                                            flex items-center justify-center text-white font-bold text-xl
                                                            ${rank <= 3 ? 'ring-4 ring-yellow-400/50' : ''}
                                                        `}>
                                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        {rank <= 3 && (
                                                            <div className="absolute -top-1 -right-1">
                                                                <Star className="h-4 w-4 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className={`
                                                            font-bold text-lg lg:text-xl text-white
                                                            ${isCurrentUser ? 'text-[#50E3C2]' : ''}
                                                            ${rank <= 3 ? 'text-2xl' : ''}
                                                        `}>
                                                            {user.name}
                                                            {isCurrentUser && (
                                                                <span className="ml-2 text-[#50E3C2] text-sm font-bold">
                                                                    (YOU)
                                                                </span>
                                                            )}
                                                        </h3>
                                                        {rank <= 10 && (
                                                            <p className="text-yellow-300 text-sm font-semibold flex items-center">
                                                                <Zap className="h-3 w-3 mr-1" />
                                                                Elite Player
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* XP Display */}
                                            <div className="text-right">
                                                <div className={`
                                                    text-2xl lg:text-3xl font-black ${getXPColor(rank)}
                                                    ${rank <= 3 ? 'text-4xl text-yellow-300' : ''}
                                                `}>
                                                    {user.earnedXP?.toLocaleString() || 0}
                                                </div>
                                                <div className="text-white/60 text-sm font-semibold">
                                                    XP POINTS
                                                </div>
                                                {rank <= 3 && (
                                                    <div className="flex justify-end mt-1">
                                                        <ChevronUp className="h-4 w-4 text-green-400 animate-bounce" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Special effects for top players */}
                                        {rank === 1 && (
                                            <div className="absolute top-2 right-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {users.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-white/10 rounded-2xl p-8">
                                    <Trophy className="h-16 w-16 text-white/50 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-2">The Arena Awaits</h3>
                                    <p className="text-white/70">Be the first to claim the throne and start the competition!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Motivational Footer */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                            <Flame className="h-6 w-6 mr-2 text-orange-400" />
                            YOUR JOURNEY TO GREATNESS STARTS NOW
                            <Flame className="h-6 w-6 ml-2 text-orange-400" />
                        </h3>
                        <p className="text-white/80 text-lg">
                            Complete tasks • Earn XP • Climb the ranks • Become a legend
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalLeaderboard;