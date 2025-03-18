
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => (
    <div className="flex h-screen">
        <div className="fixed h-full w-64 text-white">
            <Sidebar />
        </div>
        {/* Scrollable Main Content */}
        <main className="flex-1 ml-64 overflow-y-auto bg-gradient-to-r to-[#dfe2e6] from-[#e9f3ff]">
            <Outlet />
        </main>
    </div>
);

export default HomeLayout;
