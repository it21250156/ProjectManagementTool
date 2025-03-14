import { createContext, useReducer } from "react";

export const ProjectContext = createContext();

export const projectsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROJECTS':
            return { projects: action.payload };
        case 'CREATE_PROJECT':
            return { projects: [action.payload, ...state.projects] };
        case 'DELETE_PROJECT':
            const updatedProjects = state.projects.filter((p) => p._id !== action.payload._id);
            return { projects: updatedProjects };
        case 'UPDATE_PROJECT':
            const updatedProjectsList = state.projects.map((p) =>
                p._id === action.payload._id ? action.payload : p
            );
            return { projects: updatedProjectsList };
        default:
            return state;
    }
};

export const ProjectContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(projectsReducer, {
        projects: []
    });

    return (
        <ProjectContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProjectContext.Provider>
    );
};