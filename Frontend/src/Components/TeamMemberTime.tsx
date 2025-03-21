import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  fetchDailyWorkHours,
  startTimer,
  stopTimer,
} from "../Functionality/useTimer";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import {
  Play,
  Square,
  Clock,
  BarChart2,
  PieChart,
  Calendar,
  RefreshCw,
} from "lucide-react";

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
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("time");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks(setTasks);
    fetchDailyWorkHours(setDailyWorkHours);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    Promise.all([
      fetchTasks(setTasks),
      fetchDailyWorkHours(setDailyWorkHours),
    ]).then(() => {
      setTimeout(() => setIsRefreshing(false), 600);
    });
  };

  const handleStartTimer = (taskId: string) => {
    startTimer(taskId);
    setActiveTaskId(taskId);
  };

  const handleStopTimer = (taskId: string) => {
    stopTimer(taskId, () => {
      fetchDailyWorkHours(setDailyWorkHours);
      setActiveTaskId(null);
    });
  };

  // Calculate total time in hours (for display)
  const totalTimeInHours =
    dailyWorkHours.totalHours + dailyWorkHours.totalMinutes / 60;
  const formattedTotalTime = `${dailyWorkHours.totalHours}h ${dailyWorkHours.totalMinutes}m`;

  // Progress percentage
  const targetHours = 8; // Assuming 8 hour workday
  const progressPercentage = Math.min(
    100,
    Math.round((totalTimeInHours / targetHours) * 100)
  );

  // Work hours data for bar chart
  const workHoursData = {
    labels: ["Today's Hours"],
    datasets: [
      {
        label: "Hours Worked",
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 6,
        data: [totalTimeInHours],
      },
      {
        label: "Target Hours",
        backgroundColor: "rgba(220, 220, 220, 0.3)",
        borderColor: "rgba(220, 220, 220, 1)",
        borderWidth: 1,
        borderRadius: 6,
        data: [targetHours],
      },
    ],
  };

  // Task status counts
  const taskStatusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { pending: 0, "in progress": 0, completed: 0 }
  );

  // Task progress data for pie chart
  const taskProgressData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Progress",
        backgroundColor: ["#FFA500", "#3498DB", "#2ECC71"],
        borderColor: ["#F39C12", "#2980B9", "#27AE60"],
        borderWidth: 1,
        data: [
          taskStatusCounts.pending,
          taskStatusCounts["in progress"],
          taskStatusCounts.completed,
        ],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header with tabs */}
      <div className="px-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="mr-2 text-blue-500" size={20} />
          Time Tracking & Analytics
        </h2>

        <div className="flex">
          <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("time")}
              className={`text-sm px-3 py-1.5 rounded-md ${
                activeTab === "time" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Time Tracking
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`text-sm px-3 py-1.5 rounded-md ${
                activeTab === "analytics"
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Analytics
            </button>
          </div>

          <button
            onClick={refreshData}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            disabled={isRefreshing}
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Time tracking tab content */}
      {activeTab === "time" && (
        <div className="p-4">
          {/* Today's progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Today's Work Progress
              </h3>
              <div className="text-xl font-bold text-blue-600">
                {formattedTotalTime}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0h</span>
              <span>{`${targetHours}h (${progressPercentage}%)`}</span>
            </div>
          </div>

          {/* Task list with timers */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Your Tasks</h3>
              {activeTaskId && (
                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full flex items-center">
                  <Clock size={12} className="mr-1" /> Timer Active
                </span>
              )}
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {tasks.map((task: Task) => (
                  <div
                    key={task._id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-800">
                        {task.description}
                      </div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {task.status}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        {activeTaskId === task._id ? (
                          <button
                            onClick={() => handleStopTimer(task._id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md flex items-center"
                          >
                            <Square size={12} className="mr-1" /> Stop
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartTimer(task._id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md flex items-center"
                            disabled={activeTaskId !== null}
                          >
                            <Play size={12} className="mr-1" /> Start
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No tasks assigned</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tasks will appear here when assigned
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics tab content */}
      {activeTab === "analytics" && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Hours Chart */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <BarChart2 size={18} className="mr-2 text-blue-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  Daily Work Hours
                </h3>
              </div>
              <div className="h-64">
                <Bar data={workHoursData} options={chartOptions} />
              </div>
            </div>

            {/* Task Progress Chart */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <PieChart size={18} className="mr-2 text-blue-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  Task Progress
                </h3>
              </div>
              <div className="h-64">
                <Doughnut data={taskProgressData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-xs text-blue-600 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-blue-700">
                {tasks.length > 0
                  ? Math.round(
                      (taskStatusCounts.completed / tasks.length) * 100
                    )
                  : 0}
                %
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="text-xs text-amber-600 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-amber-700">
                {taskStatusCounts["in progress"]} tasks
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-xs text-green-600 mb-1">Avg Hours/Task</div>
              <div className="text-2xl font-bold text-green-700">
                {tasks.length > 0 && totalTimeInHours > 0
                  ? (totalTimeInHours / taskStatusCounts.completed).toFixed(1)
                  : "0.0"}
                h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberTime;
