<div className="rounded-t-2xl rounded-b-lg overflow-hidden shadow-lg border border-gray-200">
    {/* Header */}
    <div className="bg-yellow-300 px-6 py-6 rounded-t-2xl">
        <h1 className="text-4xl font-extrabold italic text-white text-center">My Profile</h1>
    </div>
    {/* Personal Info */}
    <div className="bg-white px-8 py-6">
        <h2 className="text-lg font-bold text-[#183153] mb-4">Personal Information</h2>
        <div className="mb-2 flex justify-between">
            <span className="font-semibold text-gray-800">Name</span>
            <span className="font-bold text-[#183153]">{localStorage.getItem('name') || "—"}</span>
        </div>
        <div className="mb-2 flex justify-between">
            <span className="font-semibold text-gray-800">Experience</span>
            <span className="font-bold text-[#183153]">
                {level === 1 ? "Beginner" : level < 5 ? "Intermediate" : "Advanced"}
            </span>
        </div>
        <div className="mb-2 flex justify-between">
            <span className="font-semibold text-gray-800">Completed Tasks</span>
            <span className="font-bold">{completedTasks}</span>
        </div>
        <div className="mb-2 flex justify-between">
            <span className="font-semibold text-gray-800">Earned XP</span>
            <span className="font-bold">{earnedXP}</span>
        </div>
        <div className="mb-2 flex justify-between">
            <span className="font-semibold text-gray-800">Level</span>
            <span className="font-bold">{level}</span>
        </div>
    </div>
    {/* Delay Probability */}
    <div className="bg-yellow-100 px-8 py-6 border-t border-yellow-200">
        <div className="flex items-center mb-2">
            <span className="text-yellow-700 text-2xl mr-2">⚠️</span>
            <span className="font-bold text-yellow-700 text-lg">Delay Probability</span>
        </div>
        {delayPrediction ? (
            <>
                <div className="font-bold text-yellow-800 text-xl mb-1">
                    Delay Probability: <span>{getDelayLabel(delayPrediction.delayProbability)}</span>
                </div>
                <div className="text-gray-800 text-base">
                    {delayPrediction.reason}
                </div>
            </>
        ) : (
            <button
                onClick={handleViewDelayProbability}
                className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
            >
                View Delay Probability
            </button>
        )}
    </div>
</div>