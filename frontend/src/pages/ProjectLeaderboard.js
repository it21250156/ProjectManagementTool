import React from 'react';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';

const ProjectLeaderboard = () => {
    return (
        <div>
            {/* <Header /> */}
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>Project Leaderboard</h1>
                </div>
                <div>
                    <Leaderboard /> {/* ✅ Importing and using the Leaderboard component */}
                </div>
            </div>
        </div>
    );
};

export default ProjectLeaderboard;
