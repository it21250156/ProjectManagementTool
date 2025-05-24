import React, { useEffect, useState } from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext';
import ProjectItem from '../components/ProjectItem';
import { FolderOpen, Plus, Search } from 'lucide-react';

const MyProjects = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { projects, dispatch } = useProjectsContext();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const json = await response.json();
                console.log(json);
                dispatch({ type: 'SET_PROJECTS', payload: json });
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [dispatch]);

    const filteredProjects = projects?.filter(project =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-[#4a90e2] via-[#50E3C2] to-[#f5a623] p-6 lg:p-8 rounded-2xl shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                                    <FolderOpen className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-white text-3xl lg:text-4xl font-bold">
                                        My Projects
                                    </h1>
                                    <p className="text-white/80 text-lg mt-1">
                                        Manage and track your project portfolio
                                    </p>
                                </div>
                            </div>
                            
                            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center lg:justify-start group">
                                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                New Project
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Stats Section */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
                            />
                        </div>

                        {/* Project Count */}
                        <div className="bg-gradient-to-r from-[#50E3C2]/20 to-[#4a90e2]/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#50E3C2]/30">
                            <span className="text-[#4a90e2] font-semibold">
                                {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid lg:grid-cols-12 bg-gradient-to-r from-[#4a90e2]/10 to-[#50E3C2]/10 border-b border-gray-200/50">
                        <div className="col-span-3 p-6 font-bold text-[#4a90e2] text-lg">
                            Project Name
                        </div>
                        <div className="col-span-7 p-6 font-bold text-[#4a90e2] text-lg border-l border-gray-200/50">
                            Description
                        </div>
                        <div className="col-span-2 p-6 font-bold text-[#4a90e2] text-lg border-l border-gray-200/50 text-center">
                            Actions
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-12 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#4a90e2] animate-bounce"></div>
                                <div className="w-3 h-3 rounded-full bg-[#50E3C2] animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-3 h-3 rounded-full bg-[#f5a623] animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="p-8 text-center">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <p className="text-red-600 font-medium">Error loading projects</p>
                                <p className="text-red-500 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredProjects.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="bg-gray-50 rounded-xl p-8">
                                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {searchTerm ? 'No matching projects' : 'No projects yet'}
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms' 
                                        : 'Create your first project to get started'
                                    }
                                </p>
                                {!searchTerm && (
                                    <button className="mt-4 bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                        <Plus className="inline mr-2 h-5 w-5" />
                                        Create Project
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Projects List */}
                    {!loading && !error && filteredProjects.length > 0 && (
                        <div className="divide-y divide-gray-200/50">
                            {filteredProjects
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((project, index) => (
                                    <ProjectItem 
                                        key={project._id} 
                                        project={project} 
                                        index={index}
                                    />
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Additional Stats or Quick Actions could go here */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#4a90e2]/10 to-[#4a90e2]/20 p-6 rounded-xl border border-[#4a90e2]/20">
                        <h3 className="font-bold text-[#4a90e2] mb-2">Active Projects</h3>
                        <p className="text-2xl font-bold text-[#4a90e2]">{filteredProjects.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#50E3C2]/10 to-[#50E3C2]/20 p-6 rounded-xl border border-[#50E3C2]/20">
                        <h3 className="font-bold text-[#4a90e2] mb-2">This Month</h3>
                        <p className="text-2xl font-bold text-[#4a90e2]">
                            {filteredProjects.filter(p => {
                                const projectDate = new Date(p.createdAt);
                                const now = new Date();
                                return projectDate.getMonth() === now.getMonth() && 
                                       projectDate.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#f5a623]/10 to-[#f5a623]/20 p-6 rounded-xl border border-[#f5a623]/20">
                        <h3 className="font-bold text-[#4a90e2] mb-2">Completion Rate</h3>
                        <p className="text-2xl font-bold text-[#4a90e2]">85%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProjects;