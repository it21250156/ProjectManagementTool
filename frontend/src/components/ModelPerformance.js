import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, Target, Clock, Bug, CheckCircle, AlertTriangle, Activity } from "lucide-react";

const ModelPerformance = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulating API call with mock data since axios isn't available
        setTimeout(() => {
            setPerformanceData({
                task_allocation: {
                    cross_validation_scores: [0.78, 0.74, 0.77, 0.76],
                    mean_cross_validation_accuracy: 0.7625,
                    test_accuracy: 0.76
                },
                project_timeline: {
                    r2_score: 0.922,
                    mae: 12.19,
                    rmse: 15.85
                },
                defect_prediction: {
                    r2_score: 0.8225,
                    mae: 2.92,
                    rmse: 3.67
                }
            });
            setLoading(false);
        }, 1000);
    }, []);

    const crossValidationData = performanceData?.task_allocation?.cross_validation_scores?.map((score, index) => ({
        fold: `Fold ${index + 1}`,
        accuracy: (score * 100).toFixed(1)
    })) || [];

    const modelComparisonData = [
        {
            model: "Task Allocation",
            accuracy: performanceData?.task_allocation?.test_accuracy ? (performanceData.task_allocation.test_accuracy * 100).toFixed(1) : 0,
            icon: Target
        },
        {
            model: "Timeline Prediction",
            accuracy: performanceData?.project_timeline?.r2_score ? (performanceData.project_timeline.r2_score * 100).toFixed(1) : 0,
            icon: Clock
        },
        {
            model: "Defect Prediction",
            accuracy: performanceData?.defect_prediction?.r2_score ? (performanceData.defect_prediction.r2_score * 100).toFixed(1) : 0,
            icon: Bug
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-lg font-medium text-slate-600">Loading Model Performance...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
                        <div className="flex items-center space-x-3 text-red-600">
                            <AlertTriangle className="h-6 w-6" />
                            <span className="text-lg font-medium">{error}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!performanceData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8">
                        <div className="flex items-center space-x-3 text-amber-600">
                            <AlertTriangle className="h-6 w-6" />
                            <span className="text-lg font-medium">No performance data available</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                            <Activity className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Model Performance Overview
                        </h1>
                    </div>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Comprehensive analysis of AI model performance metrics and accuracy scores
                    </p>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modelComparisonData.map((model, index) => {
                        const IconComponent = model.icon;
                        return (
                            <div key={index} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">{model.model}</h3>
                                        <p className="text-sm text-slate-600">Performance Score</p>
                                    </div>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <span className="text-3xl font-bold text-slate-800">{model.accuracy}%</span>
                                    <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                </div>
                                <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${model.accuracy}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cross-Validation Chart */}
                {crossValidationData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Cross-Validation Performance</h2>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={crossValidationData}>
                                    <defs>
                                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="fold" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="accuracy" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorAccuracy)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Detailed Model Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Task Allocation Model */}
                    {performanceData.task_allocation && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                    <Target className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Task Allocation Model</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">Mean CV Accuracy</span>
                                    <span className="font-bold text-slate-800">
                                        {(performanceData.task_allocation.mean_cross_validation_accuracy * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">Test Accuracy</span>
                                    <span className="font-bold text-slate-800">
                                        {(performanceData.task_allocation.test_accuracy * 100).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 leading-relaxed">
                                    Strong performance with reliable generalization to unseen data. The model demonstrates 
                                    consistent accuracy across validation folds.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Project Timeline Model */}
                    {performanceData.project_timeline && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Timeline Prediction</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">R² Score</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.project_timeline.r2_score.toFixed(3)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">MAE</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.project_timeline.mae.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">RMSE</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.project_timeline.rmse.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 leading-relaxed">
                                    Exceptional performance explaining 92.2% of timeline variance with high precision 
                                    and minimal prediction errors.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Defect Prediction Model */}
                    {performanceData.defect_prediction && (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                                    <Bug className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Defect Prediction</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">R² Score</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.defect_prediction.r2_score.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">MAE</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.defect_prediction.mae.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-600">RMSE</span>
                                    <span className="font-bold text-slate-800">
                                        {performanceData.defect_prediction.rmse.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 leading-relaxed">
                                    Strong predictive capabilities with 82.25% variance explanation and minimal 
                                    error rates for accurate defect forecasting.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModelPerformance;