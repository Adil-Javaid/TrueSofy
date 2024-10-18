// AdminDashboard.tsx
import React from "react";
import "./AdminDashboard.css";
import { useAdminDashboard } from "../Functionality/useAdminDashboard";
import AdminViewHours from "./AdminView";

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

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="workspace-form">
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="Workspace Name"
        />
        <select
          value={selectedTeamLead}
          onChange={(e) => setSelectedTeamLead(e.target.value)}
        >
          <option value="">Select Team Lead</option>
          {teamLeads.map((lead) => (
            <option key={lead._id} value={lead._id}>
              {lead.username}
            </option>
          ))}
        </select>
        <button onClick={handleCreateWorkspace}>Create Workspace</button>
      </div>
      <h2>Existing Workspaces</h2>
      <ul>
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <li key={workspace._id}>
              <h1>{workspace.name}</h1>
              <p>
                Lead:{" "}
                {workspace.teamLead
                  ? workspace.teamLead.username
                  : "No Team Lead"}
              </p>
            </li>
          ))
        ) : (
          <li>No workspaces available.</li>
        )}
      </ul>
      <AdminViewHours />
    </div>
  );
};

export default AdminDashboard;
