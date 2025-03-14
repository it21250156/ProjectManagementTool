import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ProjectItem = ({ project }) => {
    return (
        <div className='mb-2 bg-[#eef5ff] text-black grid grid-cols-12'>
            <div className='col-span-2 border-r border-r-slate-300'>
                <h2 className='m-3 font-bold'>{project.projectName}</h2>
            </div>
            <div className='col-span-8 border-r border-r-slate-300'>
                <p className='m-3'>{project.projectDescription}</p>
            </div>
            <div className='col-span-2 m-auto flex gap-4'>
                <div className=''>
                    <Link to={`/project/${project._id}`} className='mx-2'><FaTasks /></Link>
                </div>
                <div>
                    <Link className='mx-2'><HiDotsVertical /></Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectItem;