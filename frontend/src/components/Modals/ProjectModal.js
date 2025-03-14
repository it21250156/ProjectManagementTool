import React, { useState } from 'react'
import { useProjectsContext } from '../../hooks/useProjectsContext'

const ProjectModal = ({ closeModal }) => {

    const { dispatch } = useProjectsContext()
    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const project = { projectName, projectDescription }

        const response = await fetch('/api/projects/add', {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.errors)
        } else {
            setProjectName('')
            setProjectDescription('')
            console.log('New project added successfully', json)
            closeModal()
            dispatch({ type: 'CREATE_PROJECT', payload: json })
        }
    }

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
                    <h3 className="text-4xl font-bold w-full text-white">
                        Create a Project
                    </h3>
                    <button onClick={closeModal} className="text-white hover:text-gray-600">
                        ✕
                    </button>
                </div>
                <div className="p-4 bg-white rounded-xl">
                    <form action="#" method="POST" onSubmit={handleSubmit}>
                        <div className="mb-3 font-bold">
                            <label htmlFor="projectName">Project Name*</label>
                            <br />
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                            />
                        </div>

                        <div className="mb-3 font-bold">
                            <label htmlFor="projectDescription">Description</label>
                            <br />
                            <textarea
                                id="projectDescription"
                                name="projectDescription"
                                onChange={(e) => setProjectDescription(e.target.value)}
                                value={projectDescription}
                                className="border-none bg-[#50E3C2] w-full rounded-lg font-normal"
                            >
                            </textarea>
                        </div>

                        <div className="my-5">
                            <button
                                type="submit"
                                className="flex w-1/3 justify-center mx-auto rounded-md bg-[#4A90E2] px-4 py-3.5 text-xl font-semibold text-white shadow-md hover:bg-[#4A90E2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C71B1]"
                            >
                                Create Project
                            </button>
                            {error && <div className='error'> {error} </div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProjectModal