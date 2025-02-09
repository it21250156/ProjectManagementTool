import { useEffect } from 'react'
import AddTasksForm from '../components/AddTasksForm';
import { useTasksContext } from '../hooks/useTasksContext';
import TaskCard from '../components/TaskCard';

const Home = () => {

    const {tasks, dispatch} = useTasksContext()

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks');
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_TASKS', payload: json})
            }
        }
        fetchTasks();
    }, [dispatch]);
  return (
    <div>
        <div className='grid grid-cols-2'>
            
            <div className=''>
                {tasks && tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                ))}
            </div>
            <div className=''>
                <AddTasksForm />
            </div>
        </div>
    </div>
  )
}

export default Home