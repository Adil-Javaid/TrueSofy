import React, { useState, useEffect } from "react";
import axios from "axios";
import "./taskmanagement.css";

interface TaskManagementProps {
  workspace: any;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ workspace }) => {
  const [members, setMembers] = useState([]);
  const [task, setTask] = useState("");
  const [assignedMember, setAssignedMember] = useState("");

  useEffect(() => {
    // Fetch team members
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:8000/workspaces/${workspace.id}/members`
      );
      setMembers(response.data);
    };
    fetchData();
  }, [workspace]);

  const handleAssignTask = async () => {
    if (task && assignedMember) {
      try {
        await axios.post("http://localhost:8000/assign-task", {
          task,
          memberId: assignedMember,
          workspaceId: workspace.id,
        });
        setTask("");
        setAssignedMember("");
        alert("Task assigned successfully");
      } catch (error) {
        console.error("Failed to assign task:", error);
      }
    }
  };

  return (
    <div className="task-management">
      <h2>Manage Tasks for {workspace.name}</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Task description"
      />
      <select
        value={assignedMember}
        onChange={(e) => setAssignedMember(e.target.value)}
      >
        <option value="">Assign to Team Member</option>
        {members.map((member: any) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <button onClick={handleAssignTask}>Assign Task</button>
    </div>
  );
};

export default TaskManagement;
