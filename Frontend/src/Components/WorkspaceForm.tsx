// src/components/WorkspaceForm.tsx
import React, { useState } from "react";
import axios from "axios";

interface WorkspaceFormProps {
  teamLeads: { id: string; name: string }[];
  setWorkspaces: React.Dispatch<React.SetStateAction<any[]>>;
}

const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  teamLeads,
  setWorkspaces,
}) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedTeamLead, setSelectedTeamLead] = useState("");

  const handleCreateWorkspace = async () => {
    if (workspaceName && selectedTeamLead) {
      try {
        const response = await axios.post(
          "http://localhost:8000/workspaces/create",
          { name: workspaceName, teamLeadId: selectedTeamLead },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWorkspaces((prev) => [...prev, response.data.workspace]);
        setWorkspaceName("");
        setSelectedTeamLead("");
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    }
  };

  return (
    <div>
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
          <option key={lead.id} value={lead.id}>
            {lead.name}
          </option>
        ))}
      </select>
      <button onClick={handleCreateWorkspace}>Create Workspace</button>
    </div>
  );
};

export default WorkspaceForm;
