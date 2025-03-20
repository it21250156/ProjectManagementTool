import React, { useEffect, useState } from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext';
import ProjectItem from '../components/ProjectItem';

const MyProjects = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    return (
        <div>
            {/* <Header /> */}
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>My Projects</h1>
                </div>

                <div className='mx-0 my-2 p-4 rounded-2xl border border-[#f5a623]'>
                    <div className='mb-2 grid grid-cols-12 font-bold text-lg'>
                        <div className='col-span-2 border-r border-r-slate-300 text-center'>
                            <h2 className='m-3'>Project Name</h2>
                        </div>
                        <div className='col-span-8 border-r border-r-slate-300 text-center'>
                            <p className='m-3'>Project Description</p>

                        </div>
                        <div className='col-span-8 m-auto'>

                        </div>
                    </div>
                    {loading ? (
                        // Loading Animation
                        <div className="flex flex-row gap-2 justify-center mt-8">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
                            <div
                                className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"
                            ></div>
                            <div
                                className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"
                            ></div>
                        </div>
                    ) : (
                        // Projects List
                        projects &&
                        projects
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((project) => (
                                <ProjectItem key={project._id} project={project} />
                            ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProjects