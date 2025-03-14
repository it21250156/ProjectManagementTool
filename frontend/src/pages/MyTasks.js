import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useTasksContext } from '../hooks/useTasksContext';

import TaskCard from '../components/TaskCard';

const MyTasks = () => {
    const { tasks, dispatch } = useTasksContext()

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks');
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_TASKS', payload: json })
            }
        }
        fetchTasks();
    }, [dispatch]);
    return (
        <div>
            <Header />
            <div className='m-4'>
                <div className='mx-0 my-2 p-8 rounded-2xl bg-[#f5a623]'>
                    <h1 className='text-white text-4xl font-extrabold italic'>My Tasks</h1>
                </div>

                <div className='mx-0 my-2 p-4 rounded-2xl border border-[#f5a623]'>
                    {tasks && tasks
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                        .map((task) => (
                            <TaskCard key={task._id} task={task} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default MyTasks