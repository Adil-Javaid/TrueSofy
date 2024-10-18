import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  fetchDailyWorkHours,
  startTimer,
  stopTimer,
} from "../Functionality/useTimer";
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
      <p>Total Hours: {dailyWorkHours.totalHours}</p>
      <p>Total Minutes: {dailyWorkHours.totalMinutes}</p>
    </div>
  );
};

export default TeamMemberTime;
