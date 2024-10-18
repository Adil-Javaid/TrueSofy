import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  fetchDailyWorkHours,
  startTimer,
  stopTimer,
} from "../Functionality/useTimer";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./teammemberdashboard.css";

interface Task {
  _id: string;
  description: string;
  status: string;
  deadline: string;
  workspace: { name: string };
}

interface DailyWorkHours {
  totalHours: number;
  totalMinutes: number;
}

const TeamMemberTime: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyWorkHours, setDailyWorkHours] = useState<DailyWorkHours>({
    totalHours: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    fetchTasks(setTasks);
    fetchDailyWorkHours(setDailyWorkHours);
  }, []);

 
  const workHoursData = {
    labels: ["Total Hours"],
    datasets: [
      {
        label: "Hours",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: [dailyWorkHours.totalHours],
      },
      {
        label: "Minutes",
        backgroundColor: "rgba(153,102,255,0.4)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
        data: [dailyWorkHours.totalMinutes / 60], 
      },
    ],
  };

  
  const taskStatusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { pending: 0, "in progress": 0, completed: 0 }
  );

  const taskProgressData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Progress",
        backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
        data: [
          taskStatusCounts.pending,
          taskStatusCounts["in progress"],
          taskStatusCounts.completed,
        ],
      },
    ],
  };

  return (
    <div className="team-member-dashboard">
      <h2>Team Member Dashboard</h2>

      <h3>Your Tasks</h3>
      {tasks.length > 0 ? (
        tasks.map((task: Task) => (
          <div key={task._id}>
            <p>{task.description}</p>
            <button onClick={() => startTimer(task._id)}>Start Timer</button>
            <button
              onClick={() =>
                stopTimer(task._id, () =>
                  fetchDailyWorkHours(setDailyWorkHours)
                )
              }
            >
              Stop Timer
            </button>
          </div>
        ))
      ) : (
        <p>No tasks assigned</p>
      )}

      <h3>Daily Work Hours</h3>
      <div className="chart-container">
        <Bar data={workHoursData} />
      </div>

      <h3>Task Progress</h3>
      <div className="chart-container">
        <Pie data={taskProgressData} />
      </div>
    </div>
  );
};

export default TeamMemberTime;
