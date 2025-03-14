import { ProjectContext } from "../context/ProjectContext";
import { useContext } from "react";

export const useProjectsContext = () => {
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error("useProjectsContext must be used within a ProjectContextProvider");
    }

    return context;
};