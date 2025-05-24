import React from 'react';

const DelayProbabilityCard = ({ profile }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-600">My Profile</h2>
      <div className="mt-4 border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Experience:</strong> {profile.experience}</p>
        <p><strong>Completed Tasks:</strong> {profile.completedTasks}</p>
        <p><strong>Earned XP:</strong> {profile.earnedXP}</p>
        <p><strong>Level:</strong> {profile.level}</p>
      </div>

      <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
        <h4 className="text-yellow-700 font-bold flex items-center">
          ⚠️ Delay Probability
        </h4>
        <p className="font-semibold text-yellow-800">Delay Probability: {profile.delayProbability}</p>
        <p className="mt-2 text-sm text-gray-700">{profile.delayMessage}</p>
      </div>
    </div>
  );
};

export default DelayProbabilityCard;
