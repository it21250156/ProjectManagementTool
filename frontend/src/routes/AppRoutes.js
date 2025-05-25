import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layouts
import HomeLayout from "../layouts/HomeLayout";
import LoginLayout from "../layouts/LoginLayout";

// pages
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import MyProjects from "../pages/MyProjects";
import ProjectDetails from "../pages/ProjectDetails";
import MyTasks from '../pages/MyTasks';
import MyProfile from "../pages/MyProfile";
import PredictDelayForANewTask from "../pages/PredictDelayForANewTask";
import ProjectLeaderboard from "../pages/ProjectLeaderboard";
import SkillTree from "../pages/SkillTreePage";
import Dashboard from '../components/Dashboard';
import TaskAllocation from '../components/TaskAllocation';
import ModelPerformance from "../components/ModelPerformance";
import ProjectProgress from "../components/ProjectProgress";
import EffortPrediction from "../components/EffortPrediction";
import GlobalLeaderboard from "../components/GlobalLeaderboard";
import Leaderboard from "../pages/Leaderboard";
import DeadlinePrediction from "../pages/DeadlinePrediction";
import TaskAllocate from "../pages/TaskAllocate";
import UserPerformance from "../pages/UserPerformance";
// import Login from '../pages/Login';
// import ForgotPassword from '../pages/ForgotPassword';



// import Register from '../pages/Register';

// import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Routes using the shared layout */}
      <Route element={<LoginLayout />}>
        <Route path="/" element={<Signup />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Route>

      <Route element={<HomeLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/project/:projectId/leaderboard" element={<ProjectLeaderboard />} />
        <Route path="/skilltree" element={<SkillTree />} />
        <Route path="/predict-delay" element={<PredictDelayForANewTask />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task-allocation" element={<TaskAllocate />} />
        <Route path="/model-performance" element={<ModelPerformance />} />
        <Route path="/project-progress" element={<ProjectProgress />} />
        <Route path="/effort-prediction" element={<EffortPrediction />} />
        <Route path="/global-leaderboard" element={<Leaderboard />} />
        <Route path="/deadline-prediction" element={<DeadlinePrediction />} />
        <Route path="/performance-evaluation" element={<UserPerformance />} />
      </Route>

      {/* Fallback route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  </Router>
);



export default AppRoutes;
