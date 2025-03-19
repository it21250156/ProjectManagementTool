import React from 'react'
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'

const DeadlinePrediction = () => {
    return (
        <div>
            {/* <Header /> */}
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>Project Deadline Prediction</h1>
                </div>
                <div className='mx-auto'>
                    <Dashboard />
                </div>

            </div>
        </div>
    )
}

export default DeadlinePrediction