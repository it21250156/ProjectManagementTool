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