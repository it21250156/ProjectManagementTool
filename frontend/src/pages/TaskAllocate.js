import React from 'react'
import TaskAllocation from '../components/TaskAllocation'

const TaskAllocate = () => {
    return (
        <div>
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>Tasks Allocation</h1>
                </div>
                <div className='mx-auto'>
                    <TaskAllocation />
                </div>

            </div>
        </div>
    )
}

export default TaskAllocate