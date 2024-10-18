// TeamLeadDashboard.tsx
import React from "react";
import "./teamleaddashboard.css";
import { useTeamLeadDashboard } from "../Functionality/useTeamDashboard";

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

  return (
    <div className="team-lead-dashboard">
      <h1>Team Lead Dashboard</h1>
      <h2>Your Workspaces</h2>
      <select
        value={selectedWorkspace}
        onChange={(e) => setSelectedWorkspace(e.target.value)}
      >
        <option value="">Select Workspace</option>
        {workspaces.map((workspace) => (
          <option key={workspace._id} value={workspace._id}>
            {workspace.name}
          </option>
        ))}
      </select>

      {selectedWorkspace && (
        <>
          <h3>Assign Task</h3>
          <input
            type="text"
            placeholder="Task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select Member</option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.username}
              </option>
            ))}
          </select>
          <button onClick={handleAssignTask}>Assign Task</button>
        </>
      )}
    </div>
  );
};

export default TeamLeadDashboard;
