import React, { useState, useEffect } from 'react';
import { useProjectsContext } from '../../hooks/useProjectsContext';
import { X, FolderPlus } from 'lucide-react';
import MultiSelectDropdown from '../MultiSelectDropdown';

const ProjectModal = ({ closeModal }) => {
    const { dispatch } = useProjectsContext();
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');

                const users = await response.json();
                setMembers(users.map(user => ({ value: user._id, label: user.name })));
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load members');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // today's date (YYYY-MM-DD)
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !startDate) {
            setError("Project Name and Start Date are required.");
            return;
        }

        const memberIds = selectedMembers.map(member => member.value);

        const project = {
            projectName,
            projectDescription,
            start_date: startDate,
            members: memberIds,
        };

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify(project),
                headers: { 'Content-Type': 'application/json' }
            });

            const json = await response.json();
            if (!response.ok) throw new Error(json.message || 'Failed to create project');

            console.log('Project created successfully:', json);
            setProjectName('');
            setProjectDescription('');
            setSelectedMembers([]);
            setStartDate('');

            dispatch({ type: 'CREATE_PROJECT', payload: json });

            closeModal();

        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.message || 'Failed to create project. Please try again.');
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
                            <FolderPlus className="mr-2 h-6 w-6" />
                            Create New Project
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
                        {/* Project Name */}
                        <div>
                            <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text" 
                                id="projectName" 
                                name="projectName"
                                required
                                onChange={(e) => setProjectName(e.target.value)} 
                                value={projectName}
                                placeholder="Enter project name"
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="projectDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="projectDescription" 
                                name="projectDescription"
                                rows="4"
                                onChange={(e) => setProjectDescription(e.target.value)} 
                                value={projectDescription}
                                placeholder="Describe your project..."
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium resize-none"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                required
                                min={getTodayDate()}
                                onChange={(e) => setStartDate(e.target.value)}
                                value={startDate}
                                className="w-full px-4 py-3 bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent transition-all font-medium"
                            />
                        </div>

                        {/* Members */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Team Members
                            </label>
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4A90E2]"></div>
                                    <span className="ml-3 text-gray-600">Loading members...</span>
                                </div>
                            ) : (
                                <MultiSelectDropdown
                                    options={members}
                                    
                                    placeholder="Select team members"
                                    onChange={setSelectedMembers}
                                />
                            )}
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
                                className="w-full bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] hover:from-[#50E3C2] hover:to-[#4a90e2] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
                            >
                                <FolderPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;