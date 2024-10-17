import React, { useState, useEffect } from "react";
import axios from "axios";
import "./teammemberdashboard.css";
import TeamMemberTime from "./TeamMemberTime";

interface Task {
  _id: string;
  description: string;
  status: string;
  deadline: string;
  workspace: { name: string };
}

const TeamMemberDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:8000/workspaces/team-member/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      await axios.put(
        `http://localhost:8000/workspaces/tasks/${taskId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="team-member-dashboard">
      <h1>Team Member Dashboard</h1>

      <h2>Your Tasks</h2>

      {/* Pending Tasks */}
      <h3>Pending Tasks</h3>
      <ul>
        {pendingTasks.map((task) => (
          <li key={task._id}>
            <p>Description: {task.description}</p>
            <p>Workspace: {task.workspace.name}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
            <select
              value={task.status}
              onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>

      
      <h3>In Progress Tasks</h3>
      <ul>
        {inProgressTasks.map((task) => (
          <li key={task._id}>
            <p>Description: {task.description}</p>
            <p>Workspace: {task.workspace.name}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
            <select
              value={task.status}
              onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>

      <h3>Completed Tasks</h3>
      <ul>
        {completedTasks.map((task) => (
          <li key={task._id}>
            <p>Description: {task.description}</p>
            <p>Workspace: {task.workspace.name}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
      <TeamMemberTime />
    </div>
  );
};

export default TeamMemberDashboard;
