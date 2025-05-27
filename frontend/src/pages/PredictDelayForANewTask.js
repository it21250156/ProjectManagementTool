import React, { useState } from "react";
import axios from 'axios';

import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Brain,
  BarChart3,
  CheckCircle,
  Activity,
  Target,
  Zap,
  User,
  Calendar,
  Award,
  Info,
  Timer,
  Gauge
} from "lucide-react";
// Note: axios import removed for artifact compatibility - use your existing axios import

const PredictDelayForANewTask = () => {
  const [form, setForm] = useState({
    level: "",
    completedTasks: "",
    avgEffortHours: "",
    onTimeDeliveryRate: "",
    currentTaskLoad: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/gemini/profile-delay-prediction", {
        level: Number(form.level),
        completedTasks: Number(form.completedTasks),
        avgEffortHours: Number(form.avgEffortHours),
        onTimeDeliveryRate: Number(form.onTimeDeliveryRate),
        currentTaskLoad: Number(form.currentTaskLoad),
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to predict delay probability."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (probability) => {
    const prob = parseFloat(probability);
    if (prob < 0.3) return { level: "Low", color: "from-green-500 to-emerald-500", bgColor: "from-green-50 to-emerald-50", borderColor: "border-green-200" };
    if (prob < 0.7) return { level: "Medium", color: "from-yellow-500 to-orange-500", bgColor: "from-yellow-50 to-orange-50", borderColor: "border-yellow-200" };
    return { level: "High", color: "from-red-500 to-red-600", bgColor: "from-red-50 to-red-100", borderColor: "border-red-200" };
  };

  const getPerformanceLevel = (rate) => {
    const performanceRate = parseFloat(rate);
    if (performanceRate >= 0.9) return { level: "Excellent", color: "text-green-600" };
    if (performanceRate >= 0.7) return { level: "Good", color: "text-blue-600" };
    if (performanceRate >= 0.5) return { level: "Average", color: "text-yellow-600" };
    return { level: "Needs Improvement", color: "text-red-600" };
  };

  const riskInfo = result ? getRiskLevel(result.delayProbability) : null;
  const performanceInfo = form.onTimeDeliveryRate ? getPerformanceLevel(form.onTimeDeliveryRate) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-3xl lg:text-4xl font-bold">
                    Delay Prediction Analysis
                  </h1>
                  <p className="text-white/80 text-lg mt-1">
                    AI-powered delay probability assessment for user profiles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <Brain className="h-5 w-5 mr-2" />
                    <span className="font-medium">AI Powered</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">Predictive Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Configuration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
            <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Profile Configuration
            </h3>
            <p className="text-gray-600 mt-1">Enter user metrics for delay probability analysis</p>
          </div>

          <div onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  User Level
                </label>
                <input 
                  type="number" 
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="Enter user level..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>

              {/* Completed Tasks */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed Tasks
                </label>
                <input 
                  type="number" 
                  name="completedTasks"
                  value={form.completedTasks}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="Total completed tasks..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>

              {/* Average Effort Hours */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Timer className="h-4 w-4 mr-2" />
                  Avg Effort Hours per Task
                </label>
                <input 
                  type="number" 
                  name="avgEffortHours"
                  value={form.avgEffortHours}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.1"
                  placeholder="Average hours per task..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>

              {/* On-Time Delivery Rate */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  On-Time Delivery Rate (0-1)
                </label>
                <input 
                  type="number" 
                  name="onTimeDeliveryRate"
                  value={form.onTimeDeliveryRate}
                  onChange={handleChange}
                  required
                  min={0}
                  max={1}
                  step="0.01"
                  placeholder="e.g., 0.85 for 85%..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>

              {/* Current Task Load */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Current Task Load
                </label>
                <input 
                  type="number" 
                  name="currentTaskLoad"
                  value={form.currentTaskLoad}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="Current number of active tasks..."
                  className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4dd8bd] text-white font-medium px-4 py-3 rounded-lg border-none placeholder-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#4A90E2] to-[#6ba3e8] text-white font-medium py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Predict Delay Probability
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        {(form.level || form.completedTasks || form.avgEffortHours || form.onTimeDeliveryRate || form.currentTaskLoad) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-[#50E3C2] to-[#f5a623] p-2 rounded-lg mr-3">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#4a90e2]">Profile Summary</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {form.level && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 text-center">
                  <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{form.level}</p>
                  <p className="text-xs text-gray-600">Level</p>
                </div>
              )}
              {form.completedTasks && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{form.completedTasks}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              )}
              {form.avgEffortHours && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center">
                  <Timer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{form.avgEffortHours}h</p>
                  <p className="text-xs text-gray-600">Avg Hours</p>
                </div>
              )}
              {form.onTimeDeliveryRate && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
                  <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{(parseFloat(form.onTimeDeliveryRate) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-600">On-Time Rate</p>
                  {performanceInfo && (
                    <p className={`text-xs font-medium mt-1 ${performanceInfo.color}`}>
                      {performanceInfo.level}
                    </p>
                  )}
                </div>
              )}
              {form.currentTaskLoad && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <Activity className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{form.currentTaskLoad}</p>
                  <p className="text-xs text-gray-600">Current Load</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h4 className="font-bold text-red-800">Prediction Error</h4>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#6ba3e8]/10 border-b border-gray-200/50 p-6">
              <h3 className="text-xl font-bold text-[#4a90e2] flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Delay Prediction Results
              </h3>
              <p className="text-gray-600 mt-1">Intelligent analysis of delay probability</p>
            </div>
            
            <div className="p-6">
              {/* Probability Display */}
              <div className="text-center mb-8">
                <div className={`bg-gradient-to-r ${riskInfo.color} text-white px-8 py-6 rounded-2xl font-bold text-3xl inline-block shadow-lg mb-4`}>
                  <Gauge className="h-8 w-8 inline mr-3" />
                  {(parseFloat(result.delayProbability) * 100).toFixed(1)}%
                </div>
                <p className="text-xl font-semibold text-gray-700">Delay Probability</p>
                <div className={`inline-block px-4 py-2 rounded-full font-medium text-sm mt-2 bg-gradient-to-r ${riskInfo.bgColor} ${riskInfo.borderColor} border`}>
                  {riskInfo.level} Risk
                </div>
              </div>

              {/* Risk Assessment */}
              <div className={`bg-gradient-to-br ${riskInfo.bgColor} ${riskInfo.borderColor} border rounded-xl p-6 mb-6`}>
                <h4 className="font-bold text-[#4a90e2] mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Risk Assessment
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-800">{(parseFloat(result.delayProbability) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Delay Probability</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-800">{(100 - (parseFloat(result.delayProbability) * 100)).toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Success Probability</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <Target className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-800">{riskInfo.level}</p>
                    <p className="text-sm text-gray-600">Risk Level</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`bg-gradient-to-r ${riskInfo.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                    style={{width: `${parseFloat(result.delayProbability) * 100}%`}}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0% (No Risk)</span>
                  <span>100% (High Risk)</span>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-[#4a90e2] mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Analysis & Recommendations
                </h4>
                <p className="text-gray-700 leading-relaxed">{result.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
              <div className="flex items-center space-x-2 mb-4 justify-center">
                <div className="w-4 h-4 rounded-full bg-[#4a90e2] animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-lg font-medium text-[#4a90e2]">Analyzing delay probability...</p>
              <p className="text-gray-600 mt-1">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictDelayForANewTask;