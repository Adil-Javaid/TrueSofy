import React, { useState, useEffect } from "react";
import axios from "axios";
import "./teamleaddashboard.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

  // Prepare data for the bar chart
  const chartData = {
    labels: workHours?.timers.map(
      (timer) => timer.task?.description || "Unknown Task"
    ),
    datasets: [
      {
        label: "Task Duration (Minutes)",
        data: workHours?.timers.map((timer) => Math.floor(timer.duration / 60)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Duration (Minutes)",
        },
      },
    },
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

          <h4>Task Duration (Bar Chart)</h4>
          <div style={{ maxWidth: "600px" }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewHours;
