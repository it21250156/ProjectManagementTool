import React, { useEffect, useState } from "react";
import axios from "axios";

const getDelayLabel = (prob) => {
  if (prob < 0.33) return "Low";
  if (prob < 0.66) return "Medium";
  return "High";
};

const UserPerformance = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users' performance data from backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/performance-evaluation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
                      : user.level < 5
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
                  </>
                ) : (
                  <div className="text-gray-500">No prediction available.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPerformance;