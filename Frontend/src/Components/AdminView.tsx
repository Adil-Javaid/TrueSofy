import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Clock,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberWorkHours = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Process chart data if workHours exist
  const chartData = {
    labels: workHours?.timers.map((timer) => {
      // Truncate long task descriptions for chart readability
      const desc = timer.task?.description || "Unknown Task";
      return desc.length > 20 ? desc.substring(0, 20) + "..." : desc;
    }),
    datasets: [
      {
        label: "Task Duration (Minutes)",
        data: workHours?.timers.map((timer) => Math.floor(timer.duration / 60)),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const minutes = context.raw || 0;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `Duration: ${hours}h ${mins}m`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Duration (Minutes)",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  // Get the selected team member's name
  const selectedMemberName =
    teamMembers.find((m) => m._id === selectedMember)?.username || "";

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Clock className="mr-2" size={20} />
          Team Member Work Hours
        </h2>
      </div>

      {/* Controls Section */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <User className="mr-2" size={16} />
              Team Member
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Select a member</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="mr-2" size={16} />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchMemberWorkHours}
              disabled={!selectedMember || isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              ) : (
                <CheckCircle className="mr-2" size={16} />
              )}
              View Hours
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {workHours ? (
        <div className="p-6">
          {/* Header with member name and date */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedMemberName}'s Work Hours
            </h3>
            <p className="text-gray-600">{formatDate(selectedDate)}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {workHours.totalHours}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Clock size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase">
                  Total Minutes
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {workHours.totalMinutes}
                </p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Briefcase size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 uppercase">
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {workHours.timers.length}
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">
              Task Duration Distribution
            </h4>
            <div className="h-64">
              <Bar data={chartData} />
            </div>
          </div>

          {/* Detailed Timers List */}
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-medium text-gray-700">
                Detailed Task Breakdown
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Task
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Workspace
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workHours.timers.map((timer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {timer.task?.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {timer.workspace?.name || "No workspace"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {Math.floor(timer.duration / 3600)}h{" "}
                          {Math.floor((timer.duration % 3600) / 60)}m
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-16 w-16 mb-4 rounded-full bg-blue-200 flex items-center justify-center">
                <Clock className="text-blue-500 opacity-50" size={32} />
              </div>
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : (
            <>
              <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ArrowRight className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No data to display
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a team member and date to view their work hours.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminViewHours;
