import { useState } from "react";
import Lucide from "../../base-components/lucide";
import { useGetRewardSettings, useUpdateRewardSettings } from "../../api/reward-management";

const RewardManagementPage = () => {
  const { data } = useGetRewardSettings();
  const { mutate } = useUpdateRewardSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newPoints, setNewPoints] = useState("");

  const handleEditClick = (event: string, points: number) => {
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

      {/* Edit Modal */}
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
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardManagementPage;
