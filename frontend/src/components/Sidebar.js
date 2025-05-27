import React, { useContext, useState } from 'react';
import TaskModal from './Modals/TaskModal';
import ProjectModal from './Modals/ProjectModal';
import TeamModal from './Modals/TeamModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, 
  Home, 
  FolderOpen, 
  Users, 
  User, 
  Trophy, 
  LogOut,
  X,
  Briefcase,
  CheckSquare,
  UsersIcon,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    onClose?.(); // Close mobile sidebar when opening modal
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openTaskModal = () => {
    setIsTaskModalOpen(true);
    closeCreateModal();
  };
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const openProjectModal = () => {
    setIsProjectModalOpen(true);
    closeCreateModal();
  };
  const closeProjectModal = () => setIsProjectModalOpen(false);

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
    closeCreateModal();
  };
  const closeTeamModal = () => setIsTeamModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const navItems = [
    { path: '/home', icon: Home, label: 'Dashboard' },
    { path: '/my-projects', icon: FolderOpen, label: 'My Projects' },
    { path: '/my-teams', icon: Users, label: 'My Teams' },
    { path: '/my-profile', icon: User, label: 'My Profile' },
    { path: '/performance-evaluation', icon: BarChart3, label: 'Performance' },
    { path: '/global-leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80
        bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-lg
        shadow-2xl lg:shadow-lg border-r border-gray-200/50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        
        {/* Header */}
        <div className="border-b border-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="font-mono font-bold text-2xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#4a90e2] to-[#50E3C2]">
              CodeFlow.ai
            </h1>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Create Button */}
        <div className="p-4 lg:p-6">
          <button
            onClick={openCreateModal}
            className="w-full bg-gradient-to-r from-[#50E3C2] to-[#4a90e2] hover:from-[#4a90e2] hover:to-[#50E3C2] text-white font-bold rounded-xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Create New
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 lg:px-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                  ${active 
                    ? 'bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#50E3C2]/20 hover:to-[#4a90e2]/20 hover:text-[#4a90e2]'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-white' : 'text-gray-600 group-hover:text-[#4a90e2]'}`} />
                <span className="text-lg">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 lg:p-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-[#f5a623] to-orange-500 hover:from-orange-500 hover:to-[#f5a623] text-white font-bold rounded-xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <LogOut className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Logout
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md p-4">
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#4a90e2] to-[#50E3C2] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Plus className="mr-2 h-6 w-6" />
                  Create New
                </h3>
                <button 
                  onClick={closeCreateModal} 
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <button
                onClick={openProjectModal}
                className="w-full bg-gradient-to-r from-[#f5a623] to-orange-500 hover:from-orange-500 hover:to-[#f5a623] text-white font-bold rounded-xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Briefcase className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Project</span>
              </button>

              <button
                onClick={openTaskModal}
                className="w-full bg-gradient-to-r from-[#f5a623] to-orange-500 hover:from-orange-500 hover:to-[#f5a623] text-white font-bold rounded-xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <CheckSquare className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Task</span>
              </button>

              <button
                onClick={openTeamModal}
                className="w-full bg-gradient-to-r from-[#f5a623] to-orange-500 hover:from-orange-500 hover:to-[#f5a623] text-white font-bold rounded-xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <UsersIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isTaskModalOpen && <TaskModal closeModal={closeTaskModal} />}
      {isProjectModalOpen && <ProjectModal closeModal={closeProjectModal} />}
      {isTeamModalOpen && <TeamModal closeModal={closeTeamModal} />}
    </>
  );
};

export default Sidebar;