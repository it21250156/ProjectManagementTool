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
      </Route>

      {/* Fallback route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  </Router>
);

export default AppRoutes;
