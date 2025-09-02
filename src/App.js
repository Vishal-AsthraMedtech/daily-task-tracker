import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Send, CheckCircle, AlertCircle, Plus, Trash2, List } from 'lucide-react';

const EmployeeTaskTracker = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeName: '',
    date: ''
  });
  
  const [tasks, setTasks] = useState([
    { id: 1, description: '', hoursWorked: '' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Google Sheets configuration - Replace with your actual script URL
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwV-XIvmEZiei_y3pprSb5t26Os-l68DQV-rN0ZuXMK2QTTSU1_bcY56liKOSsP4sm5xw/exec';

  const handleEmployeeDataChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskChange = (taskId, field, value) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const addTask = () => {
    const newTaskId = Math.max(...tasks.map(t => t.id)) + 1;
    setTasks(prev => [...prev, { id: newTaskId, description: '', hoursWorked: '' }]);
  };

  const removeTask = (taskId) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit each task as a separate row
      const submissions = tasks.map(async (task, index) => {
        const dataToSend = {
          employeeName: employeeData.employeeName,
          taskDescription: `Task-${index + 1}: ${task.description}`,
          date: employeeData.date,
          hoursWorked: parseFloat(task.hoursWorked),
          timestamp: new Date().toISOString()
        };

        return fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend)
        });
      });

      await Promise.all(submissions);
      
      setSubmitStatus('success');
      
      // Reset form
      setEmployeeData({
        employeeName: '',
        date: ''
      });
      setTasks([{ id: 1, description: '', hoursWorked: '' }]);

    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = employeeData.employeeName && employeeData.date && 
                     tasks.every(task => task.description && task.hoursWorked);

  const totalHours = tasks.reduce((sum, task) => sum + (parseFloat(task.hoursWorked) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <List className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Task Tracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Log your daily tasks and hours worked
          </p>
        </div>

        <div className="space-y-6">
          {/* Employee Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Employee Name
                </label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={employeeData.employeeName}
                  onChange={handleEmployeeDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={employeeData.date}
                  onChange={handleEmployeeDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
              <button
                type="button"
                onClick={addTask}
                className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </button>
            </div>

            {tasks.map((task, index) => (
              <div key={task.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-gray-800">Task-{index + 1}</h4>
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText className="inline h-3 w-3 mr-1" />
                      Description
                    </label>
                    <textarea
                      value={task.description}
                      onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Describe this specific task..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="inline h-3 w-3 mr-1" />
                      Hours Worked
                    </label>
                    <input
                      type="number"
                      value={task.hoursWorked}
                      onChange={(e) => handleTaskChange(task.id, 'hoursWorked', e.target.value)}
                      step="0.25"
                      min="0"
                      max="24"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="e.g., 2.5"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Hours Summary */}
          {totalHours > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-900">Total Hours:</span>
                <span className="text-lg font-bold text-indigo-600">{totalHours.toFixed(2)} hrs</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isFormValid && !isSubmitting
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Submitting Tasks...' : `Submit ${tasks.length} Task${tasks.length > 1 ? 's' : ''}`}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  All tasks submitted successfully!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {tasks.length} task{tasks.length > 1 ? 's have' : ' has'} been recorded in the Google Sheet.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Submission failed
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Please check your Google Sheets configuration and try again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTaskTracker;