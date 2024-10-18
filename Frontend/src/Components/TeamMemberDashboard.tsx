// TeamMemberDashboard.tsx
import React from "react";
import "./teammemberdashboard.css";
import { useTeamMemberDashboard } from "../Functionality/useTeamMemberDashboard";
import TeamMemberTime from "./TeamMemberTime";

const TeamMemberDashboard: React.FC = () => {
  const { pendingTasks, inProgressTasks, completedTasks, handleUpdateStatus } =
    useTeamMemberDashboard();

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
