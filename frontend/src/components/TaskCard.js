import React from 'react';
import { useTasksContext } from '../hooks/useTasksContext';

const TaskCard = ({ task }) => {

    const { dispatch } = useTasksContext()

    const handleClick = async () => {
        const response = await fetch('/api/tasks/delete/' + task._id, {
            method: 'DELETE'
        })
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_TASK', payload: json });
            console.log('Task deleted:', task._id);
        } else {
            console.error('Error deleting task:', json.error);
        }
  
    }

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h2 className="font-bold text-lg">{task.taskName}</h2>
      <p><strong>Days:</strong> {task.days}</p>
      <p><strong>Assigned To:</strong> {task.assignedTo}</p>
      <button type='button' onClick={handleClick} className='mt-5 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Delete</button>
    </div>
  );
};

export default TaskCard;
