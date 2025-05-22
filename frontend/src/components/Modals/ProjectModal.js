import React, { useState, useEffect } from 'react';
import { useProjectsContext } from '../../hooks/useProjectsContext';
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
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !startDate) {
            setError("Project Name and Start Date are required.");
            return;
        }

        // Extract member ObjectIds from selectedMembers
        const memberIds = selectedMembers.map(member => member.value);

        const project = {
            projectName,
            projectDescription,
            start_date: startDate,
            members: memberIds, // Directly store ObjectIds
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

            dispatch({ type: 'CREATE_PROJECT', payload: json });

            closeModal();

        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.message || 'Failed to create project. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-90 bg-black/30 backdrop-blur-md" onClick={closeModal}>
            <div className="relative p-4 w-full max-w-2xl bg-[#F5A623] rounded-3xl shadow-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4">
                    <h3 className="text-4xl font-bold w-full text-white">Create a Project</h3>
                    <button onClick={closeModal} className="text-white hover:text-gray-600">✕</button>
                </div>
                <div className="p-4 bg-white rounded-xl text-black">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 font-bold">
                            <label htmlFor="projectName">Project Name*</label>
                            <input
                                type="text" id="projectName" name="projectName"
                                onChange={(e) => setProjectName(e.target.value)} value={projectName}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="projectDescription">Description</label>
                            <textarea
                                id="projectDescription" name="projectDescription"
                                onChange={(e) => setProjectDescription(e.target.value)} value={projectDescription}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label>Start Date</label>
                            <br />
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                min={getTodayDate()}
                                onChange={(e) => setStartDate(e.target.value)}
                                value={startDate}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                            />
                        </div>

                        <div className='mb-3 font-bold'>
                            <label>Members</label>
                            {loading ? (
                                <p>Loading members...</p>
                            ) : (
                                <MultiSelectDropdown
                                    options={members}
                                    placeholder="Select Members"
                                    onChange={setSelectedMembers}
                                />
                            )}
                        </div>

                        <div className="my-5">
                            <button type="submit" className="flex w-1/3 justify-center mx-auto rounded-md bg-[#4A90E2] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-[#4A90E2]">
                                Create Project
                            </button>
                            {error && <div className='error text-red-500 mt-2'>{error}</div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
