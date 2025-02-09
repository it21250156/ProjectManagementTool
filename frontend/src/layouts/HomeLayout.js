// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

import { Outlet } from "react-router-dom";

const HomeLayout = () => (
    <div>
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    </div>
);

export default HomeLayout;
