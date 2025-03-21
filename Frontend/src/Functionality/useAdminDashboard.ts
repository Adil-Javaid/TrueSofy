// useAdminDashboard.ts
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Workspace, TeamLead } from "../Interfaces/types";

export const useAdminDashboard = () => {
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
          axios.get("http://localhost:8000/workspaces/team-lead", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }),
        ]);

        setWorkspaces(workspaceResponse.data);
        setTeamLeads(teamLeadResponse.data);
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
      console.log("Creating workspace with:", { workspaceName, selectedTeamLead }); // Log the request data
      const response = await axios.post(
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

      console.log("Workspace created:", response.data); // Log the response

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
      console.error("Failed to create workspace:", error); // Log the error
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data); // Log the response data
      }
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    }
  }
};
  return {
    workspaces,
    teamLeads,
    workspaceName,
    selectedTeamLead,
    setWorkspaceName,
    setSelectedTeamLead,
    handleCreateWorkspace,
  };
};
