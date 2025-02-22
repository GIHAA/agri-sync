import { useState } from "react";
import Lucide from "../../base-components/lucide";
import { 
  useGetActivityTrend, 
  useGetRedemptionAnalytics, 
  useGetRewardSettings, 
  useUpdateRewardSettings 
} from "../../api/reward-management";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import Button from "../../components/common/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RewardManagementPage = () => {
  const { data } = useGetRewardSettings();
  const { data: activityTrend } = useGetActivityTrend();
  const { data: redemptionAnalytics } = useGetRedemptionAnalytics();
  const { mutate } = useUpdateRewardSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newPoints, setNewPoints] = useState("");

  const handleEditClick = (event, points) => {
    setSelectedEvent(event);
    setNewPoints(points.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedEvent && newPoints) {
      mutate({ event: selectedEvent, points: parseInt(newPoints, 10) });
      setIsEditing(false);
    }
  };

  const activityTrendData = {
    labels: activityTrend?.map((entry) => entry.date),
    datasets: [
      {
        label: "Points Earned",
        data: activityTrend?.map((entry) => parseInt(entry.points_earned, 10)),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Points Redeemed",
        data: activityTrend?.map((entry) => Math.abs(parseInt(entry.points_redeemed, 10))),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const redemptionAnalyticsData = {
    labels: redemptionAnalytics?.map((entry) => entry.reward_type),
    datasets: [
      {
        label: "Redemptions",
        data: redemptionAnalytics?.map((entry) => parseInt(entry.redemptions, 10)),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="col-span-12 mt-6">
      <div className="intro-y mb-8 flex h-10 items-center justify-between sm:flex">
        <h2 className="mr-5 truncate text-[19px] text-lg font-medium text-[#2D3748]">
          Admin Reward Management
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data
          ?.slice()
          .sort((a, b) => a.id - b.id)
          .map((reward) => (
            <div key={reward.id} className="flex h-full w-full justify-between rounded-md bg-white p-4 shadow-md">
              <div className="flex flex-col">
                <div>{reward.event.replace("_", " ")}</div>
                <div className="text-4xl text-gray-700">{reward.points}</div>
              </div>
              <div>
                <Lucide
                  icon="Edit"
                  className="h-6 w-6 text-black cursor-pointer"
                  onClick={() => handleEditClick(reward.event, reward.points)}
                />
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Trend</h3>
            <div className="h-[400px]">
          <Line 
            data={activityTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
            </div>
          </div>
        
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reward Redemption Analytics</h3>
            <div className="h-[400px]">
          <Bar 
            data={redemptionAnalyticsData}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
            </div>
          </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Edit Points</h2>
            <label className="block text-sm font-medium text-gray-700">
              Points for {selectedEvent.replace("_", " ")}
            </label>
            <input
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded w-full"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button   variant="secondary" className="px-4 py-2 text-black  rounded" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button  variant="primary" className="px-4 py-2  text-white rounded" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardManagementPage;
