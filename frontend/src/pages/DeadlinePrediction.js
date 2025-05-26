import React from 'react';
import { 
    Calendar, 
    Clock, 
    TrendingUp, 
    Target,
    Zap,
    BarChart3
} from 'lucide-react';
import Dashboard from '../components/Dashboard';

const DeadlinePrediction = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-white text-3xl lg:text-4xl font-bold">
                                        Project Deadline Prediction
                                    </h1>
                                    <p className="text-white/80 text-lg mt-1">
                                        AI-powered timeline estimation and deadline management
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                                    <div className="flex items-center text-white">
                                        <Zap className="h-5 w-5 mr-2" />
                                        <span className="font-medium">ML Powered</span>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                                    <div className="flex items-center text-white">
                                        <BarChart3 className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Real-time Analysis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-2 rounded-lg mr-3">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-[#4a90e2]">Smart Scheduling</h3>
                        </div>
                        <p className="text-gray-600">
                            Advanced algorithms analyze project complexity and team dynamics to predict accurate timelines.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-[#50E3C2] to-[#f5a623] p-2 rounded-lg mr-3">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-[#4a90e2]">Impact Analysis</h3>
                        </div>
                        <p className="text-gray-600">
                            Real-time assessment of requirement changes and their effect on project deadlines.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-[#f5a623] to-[#4a90e2] p-2 rounded-lg mr-3">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-[#4a90e2]">Dual Predictions</h3>
                        </div>
                        <p className="text-gray-600">
                            Compare ML model predictions with AI-powered analysis for comprehensive insights.
                        </p>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#4a90e2]">Prediction Dashboard</h2>
                                <p className="text-gray-600 mt-1">Select a project to view detailed timeline predictions and deadline analysis</p>
                            </div>
                            <div className="hidden md:flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#4a90e2] animate-pulse"></div>
                                <div className="w-3 h-3 rounded-full bg-[#50E3C2] animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                <div className="w-3 h-3 rounded-full bg-[#f5a623] animate-pulse" style={{animationDelay: '1s'}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Dashboard />
                    </div>
                </div>

                {/* Bottom Info Cards */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-[#4a90e2] mb-3 flex items-center">
                            <Zap className="h-5 w-5 mr-2" />
                            ML Model Insights
                        </h3>
                        <p className="text-gray-700 mb-3">
                            Our machine learning model analyzes historical project data, team performance metrics, and complexity factors to provide data-driven timeline predictions.
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>• Considers requirement change impact</div>
                            <div>• Analyzes team size and productivity</div>
                            <div>• Factors in project complexity</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-[#4a90e2] mb-3 flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            AI-Powered Analysis
                        </h3>
                        <p className="text-gray-700 mb-3">
                            Advanced AI provides contextual analysis of your project parameters, offering reasoned predictions with detailed explanations for better decision-making.
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>• Natural language explanations</div>
                            <div>• Context-aware recommendations</div>
                            <div>• Risk assessment and mitigation</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlinePrediction;