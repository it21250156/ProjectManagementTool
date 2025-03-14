import { useEffect } from 'react'
import AddTasksForm from '../components/AddTasksForm';
import { useTasksContext } from '../hooks/useTasksContext';
import TaskCard from '../components/TaskCard';
import Header from '../components/Header';

const Home = () => {

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
            {/* <div>
            <AddTasksForm />
        </div> */}
            <div >
                <h1>Home Page</h1>
            </div>

        </div>
    )
}

export default Home