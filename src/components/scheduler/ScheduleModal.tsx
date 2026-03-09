import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useSchedulerStore, Schedule } from '../../store/schedulerStore';

interface ScheduleModalProps {
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose }) => {
  const { schedules, addSchedule, removeSchedule, toggleSchedule } = useSchedulerStore();
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    cronExpression: '0 * * * *',
    graphId: '',
    bulkConfig: {
      iterations: 1,
      delay: 0,
    },
  });

  const handleAddSchedule = () => {
    addSchedule({
      ...newSchedule,
      enabled: true,
    });
    setNewSchedule({
      name: '',
      cronExpression: '0 * * * *',
      graphId: '',
      bulkConfig: {
        iterations: 1,
        delay: 0,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Schedule Executions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Schedule Name"
              value={newSchedule.name}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <input
              type="text"
              placeholder="Cron Expression"
              value={newSchedule.cronExpression}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, cronExpression: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Iterations"
                value={newSchedule.bulkConfig.iterations}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    bulkConfig: {
                      ...newSchedule.bulkConfig,
                      iterations: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <input
                type="number"
                placeholder="Delay (ms)"
                value={newSchedule.bulkConfig.delay}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    bulkConfig: {
                      ...newSchedule.bulkConfig,
                      delay: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>

          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {schedule.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.cronExpression}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`px-3 py-1 rounded-lg ${
                      schedule.enabled
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {schedule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => removeSchedule(schedule.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};