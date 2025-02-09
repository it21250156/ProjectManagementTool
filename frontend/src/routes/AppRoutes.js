import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layouts
import HomeLayout from "../layouts/HomeLayout";
import LoginLayout from "../layouts/LoginLayout";

// pages
import Home from "../pages/Home";
import Signup from "../pages/Signup";
// import Register from '../pages/Register';

// import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Routes using the shared layout */}
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Signup />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Route>

      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Fallback route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  </Router>
);

export default AppRoutes;
