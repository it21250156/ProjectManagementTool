import React from 'react'
import GlobalLeaderboard from '../components/GlobalLeaderboard'
import Header from '../components/Header'

const Leaderboard = () => {
    return (
        <div className=''>
            <Header />
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>Global Leaderboard</h1>
                </div>
                <div className='mx-auto w-2/3'>
                    {/* Placeholder for leaderboard */}
                    <GlobalLeaderboard /> {/* ✅ Importing and using the GlobalLeaderboard component */}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard