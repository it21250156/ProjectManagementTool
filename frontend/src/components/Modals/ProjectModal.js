import React, { useState, useEffect } from 'react';
import { useProjectsContext } from '../../hooks/useProjectsContext';
import MultiSelectDropdown from '../MultiSelectDropdown';

const ProjectModal = ({ closeModal }) => {
    const { dispatch } = useProjectsContext();
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch all users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Ensure this matches your backend route
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

    // ✅ Handle project creation
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const project = { 
            projectName, 
            projectDescription, 
            members: selectedMembers.map(member => member.value) // ✅ Send only user IDs
        };
    
        try {
            const response = await fetch('/api/projects', { // ✅ Corrected endpoint
                method: 'POST',
                body: JSON.stringify(project),
                headers: { 'Content-Type': 'application/json' }
            });
    
            const json = await response.json();
            if (!response.ok) throw new Error(json.message || 'Failed to create project');
    
            setProjectName('');
            setProjectDescription('');
            setSelectedMembers([]);
            console.log('✅ Project created successfully:', json);
            closeModal();
            dispatch({ type: 'CREATE_PROJECT', payload: json.project });
    
        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.message);
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md" onClick={closeModal}>
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
