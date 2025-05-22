import '../assets/css/home.css'
import { useState } from 'react'

const Home = () => {
    // Static data for dashboard cards
    const projectStats = [
        { title: "Active Projects", count: 14, icon: "📊", color: "from-blue-400 to-blue-600" },
        { title: "Tasks Due Today", count: 8, icon: "⏰", color: "from-purple-400 to-purple-600" },
        { title: "Team Members", count: 23, icon: "👥", color: "from-green-400 to-green-600" },
        { title: "Overdue Tasks", count: 3, icon: "⚠️", color: "from-red-400 to-red-600" },
    ]

    const recentProjects = [
        { name: "Website Redesign", progress: 75, deadline: "Apr 5, 2025", status: "On Track" },
        { name: "Mobile App Development", progress: 45, deadline: "May 12, 2025", status: "At Risk" },
        { name: "Marketing Campaign", progress: 90, deadline: "Mar 28, 2025", status: "On Track" },
    ]

    const upcomingDeadlines = [
        { task: "Submit UI Designs", project: "Website Redesign", due: "Mar 24, 2025" },
        { task: "Complete Backend Integration", project: "Mobile App", due: "Mar 25, 2025" },
        { task: "Finalize Content Strategy", project: "Marketing Campaign", due: "Mar 26, 2025" },
        { task: "Team Review Meeting", project: "Website Redesign", due: "Mar 27, 2025" },
    ]

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* <Header /> */}
            <div className="m-10">
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {projectStats.map((stat, index) => (
                        <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-lg shadow-md p-6 text-white`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.count}</p>
                                </div>
                                <div className="text-4xl">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
                    <div className="space-y-4">
                        {recentProjects.map((project, index) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">{project.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === "On Track" ? "bg-green-100 text-green-800" :
                                        project.status === "At Risk" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span>Progress: {project.progress}%</span>
                                    <span>Deadline: {project.deadline}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${project.status === "On Track" ? "bg-green-500" :
                                            project.status === "At Risk" ? "bg-yellow-500" :
                                                "bg-red-500"
                                            }`}
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-white">Upcoming Deadlines</h2>
                    <div className="bg-white rounded-lg overflow-hidden">
                        {upcomingDeadlines.map((item, index) => (
                            <div key={index} className={`flex justify-between items-center p-4 ${index < upcomingDeadlines.length - 1 ? "border-b" : ""
                                }`}>
                                <div>
                                    <p className="font-medium">{item.task}</p>
                                    <p className="text-sm text-gray-500">{item.project}</p>
                                </div>
                                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {item.due}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home