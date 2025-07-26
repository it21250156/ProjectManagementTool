import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Target,
  Zap,
  BarChart3,
  Bot,
  Brain,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Database,
  Settings,
  Star,
  Trophy,
  User,
  Activity,
  AlertCircle,
  Info,
  MessageCircle,
  Bell
} from "lucide-react";
import ShowMessageModal from "../components/Modals/showMessageModal";

// Realistic delay probability categories
const getDelayLabel = (prob) => {
  if (prob < 0.2) return "Low";
  if (prob < 0.5) return "Medium-Low";
  if (prob < 0.75) return "Medium-High";
  return "High";
};

const getDelayColor = (prob) => {
  if (prob < 0.2) return "from-green-500 to-emerald-500";
  if (prob < 0.5) return "from-yellow-400 to-yellow-600";
  if (prob < 0.75) return "from-orange-400 to-orange-600";
  return "from-red-500 to-pink-500";
};

const getDelayBgColor = (prob) => {
  if (prob < 0.2) return "from-green-50 to-emerald-50 border-green-200";
  if (prob < 0.5) return "from-yellow-50 to-yellow-100 border-yellow-200";
  if (prob < 0.75) return "from-orange-50 to-orange-100 border-orange-200";
  return "from-red-50 to-pink-50 border-red-200";
};

const UserPerformance = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState(null);

  // Fetch users without delayPrediction
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/performance-evaluation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Add empty delayPrediction to each user for now
        setUsers(res.data.map(u => ({ ...u, delayPrediction: null })));
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch delay prediction for each user using Gemini API
  useEffect(() => {
    const fetchDelayPredictions = async () => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        try {
          const res = await axios.post("/api/gemini/profile-delay-prediction", {
            level: user.level,
            completedTasks: user.completedTasks,
            earnedXP: user.earnedXP,
            avgEffortHours: user.avgEffortHours ?? 4, // Use default if missing
            onTimeDeliveryRate: user.onTimeDeliveryRate ?? 0.8,
            currentTaskLoad: user.currentTaskLoad ?? 3
          });
          // Update the user with delayPrediction
          setUsers(prev =>
            prev.map((u, idx) =>
              idx === i ? { ...u, delayPrediction: res.data } : u
            )
          );
        } catch (err) {
          // Optionally set error info
        }
      }
    };
    if (users.length > 0) fetchDelayPredictions();
    // eslint-disable-next-line
  }, [users.length]);

  // Handler for sending a message (replace with your logic)
  const handleSendMessage = (message) => {
    alert(`Message sent to ${modalUser?.name}: ${message}`);
    setModalUser(null);
  };

  const getExperienceLevel = (level) => {
    if (level === 1) return "Beginner";
    if (level < 8) return "Intermediate";
    return "Advanced";
  };

  const getExperienceColor = (level) => {
    if (level === 1) return "from-blue-500 to-indigo-500";
    if (level < 8) return "from-purple-500 to-indigo-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-3xl lg:text-4xl font-bold">
                    User Performance Analytics
                  </h1>
                  <p className="text-white/80 text-lg mt-1">
                    AI-powered performance monitoring and delay prediction
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <Bot className="h-5 w-5 mr-2" />
                    <span className="font-medium">AI Powered</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center text-white">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="font-medium">Real-time Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
              <div className="flex items-center space-x-2 mb-4 justify-center">
                <div className="w-4 h-4 rounded-full bg-[#4a90e2] animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-lg font-medium text-[#4a90e2]">Loading user performance data...</p>
              <p className="text-gray-600 mt-1">This may take a few moments</p>
            </div>
          </div>
        ) : (
          /* Users Grid */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {users.map((user, idx) => (
              <div
                key={user._id || idx}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
              >
                {/* User Header */}
                <div className="bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-3 rounded-xl mr-4">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#4a90e2]">{user.name}</h2>
                        <p className="text-gray-600">Performance Overview</p>
                      </div>
                    </div>
                    <div className={`bg-gradient-to-r ${getExperienceColor(user.level)} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                      {getExperienceLevel(user.level)}
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg w-fit mx-auto mb-2">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{user.completedTasks}</p>
                      <p className="text-xs text-gray-600">Completed Tasks</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 text-center">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg w-fit mx-auto mb-2">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{user.earnedXP}</p>
                      <p className="text-xs text-gray-600">Experience Points</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg w-fit mx-auto mb-2">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{user.level}</p>
                      <p className="text-xs text-gray-600">Current Level</p>
                    </div>
                    
                   <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg w-fit mx-auto mb-2">
    <Clock className="h-5 w-5 text-white" />
  </div>
  <p className="text-2xl font-bold text-orange-600">
    {user.avgEffortHours && user.avgEffortHours > 0 ? user.avgEffortHours : 4}
  </p>
  <p className="text-xs text-gray-600">Avg Effort Hours</p>
</div>
                  </div>

                  {/* Delay Prediction Section */}
                  <div className={`bg-gradient-to-br ${user.delayPrediction ? getDelayBgColor(user.delayPrediction.delayProbability) : 'from-gray-50 to-gray-100 border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center mb-4">
                      <div className={`bg-gradient-to-r ${user.delayPrediction ? getDelayColor(user.delayPrediction.delayProbability) : 'from-gray-400 to-gray-500'} p-2 rounded-lg mr-3`}>
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-[#4a90e2]">AI Delay Prediction</h3>
                    </div>

                    {user.delayPrediction ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className={`bg-gradient-to-r ${getDelayColor(user.delayPrediction.delayProbability)} text-white px-6 py-3 rounded-2xl font-bold text-xl inline-block shadow-lg`}>
                            {getDelayLabel(user.delayPrediction.delayProbability)} Risk
                          </div>
                        </div>
                        
                        <div className="bg-white/70 rounded-xl p-4">
                          <h4 className="font-bold text-[#4a90e2] mb-2 flex items-center">
                            <Brain className="h-4 w-4 mr-2" />
                            AI Analysis
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {user.delayPrediction.reason}
                          </p>
                        </div>

                        {/* Message Button for High Risk */}
                        {getDelayLabel(user.delayPrediction.delayProbability) === "High" && (
                          <div className="flex justify-center">
                            <button
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                              onClick={() => setModalUser(user)}
                            >
                              <MessageCircle className="h-5 w-5 mr-2" />
                              Send Alert Message
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-[#4a90e2] animate-bounce"></div>
                          <div className="w-3 h-3 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <p className="text-gray-600 font-medium">Analyzing performance data...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Modal */}
        <ShowMessageModal
          user={modalUser}
          open={!!modalUser}
          onClose={() => setModalUser(null)}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default UserPerformance; 