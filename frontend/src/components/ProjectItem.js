import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import { Link } from 'react-router-dom';
import { Tooltip } from 'flowbite-react';

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

                <div>
                    <Tooltip content="View Tasks" placement="bottom">
                        <Link to={`/project/${project._id}`} className='mx-4'><FaTasks /></Link>
                    </Tooltip>
                </div>

                <div>
                    <Tooltip content="Leaderboard" placement="bottom">
                        <Link className='mx-4'><MdOutlineLeaderboard /></Link>
                    </Tooltip>
                </div>

                <div>
                    <Link className="mx-4"> <HiDotsVertical /></Link>
                </div>

            </div>
        </div>
    );
};

export default ProjectItem;