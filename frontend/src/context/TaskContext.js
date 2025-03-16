import { createContext, useReducer } from "react";

export const TaskContext = createContext();

export const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { tasks: action.payload };
        case 'CREATE_TASKS':
            return { tasks: [action.payload, ...state.tasks] };
        case 'DELETE_TASK':
            const updatedTasks = state.tasks.filter((t) => t._id !== action.payload._id);
            return { tasks: updatedTasks };
        case 'UPDATE_TASK':
            return {
                tasks: state.tasks.map((task) =>
                    task._id === action.payload._id ? { ...task, status: action.payload.status } : task
                ),
            };
        default:
            return state;
    }
}

export const TaskContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: []
    })

    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}