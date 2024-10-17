import React, { useState, useEffect } from "react";
import axios from "axios";
import "./teamleaddashboard.css";

interface Task {
  description: string;
  assignedTo: string;
  status: string;
}

interface Workspace {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
}

const TeamLeadDashboard: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const workspaceResponse = await axios.get(
          "http://localhost:8000/workspaces/team-lead/workspaces",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkspaces(workspaceResponse.data);

        const membersResponse = await axios.get(
          "http://localhost:8000/workspaces/all-members",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleAssignTask = async () => {
    if (selectedWorkspace && selectedMember && taskDescription) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        await axios.post(
          `http://localhost:8000/workspaces/${selectedWorkspace}/assign-task`,
          {
            description: taskDescription,
            assignedTo: selectedMember,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTaskDescription(""); 
        setSelectedMember(""); 
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    }
  };

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
