import axios from "axios";

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

export const fetchTasks = async (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await axios.get("http://localhost:8000/workspaces/team-member/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTasks(response.data || []);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    setTasks([]);
  }
};

export const fetchDailyWorkHours = async (setDailyWorkHours: React.Dispatch<React.SetStateAction<DailyWorkHours>>) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await axios.get(
      `http://localhost:8000/timer/my-daily-work-hours?date=${today}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setDailyWorkHours(response.data);
  } catch (error) {
    console.error("Error fetching daily work hours:", error);
  }
};

export const startTimer = async (taskId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    await axios.post(
      `http://localhost:8000/timer/${taskId}/start-timer`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Timer started for task");
  } catch (error) {
    console.error("Error starting timer:", error);
  }
};

export const stopTimer = async (taskId: string, fetchDailyWorkHours: () => void) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    await axios.post(
      `http://localhost:8000/timer/${taskId}/stop-timer`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Timer stopped for task");
    fetchDailyWorkHours();
  } catch (error) {
    console.error("Error stopping timer:", error);
  }
};
