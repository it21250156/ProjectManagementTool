import React, { useState } from 'react';
import Swal from 'sweetalert2';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Team created successfully!',
                });
                closeModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to create team.',
                });
            }
        } catch (error) {
            console.error('Error creating team:', error);
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'An error occurred while creating the team.',
            });
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md"
            onClick={closeModal}
        >
            {/* Prevent closing when clicking inside the modal */}
            <div
                className="relative p-4 w-full max-w-2xl bg-[#F5A623] rounded-3xl shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4">
                    <h3 className="text-4xl font-bold w-full text-white">Create a Team</h3>
                    <button onClick={closeModal} className="text-white hover:text-gray-600">
                        ✕
                    </button>
                </div>
                <div className="p-4 bg-white rounded-xl text-black">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 font-bold">
                            <label htmlFor="team_id">Team Code*</label>
                            <br />
                            <input
                                type="text"
                                id="team_id"
                                name="team_id"
                                value={formData.team_id}
                                onChange={handleChange}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                placeholder="Enter Team Code"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="team_name">Team Name*</label>
                            <br />
                            <input
                                type="text"
                                id="team_name"
                                name="team_name"
                                value={formData.team_name}
                                onChange={handleChange}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                placeholder="Enter Team Name"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="team_experience_level">Experience Level (1-5)*</label>
                            <br />
                            <input
                                type="number"
                                id="team_experience_level"
                                name="team_experience_level"
                                value={formData.team_experience_level}
                                onChange={handleChange}
                                min="1"
                                max="5"
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="total_members">Total Members*</label>
                            <br />
                            <input
                                type="number"
                                id="total_members"
                                name="total_members"
                                value={formData.total_members}
                                onChange={handleChange}
                                min="1"
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="past_projects_completed">Past Projects Completed*</label>
                            <br />
                            <input
                                type="number"
                                id="past_projects_completed"
                                name="past_projects_completed"
                                value={formData.past_projects_completed}
                                onChange={handleChange}
                                min="0"
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="specialization">Specialization*</label>
                            <br />
                            <input
                                type="text"
                                id="specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                placeholder="Enter Specialization"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="team_skillset_match">Skillset Match (%)*</label>
                            <br />
                            <input
                                type="number"
                                id="team_skillset_match"
                                name="team_skillset_match"
                                value={formData.team_skillset_match}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                required
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="team_availability">Availability (%)*</label>
                            <br />
                            <input
                                type="number"
                                id="team_availability"
                                name="team_availability"
                                value={formData.team_availability}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                                required
                            />
                        </div>

                        <div className="my-5">
                            <button
                                type="submit"
                                className="flex w-1/3 justify-center mx-auto rounded-md bg-[#4A90E2] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-[#4A90E2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C71B1]"
                            >
                                Create Team
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;