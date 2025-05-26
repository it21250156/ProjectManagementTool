import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowMessageModal from "../components/Modals/showMessageModal"; // <-- Import your modal here

const getDelayLabel = (prob) => {
  if (prob < 0.33) return "Low";
  if (prob < 0.66) return "Medium";
  return "High";
};

const UserPerformance = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUser, setModalUser] = useState(null); // <-- For modal control

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
            avgEffortHours: user.avgEffortHours,
            onTimeDeliveryRate: user.onTimeDeliveryRate,
            currentTaskLoad: user.currentTaskLoad
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
    // You can send the message to the backend here
    alert(`Message sent to ${modalUser?.name}: ${message}`);
    setModalUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold italic text-center mb-8 text-yellow-600">User Performance</h1>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {users.map((user, idx) => (
            <div
              key={user._id || idx}
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white"
            >
              {/* Header */}
              <div className="bg-yellow-300 px-6 py-4 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white text-center">{user.name}</h2>
              </div>
              {/* Personal Info */}
              <div className="px-8 py-6">
                <h3 className="text-lg font-bold text-[#183153] mb-4">Personal Information</h3>
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Experience</span>
                  <span className="font-bold text-[#183153]">
                    {user.level === 1
                      ? "Beginner"
                      : user.level < 8
                      ? "Intermediate"
                      : "Advanced"}
                  </span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Completed Tasks</span>
                  <span className="font-bold">{user.completedTasks}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Earned XP</span>
                  <span className="font-bold">{user.earnedXP}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span className="font-semibold text-gray-800">Level</span>
                  <span className="font-bold">{user.level}</span>
                </div>
              </div>
              {/* Delay Probability */}
              <div className="bg-yellow-100 px-8 py-6 border-t border-yellow-200">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-700 text-2xl mr-2">⚠️</span>
                  <span className="font-bold text-yellow-700 text-lg">Delay Probability</span>
                </div>
                {user.delayPrediction ? (
                  <>
                    <div className="font-bold text-yellow-800 text-xl mb-1">
                      Delay Probability:{" "}
                      <span>{getDelayLabel(user.delayPrediction.delayProbability)}</span>
                    </div>
                    <div className="text-gray-800 text-base">
                      {user.delayPrediction.reason}
                    </div>
                    {/* Show message icon if high delay probability */}
                    {user.delayPrediction.status === "High" && (
                      <div className="flex items-center mt-4">
                        <button
                          className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
                          onClick={() => setModalUser(user)}
                          title={`Message ${user.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Message
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500">Predicting...</div>
                )}
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
  );
};

export default UserPerformance;