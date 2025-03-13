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
import { useGetClickTrend, useGetMissClickRate, useGetMissClickRateByButton, useGetPreisionGraph, useGetSucessfullClickRate } from "../../api/ui-management";

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

const UIManagementPage = () => {
  const { data } = useGetMissClickRate();
  const {data: successdata} = useGetSucessfullClickRate();
  const { data: activityTrend } = useGetMissClickRateByButton();
  const { data: redemptionAnalytics } = useGetPreisionGraph();
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

  const missClickRateData = {
    labels: activityTrend?.map((entry) => entry.buttonId), // Use buttonId as labels
    datasets: [
      {
        label: "Miss Click Rate (%)",
        data: activityTrend?.map((entry) => parseFloat(entry.missClickRate)), // Ensure it's parsed correctly
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Total Interactions",
        data: activityTrend?.map((entry) => Math.abs(parseInt(entry.totalInteractions, 10))),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const redemptionAnalyticsData = {
    labels: redemptionAnalytics?.map((entry) => entry.date),
    datasets: [
      {
        label: "Precision",
        data: redemptionAnalytics?.map((entry) => (entry.precision * 100)),
        backgroundColor: "#FF6384",
      },
    ],
  };

  return (
    <div className="col-span-12 mt-6">
      <div className="intro-y mb-8 flex h-10 items-center justify-between sm:flex">
        <h2 className="mr-5 truncate text-[19px] text-lg font-medium text-[#2D3748]">
          Admin UI Management
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
     
            <div  className="flex h-full w-full justify-between rounded-md bg-white p-4 shadow-md">
              <div className="flex flex-col">
                <div>Misclick Rate</div>
                <div className="text-4xl text-gray-700">{data?.missClickRate}</div>
              </div>
              <div>
              </div>
            </div>

            <div  className="flex h-full w-full justify-between rounded-md bg-white p-4 shadow-md">
              <div className="flex flex-col">
                <div>Succesfull Clicks Rate</div>
                <div className="text-4xl text-gray-700">{successdata?.successRate}</div>
              </div>
              <div>
              </div>
            </div>
         
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Clicks Trend</h3>
            <div className="h-[400px]">
          <Line 
            data={missClickRateData}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
            </div>
          </div>
        
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Clicks Precission Analytics</h3>
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

export default UIManagementPage;
