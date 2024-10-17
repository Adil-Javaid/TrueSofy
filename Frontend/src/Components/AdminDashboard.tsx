import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

interface TeamLead {
  _id: string;
  username: string;
}

interface Workspace {
  _id: string;
  name: string;
  teamLead?: TeamLead;
}

const AdminDashboard: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [selectedTeamLead, setSelectedTeamLead] = useState<string>("");

  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const getToken = (): string | null => {
    return authData?.token || localStorage.getItem("token");
  };
useEffect(() => {
  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      console.error("No token found in AuthContext or localStorage.");
      navigate("/login");
      return;
    }

    try {
      const [workspaceResponse, teamLeadResponse] = await Promise.all([
        axios.get("http://localhost:8000/workspaces", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/workspaces/team-leads", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }),
      ]);

      setWorkspaces(workspaceResponse.data);
      setTeamLeads(teamLeadResponse.data); // Properly fetch team leads for admin
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  fetchData();
}, [authData, navigate]);


  const handleCreateWorkspace = async () => {
    const token = getToken();
    if (!token) {
      console.error("No token found for creating a workspace.");
      return;
    }

    if (workspaceName && selectedTeamLead) {
      try {
        
        await axios.post(
          "http://localhost:8000/workspaces/create",
          {
            name: workspaceName,
            teamLeadId: selectedTeamLead,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
        const workspaceResponse = await axios.get(
          "http://localhost:8000/workspaces",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
        setWorkspaces(workspaceResponse.data);
        setWorkspaceName("");
        setSelectedTeamLead("");
      } catch (error) {
        console.error("Failed to create workspace:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  };

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
    </div>
  );
};

export default AdminDashboard;
