import React, { useState, useEffect } from "react";
import axios from "axios";
import "./teammemberdashboard.css";


interface Task {
  _id: string;
  description: string;
  status: string;
  deadline: string;
  workspace: { name: string };
}

const TeamMemberTime: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyWorkHours, setDailyWorkHours] = useState({
    totalHours: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    fetchTasks();
    fetchDailyWorkHours();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/workspaces/tasks");
      
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error("Expected an array for tasks, but got:", response.data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); 
    }
  };

  const fetchDailyWorkHours = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `/timer/my-daily-work-hours?date=${today}`
      );
      setDailyWorkHours(response.data);
    } catch (error) {
      console.error("Error fetching daily work hours:", error);
    }
  };

  const startTimer = async (taskId: string) => {
    try {
      await axios.post(`/timer/${taskId}/start-timer`);
      alert("Timer started for task");
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  const stopTimer = async (taskId: string) => {
    try {
      await axios.post(`/timer/${taskId}/stop-timer`);
      alert("Timer stopped for task");
      fetchDailyWorkHours();
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  };

  return (
    <div className="team-member-dashboard">
      <h2>Team Member Dashboard</h2>

      <h3>Your Tasks</h3>
      {tasks.length > 0 ? (
        tasks.map((task: any) => (
          <div key={task._id}>
            <p>{task.description}</p>
            <button onClick={() => startTimer(task._id)}>Start Timer</button>
            <button onClick={() => stopTimer(task._id)}>Stop Timer</button>
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
