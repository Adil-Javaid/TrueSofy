import React, { useState } from "react";
import { useAdminDashboard } from "../Functionality/useAdminDashboard";
import AdminViewHours from "./AdminView";
import {
  Users,
  LayoutGrid,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const {
    workspaces,
    teamLeads,
    workspaceName,
    selectedTeamLead,
    setWorkspaceName,
    setSelectedTeamLead,
    handleCreateWorkspace,
  } = useAdminDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 fixed h-full`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {sidebarOpen ? (
            <div className="text-xl font-bold">WorkspaceHub</div>
          ) : (
            <div className="text-xl font-bold mx-auto">WH</div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-6">
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-gray-300 hover:bg-gray-800 hover:text-white rounded-md mx-2 cursor-pointer bg-gray-800 text-white`}
          >
            <LayoutGrid size={20} />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-gray-300 hover:bg-gray-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Team Members</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-gray-300 hover:bg-gray-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <ClipboardList size={20} />
            {sidebarOpen && <span className="ml-3">Projects</span>}
          </div>
          <div
            className={`px-4 py-3 flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-gray-300 hover:bg-gray-800 hover:text-white rounded-md mx-2 mt-2 cursor-pointer`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <div
            className={`flex items-center ${
              sidebarOpen ? "" : "justify-center"
            } text-gray-300 hover:text-white cursor-pointer`}
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
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  AD
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Admin User</span>
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
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <LayoutGrid size={24} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Total Workspaces
                  </div>
                  <div className="text-2xl font-semibold">
                    {workspaces.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Team Leads
                  </div>
                  <div className="text-2xl font-semibold">
                    {teamLeads.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <ClipboardList size={24} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Active Projects
                  </div>
                  <div className="text-2xl font-semibold">12</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Team Members
                  </div>
                  <div className="text-2xl font-semibold">42</div>
                </div>
              </div>
            </div>
          </div>

          {/* Workspace Creation Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Create New Workspace
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Workspace Name"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedTeamLead}
                onChange={(e) => setSelectedTeamLead(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-1/3"
              >
                <option value="">Select Team Lead</option>
                {teamLeads.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                    {lead.username}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreateWorkspace}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Create Workspace
              </button>
            </div>
          </div>

          {/* Existing Workspaces */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Existing Workspaces
            </h2>

            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {workspace.name}
                      </h3>
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        Active
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Team Lead:{" "}
                      <span className="font-medium">
                        {workspace.teamLead
                          ? workspace.teamLead.username
                          : "No Team Lead"}
                      </span>
                    </p>
                    <div className="flex justify-between mt-4">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        View Details
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-3">
                  <LayoutGrid size={40} className="mx-auto text-gray-400" />
                </div>
                <p className="text-lg">No workspaces available.</p>
                <p className="mt-2 text-sm">
                  Create your first workspace using the form above.
                </p>
              </div>
            )}
          </div>

          {/* Admin View Hours Component */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Team Hours Overview
            </h2>
            <AdminViewHours />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
