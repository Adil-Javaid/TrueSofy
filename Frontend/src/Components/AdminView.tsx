import React, { useState, useEffect } from "react";
import axios from "axios";
import "./teamleaddashboard.css";

interface TeamMember {
  _id: string;
  username: string;
}

interface Timer {
  task: {
    description: string; 
  };
  workspace: {
    name: string;
  };
  duration: number;
}

interface WorkHours {
  totalHours: number;
  totalMinutes: number;
  name: string;
  timers: Timer[]; 
}

const AdminViewHours: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [workHours, setWorkHours] = useState<WorkHours | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.get(
        "http://localhost:8000/workspaces/all-members",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchMemberWorkHours = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.get(
        `http://localhost:8000/timer/member/${selectedMember}/daily-work-hours?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkHours(response.data);
    } catch (error) {
      console.error("Error fetching work hours:", error);
    }
  };

  return (
    <div className="team-lead-dashboard">
      <h2>View Team Member Work Hours</h2>

      <label>
        Select Team Member:
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">Select a member</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.username}
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Date:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      <button onClick={fetchMemberWorkHours}>View Work Hours</button>

      {workHours && (
        <div className="work-hours">
          <p>Total Hours: {workHours.totalHours}</p>
          <p>Total Minutes: {workHours.totalMinutes}</p>

          <h4>Timers</h4>
          <ul>
            {workHours.timers.map((timer, index) => (
              <li key={index}>
                Task: {timer.task?.description || "No description"} | Workspace:{" "}
                {timer.workspace?.name || "No workspace name"} | Duration:{" "}
                {Math.floor(timer.duration / 3600)}h{" "}
                {Math.floor((timer.duration % 3600) / 60)}m
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminViewHours;
