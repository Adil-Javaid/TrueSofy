import React, { useState } from "react";
import { useTeamLeadDashboard } from "../Functionality/useTeamDashboard";
import {
  Users,
  LayoutGrid,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  Plus,
  Check,
  BarChart2,
} from "lucide-react";

const TeamLeadDashboard: React.FC = () => {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    teamMembers,
    taskDescription,
    setTaskDescription,
    selectedMember,
    setSelectedMember,
    handleAssignTask,
  } = useTeamLeadDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  // Find the selected workspace name for display
  const selectedWorkspaceName =
    workspaces.find((w) => w._id === selectedWorkspace)?.name ||
    "Select Workspace";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-900 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 fixed h-full z-20`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-800">
          {sidebarOpen ? (
            <div className="text-xl font-bold">TeamSpace</div>
          ) : (
            <div className="text-xl font-bold mx-auto">TS</div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-indigo-800"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Profile Summary */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b border-indigo-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-semibold">
                TL
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Team Lead</div>
                <div className="text-xs text-indigo-300">Lead@example.com</div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="mt-4">
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-white bg-indigo-800 rounded-md mx-2 cursor-pointer`}
          >
            <LayoutGrid size={20} />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Team Members</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <ClipboardList size={20} />
            {sidebarOpen && <span className="ml-3">Task Management</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <BarChart2 size={20} />
            {sidebarOpen && <span className="ml-3">Analytics</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-indigo-300 hover:bg-indigo-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-indigo-800 p-4">
          <div
            className={`flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-indigo-300 hover:text-white cursor-pointer`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Top Bar */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Team Lead Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-gray-50 flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          New team member joined
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 flex items-start">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Check size={16} className="text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          Task completed: Database setup
                        </p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <a
                      href="#"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  TL
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Team Lead</span>
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Workspace Selection Card */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Workspace Selection
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Active Workspace:
                </label>
                <div className="relative flex-grow">
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Workspace</option>
                    {workspaces.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Assignment Card */}
          {selectedWorkspace ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-indigo-800">
                  Assign Task for {selectedWorkspaceName}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="taskDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Description
                    </label>
                    <textarea
                      id="taskDescription"
                      rows={3}
                      placeholder="Enter detailed task description..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teamMember"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Assign To
                    </label>
                    <div className="relative">
                      <select
                        id="teamMember"
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Team Member</option>
                        {teamMembers.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.username}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleAssignTask}
                      disabled={!taskDescription || !selectedMember}
                      className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Assign Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <LayoutGrid className="text-indigo-600" size={28} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No Workspace Selected
                </h3>
                <p className="text-gray-500 mb-4">
                  Select a workspace to manage tasks and team members
                </p>
                <div className="relative w-64 mx-auto">
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Workspace</option>
                    {workspaces.map((workspace) => (
                      <option key={workspace._id} value={workspace._id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Team Members
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Check size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Completed Tasks
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <ClipboardList size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Pending Tasks
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check size={16} className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        Task Completed: Frontend Redesign
                      </p>
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      John Doe - Today, 2:34 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Plus size={16} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        New Task Created: API Integration
                      </p>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      You - Today, 10:15 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Users size={16} className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      New Team Member Added: Jane Smith
                    </p>
                    <p className="text-sm text-gray-500">Yesterday, 4:23 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
