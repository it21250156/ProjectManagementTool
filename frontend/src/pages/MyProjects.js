import React, { useEffect } from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext';
import Header from '../components/Header';
import ProjectItem from '../components/ProjectItem';

const MyProjects = () => {

    const { projects, dispatch } = useProjectsContext()

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/projects');
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_PROJECTS', payload: json })
            }
        }
        fetchProjects();
    }, [dispatch]);

    return (
        <div>
            <Header />
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]'>
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
                    {projects && projects
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                        .map((project) => (
                            <ProjectItem key={project._id} project={project} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default MyProjects