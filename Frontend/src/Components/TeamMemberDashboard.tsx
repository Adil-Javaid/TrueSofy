import React, { useState } from "react";
import { useTeamMemberDashboard } from "../Functionality/useTeamMemberDashboard";
import TeamMemberTime from "./TeamMemberTime";
import {
  CheckCircle,
  AlertCircle,
  Activity,
  Menu,
  Bell,
  Search,
  Home,
  Briefcase,
  Calendar,
  BarChart2,
  Settings,
  HelpCircle,
} from "lucide-react";

const TeamMemberDashboard: React.FC = () => {
  const { pendingTasks, inProgressTasks, completedTasks, handleUpdateStatus } =
    useTeamMemberDashboard();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Combined tasks for search and filtering
  const allTasks = [...pendingTasks, ...inProgressTasks, ...completedTasks];

  // Filter tasks based on search query
  const filteredTasks = allTasks.filter(
    (task) =>
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get appropriate status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={16} className="text-amber-800" />;
      case "in progress":
        return <Activity size={16} className="text-blue-800" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-800" />;
      default:
        return null;
    }
  };

  // Calculate deadline status
  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "text-red-600 font-medium";
    } else if (diffDays <= 2) {
      return "text-amber-600 font-medium";
    } else {
      return "text-gray-700";
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Task card component
  const TaskCard = ({ task }: { task: any }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 flex-1">{task.description}</h4>
        <div
          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(
            task.status
          )}`}
        >
          {getStatusIcon(task.status)}
          <span className="capitalize">{task.status}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Briefcase size={16} />
        <span>{task.workspace.name}</span>
      </div>

      <div className="flex items-center gap-2 text-sm mb-3">
        <Calendar size={16} className="text-gray-600" />
        <span className={getDeadlineStatus(task.deadline)}>
          {formatDate(task.deadline)}
        </span>
      </div>

      {task.status !== "completed" && (
        <div className="flex justify-end mt-2">
          <select
            value={task.status}
            onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
            className="text-sm border border-gray-300 rounded-md p-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-slate-800 text-white ${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 h-screen fixed`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <h2
            className={`font-bold text-xl ${
              sidebarCollapsed ? "hidden" : "block"
            }`}
          >
            TaskFlow
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-slate-700"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="py-4">
          <ul>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2 bg-slate-700"
              >
                <Home size={20} />
                <span
                  className={`ml-3 ${sidebarCollapsed ? "hidden" : "block"}`}
                >
                  Dashboard
                </span>
              </a>
            </li>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2"
              >
                <Briefcase size={20} />
                <span
                  className={`ml-3 ${sidebarCollapsed ? "hidden" : "block"}`}
                >
                  Workspaces
                </span>
              </a>
            </li>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2"
              >
                <Calendar size={20} />
                <span
                  className={`ml-3 ${sidebarCollapsed ? "hidden" : "block"}`}
                >
                  Schedule
                </span>
              </a>
            </li>
            <li className="mb-1">
              <a
                href="#"
                className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2"
              >
                <BarChart2 size={20} />
                <span
                  className={`ml-3 ${sidebarCollapsed ? "hidden" : "block"}`}
                >
                  Reports
                </span>
              </a>
            </li>
          </ul>

          <div
            className={`border-t border-slate-700 mt-4 pt-4 ${
              sidebarCollapsed ? "hidden" : "block"
            }`}
          >
            <ul>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2"
                >
                  <Settings size={20} />
                  <span className="ml-3">Settings</span>
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center py-2 px-4 hover:bg-slate-700 rounded-md mx-2"
                >
                  <HelpCircle size={20} />
                  <span className="ml-3">Help & Support</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-xl">Team Member Dashboard</h1>
          </div>

          <div className="flex items-center">
            <div className="relative mr-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <Search
                size={18}
                className="text-gray-500 absolute left-3 top-2.5"
              />
            </div>

            <button className="p-2 relative mr-4">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                TM
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-full mr-4">
                  <AlertCircle size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending Tasks</p>
                  <h3 className="text-2xl font-bold">{pendingTasks.length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">In Progress</p>
                  <h3 className="text-2xl font-bold">
                    {inProgressTasks.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <h3 className="text-2xl font-bold">
                    {completedTasks.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <TeamMemberTime />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeTab === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeTab === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("inProgress")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeTab === "inProgress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    activeTab === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchQuery.length > 0 ? (
                filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    No tasks found matching "{searchQuery}"
                  </div>
                )
              ) : activeTab === "all" ? (
                allTasks.map((task) => <TaskCard key={task._id} task={task} />)
              ) : activeTab === "pending" ? (
                pendingTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              ) : activeTab === "inProgress" ? (
                inProgressTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              ) : (
                completedTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard;
