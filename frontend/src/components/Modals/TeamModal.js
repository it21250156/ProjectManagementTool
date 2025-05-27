import React, { useState } from 'react';
import { X, Users } from 'lucide-react';

const TeamModal = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        team_id: '',
        team_name: '',
        team_experience_level: 1,
        total_members: 1,
        past_projects_completed: 0,
        specialization: '',
        team_skillset_match: 0,
        team_availability: 0,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!formData.team_id || !formData.team_name || !formData.specialization) {
            setError("Team Code, Team Name, and Specialization are required.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Team created successfully:', data);
                closeModal();
                // You can add a success notification here if needed
            } else {
                setError(data.message || 'Failed to create team.');
            }
        } catch (error) {
            console.error('Error creating team:', error);
            setError('An error occurred while creating the team.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white flex items-center">
                            <Users className="mr-2 h-6 w-6" />
                            Create New Team
                        </h3>
                        <button 
                            onClick={closeModal} 
                            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Team Code */}
                        <div>
                            <label htmlFor="team_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                Team Code *
                            </label>
                            <input
                                type="text"
                                id="team_id"
                                name="team_id"
                                required
                                value={formData.team_id}
                                onChange={handleChange}
                                placeholder="Enter unique team code"
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Team Name */}
                        <div>
                            <label htmlFor="team_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Team Name *
                            </label>
                            <input
                                type="text"
                                id="team_name"
                                name="team_name"
                                required
                                value={formData.team_name}
                                onChange={handleChange}
                                placeholder="Enter team name"
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Two-column layout for numeric fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Experience Level */}
                            <div>
                                <label htmlFor="team_experience_level" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Experience Level (1-5) *
                                </label>
                                <input
                                    type="number"
                                    id="team_experience_level"
                                    name="team_experience_level"
                                    required
                                    value={formData.team_experience_level}
                                    onChange={handleChange}
                                    min="1"
                                    max="5"
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                                />
                            </div>

                            {/* Total Members */}
                            <div>
                                <label htmlFor="total_members" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Total Members *
                                </label>
                                <input
                                    type="number"
                                    id="total_members"
                                    name="total_members"
                                    required
                                    value={formData.total_members}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Past Projects */}
                        <div>
                            <label htmlFor="past_projects_completed" className="block text-sm font-semibold text-gray-700 mb-2">
                                Past Projects Completed *
                            </label>
                            <input
                                type="number"
                                id="past_projects_completed"
                                name="past_projects_completed"
                                required
                                value={formData.past_projects_completed}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Specialization */}
                        <div>
                            <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                                Specialization *
                            </label>
                            <input
                                type="text"
                                id="specialization"
                                name="specialization"
                                required
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="e.g., Web Development, Mobile Apps, AI/ML"
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Two-column layout for percentage fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Skillset Match */}
                            <div>
                                <label htmlFor="team_skillset_match" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skillset Match (%) *
                                </label>
                                <input
                                    type="number"
                                    id="team_skillset_match"
                                    name="team_skillset_match"
                                    required
                                    value={formData.team_skillset_match}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <label htmlFor="team_availability" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Availability (%) *
                                </label>
                                <input
                                    type="number"
                                    id="team_availability"
                                    name="team_availability"
                                    required
                                    value={formData.team_availability}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-red-800 font-medium text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] hover:from-[#50E3C2] hover:to-[#4a90e2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Team...
                                    </>
                                ) : (
                                    <>
                                        <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Create Team
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;