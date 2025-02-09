import React, { useState } from 'react'
import { useTasksContext } from '../hooks/useTasksContext';


const AddTasksForm = () => {

    const {dispatch} = useTasksContext()
    const [taskName, setTaskName] = useState('')
    const [days, setDays] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const task = {taskName, days, assignedTo}

        const response = await fetch('/api/tasks/add', {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.errors)
        }
        if (response.ok) {
            setTaskName('')
            setDays('')
            setAssignedTo('')
            setError(null)
            console.log('New task added successfully', json)
            dispatch({type: 'CREATE_TASKS', payload: json})
        }
    }
  return (
    <div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Add a new task
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="taskName" className="block text-sm/6 font-medium text-gray-900">
                        Task Name
                        </label>
                    <div className="mt-2">
                        <input
                        id="taskName"
                        name="taskName"
                        type="text"
                        onChange={(e) => setTaskName(e.target.value)}
                        value={taskName}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="days" className="block text-sm/6 font-medium text-gray-900">
                        Days
                    </label>
                    <div className="mt-2">
                        <input
                        id="days"
                        name="days"
                        type="number"
                        onChange={(e) => setDays(e.target.value)}
                        value={days}
                        required
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="assignedTo" className="block text-sm/6 font-medium text-gray-900">
                        Assigned To
                    </label>
                    <div className="mt-2">
                        <input
                        id="assignedTo"
                        name="assignedTo"
                        type="text"
                        onChange={(e) => setAssignedTo(e.target.value)}
                        value={assignedTo}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    </div>

                    <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add
                    </button>
                    {error && <div className='error'> {error} </div>}
                    </div>
                </form>
            </div>
        </div>    
    </div>
  )
}

export default AddTasksForm