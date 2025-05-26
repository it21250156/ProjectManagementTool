import React from 'react';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';

const ProjectLeaderboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50">
            {/* <Header /> */}
            <div className='m-4'>
                {/* Hero Section with Trophy Animation */}
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-2xl relative overflow-hidden'>
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-10 text-6xl animate-bounce">🏆</div>
                        <div className="absolute top-8 right-16 text-4xl animate-pulse">⭐</div>
                        <div className="absolute bottom-6 left-20 text-5xl animate-bounce delay-300">🎉</div>
                        <div className="absolute bottom-4 right-8 text-3xl animate-pulse delay-500">✨</div>
                        <div className="absolute top-12 left-1/3 text-4xl animate-bounce delay-700">🥇</div>
                        <div className="absolute bottom-8 right-1/3 text-3xl animate-pulse delay-1000">🎊</div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <span className="text-6xl mr-4 animate-spin-slow">🏆</span>
                            <h1 className='text-white text-4xl font-extrabold italic drop-shadow-lg'>
                                Project Champions
                            </h1>
                            <span className="text-6xl ml-4 animate-spin-slow">🏆</span>
                        </div>
                        <p className="text-white text-lg font-medium opacity-90 italic">
                            "Excellence is not a skill, it's an attitude" - Celebrating our top performers!
                        </p>
                        
                        {/* Floating Achievement Badges */}
                        <div className="flex justify-center space-x-4 mt-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse">
                                <span className="text-white font-bold text-sm">🔥 Hot Streak</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse delay-300">
                                <span className="text-white font-bold text-sm">⚡ Power Players</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 animate-pulse delay-700">
                                <span className="text-white font-bold text-sm">💎 Elite Squad</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Leaderboard Component */}
                <div className="relative">
                    {/* Celebratory Border Animation */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 rounded-lg blur opacity-25 animate-pulse"></div>
                    <div className="relative">
                        <Leaderboard />
                    </div>
                </div>
            </div>
            
            {/* Custom CSS for additional animations */}
            <style jsx>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ProjectLeaderboard;