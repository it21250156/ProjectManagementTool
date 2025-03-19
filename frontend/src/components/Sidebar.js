import React, { useContext, useState } from 'react'
import TaskModal from './Modals/TaskModal';
import ProjectModal from './Modals/ProjectModal';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TeamModal from './Modals/TeamModal';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const { dispatch } = useContext(AuthContext);

    const navigate = useNavigate();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const openTaskModal = () => {
        setIsTaskModalOpen(true);
        closeModal();
    };
    const closeTaskModal = () => setIsTaskModalOpen(false);

    const openProjectModal = () => {
        setIsProjectModalOpen(true);
        closeModal();
    };
    const closeProjectModal = () => setIsProjectModalOpen(false);

    const openTeamModal = () => {
        setIsTeamModalOpen(true);
        closeModal();
    };
    const closeTeamModal = () => setIsTeamModalOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token');

        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    return (
        <>
            <div className='col flex flex-col h-screen shadow-lg shadow-[#F5A623]'>
                <div className='flex-1'>
                    <div className='logo-div border-b-2 border-[#4a90e2] h-16'>
                        {/* <h1>Project Management Tool</h1> */}
                    </div>
                    <div className='m-2'>
                        <button
                            onClick={openModal}
                            type="button"
                            class="text-[#333333] bg-[#50e3c2] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-full text-lg w-full py-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Create
                        </button>
                    </div>
                    <div className='py-2 px-1 my-1'>


                        <Link to="/home">
                            <button type="button" class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Dashboard
                            </button>
                        </Link>

                        {/* <Link to="/my-tasks">
                            <button type="button" class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                My Tasks
                            </button>
                        </Link> */}

                        <Link to="/my-projects">
                            <button
                                type="button"
                                class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                My Projects
                            </button>
                        </Link>

                        <button type="button" class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            My Teams
                        </button>

                        <Link to="/my-profile">
                            <button type="button" class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                My Profile
                            </button>
                        </Link>

                        <Link to="/global-leaderboard">
                            <button type="button" class="text-white bg-[#4a90e2] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Global Leaderboard
                            </button>
                        </Link>

                    </div>
                </div>

                <div className='mt-auto'>
                    <button
                        type="button"
                        onClick={handleLogout}
                        class="text-white bg-[#f5a623] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold py-4 text-lg w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Logout
                    </button>
                </div>
            </div>

            {/* Modal with Blur Effect */}
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md"
                    onClick={closeModal}
                >
                    {/* Click detection wrapper */}
                    <div
                        className="relative p-4 w-full max-w-md bg-[#4A90E2] rounded-3xl shadow-md"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-4xl font-bold w-full text-center text-white">Create a...</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-4 mb-4">
                                <li>
                                    <button
                                        type="button"
                                        onClick={openProjectModal}
                                        class="text-white bg-[#F5A623] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-3xl py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Project
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={openTaskModal}
                                        class="text-white bg-[#F5A623] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-3xl py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Task
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={openTeamModal}
                                        className="text-white bg-[#F5A623] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-xl text-3xl py-4 w-full mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Team
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {isTaskModalOpen && <TaskModal closeModal={closeTaskModal} />}
            {isProjectModalOpen && <ProjectModal closeModal={closeProjectModal} />}
            {isTeamModalOpen && <TeamModal closeModal={closeTeamModal} />}
        </>
    )
}

export default Sidebar