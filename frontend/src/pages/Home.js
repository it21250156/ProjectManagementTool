import { useEffect } from 'react'
import { useTasksContext } from '../hooks/useTasksContext';
import Header from '../components/Header';

const Home = () => {

    const { dispatch } = useTasksContext()

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
            <div >
                <h1>Home Page</h1>
            </div>

        </div>
    )
}

export default Home