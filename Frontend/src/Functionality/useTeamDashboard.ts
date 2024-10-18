// useTeamLeadDashboard.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Workspace, User } from "../Interfaces/types";

export const useTeamLeadDashboard = () => {
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
         "http://localhost:8000/workspaces/team-leads", 
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
            }
          }
        );
        setTaskDescription(""); 
        setSelectedMember(""); 
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    }
  };

  return {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    teamMembers,
    taskDescription,
    setTaskDescription,
    selectedMember,
    setSelectedMember,
    handleAssignTask,
  };
};
