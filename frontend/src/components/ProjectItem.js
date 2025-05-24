import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Trophy, 
  MoreVertical, 
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const ProjectItem = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`
      group hover:bg-gradient-to-r hover:from-[#50E3C2]/5 hover:to-[#4a90e2]/5 
      transition-all duration-300 
      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
    `}>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 p-6 items-center">
        {/* Project Name */}
        <div className="col-span-3 pr-4">
          <h3 className="font-bold text-lg text-[#4a90e2] group-hover:text-[#50E3C2] transition-colors">
            {project.projectName}
          </h3>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(project.createdAt)}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-7 px-4 border-l border-gray-200/50">
          <p className="text-gray-700 leading-relaxed">
            {project.projectDescription}
          </p>
          {project.teamSize && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {project.teamSize} team members
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-2 pl-4 border-l border-gray-200/50">
          <div className="flex items-center justify-center space-x-2">
            {/* View Tasks */}
            <Link 
              to={`/project/${project._id}`}
              className="p-2 rounded-lg bg-[#4a90e2]/10 hover:bg-[#4a90e2]/20 text-[#4a90e2] hover:text-[#4a90e2] transition-all duration-200 group/btn"
              title="View Tasks"
            >
              <CheckSquare className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
            </Link>

            {/* Leaderboard */}
            <Link 
              to={`/project/${project._id}/leaderboard`}
              className="p-2 rounded-lg bg-[#50E3C2]/10 hover:bg-[#50E3C2]/20 text-[#4a90e2] hover:text-[#50E3C2] transition-all duration-200 group/btn"
              title="Leaderboard"
            >
              <Trophy className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
            </Link>

            {/* More Actions */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-[#f5a623]/10 hover:bg-[#f5a623]/20 text-[#4a90e2] hover:text-[#f5a623] transition-all duration-200 group/btn"
                title="More Actions"
              >
                <MoreVertical className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={closeMenu} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200/50 z-20 overflow-hidden">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left hover:bg-[#4a90e2]/10 text-gray-700 hover:text-[#4a90e2] transition-colors flex items-center">
                        <Eye className="h-4 w-4 mr-3" />
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-[#50E3C2]/10 text-gray-700 hover:text-[#50E3C2] transition-colors flex items-center">
                        <Edit className="h-4 w-4 mr-3" />
                        Edit Project
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors flex items-center">
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete Project
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Main Card */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#4a90e2] mb-1">
                {project.projectName}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(project.createdAt)}
              </div>
            </div>
            
            <button
              onClick={toggleExpanded}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.projectDescription}
          </p>

          {project.teamSize && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Users className="h-4 w-4 mr-1" />
              {project.teamSize} team members
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Link 
              to={`/project/${project._id}`}
              className="flex-1 bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white px-4 py-2 rounded-lg text-center font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Link>
            
            <Link 
              to={`/project/${project._id}/leaderboard`}
              className="flex-1 bg-gradient-to-r from-[#50E3C2] to-[#4a90e2] text-white px-4 py-2 rounded-lg text-center font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Board
            </Link>

            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-[#f5a623]/10 hover:bg-[#f5a623]/20 text-[#f5a623] transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={closeMenu} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200/50 z-20 overflow-hidden">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left hover:bg-[#4a90e2]/10 text-gray-700 hover:text-[#4a90e2] transition-colors flex items-center">
                        <Eye className="h-4 w-4 mr-3" />
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-[#50E3C2]/10 text-gray-700 hover:text-[#50E3C2] transition-colors flex items-center">
                        <Edit className="h-4 w-4 mr-3" />
                        Edit Project
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors flex items-center">
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete Project
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200/50 bg-gradient-to-r from-[#50E3C2]/5 to-[#4a90e2]/5">
            <div className="pt-4">
              <h4 className="font-semibold text-[#4a90e2] mb-2">Full Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {project.projectDescription}
              </p>
              
              {/* Additional project details could go here */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-lg">
                  <span className="text-gray-500">Created</span>
                  <p className="font-medium text-[#4a90e2]">{formatDate(project.createdAt)}</p>
                </div>
                {project.teamSize && (
                  <div className="bg-white/50 p-3 rounded-lg">
                    <span className="text-gray-500">Team Size</span>
                    <p className="font-medium text-[#4a90e2]">{project.teamSize}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;