import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';

const EmployeeTaskTracker = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    taskDescription: '',
    date: '',
    hoursWorked: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Google Sheets configuration
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwV-XIvmEZiei_y3pprSb5t26Os-l68DQV-rN0ZuXMK2QTTSU1_bcY56liKOSsP4sm5xw/exec';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data for Google Sheets
      const dataToSend = {
        employeeName: formData.employeeName,
        taskDescription: formData.taskDescription,
        date: formData.date,
        hoursWorked: parseFloat(formData.hoursWorked),
        timestamp: new Date().toISOString()
      };

      // Send to Google Sheets (you'll need to replace with your actual script URL)
      const response = await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      // Since we're using no-cors, we can't check the actual response
      // We'll assume success and show a success message
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        employeeName: '',
        taskDescription: '',
        date: '',
        hoursWorked: ''
      });

    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.employeeName && formData.taskDescription && 
                     formData.date && formData.hoursWorked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Task Tracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Log your daily tasks and hours worked
          </p>
        </div>

        <div className="space-y-6">
          {/* Employee Name */}
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Employee Name
            </label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Task Description
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe the task you worked on..."
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Hours Worked */}
          <div>
            <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-2" />
              Hours Worked
            </label>
            <input
              type="number"
              id="hoursWorked"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleInputChange}
              step="0.25"
              min="0"
              max="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 8.5"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
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
            {isSubmitting ? 'Submitting...' : 'Submit Task'}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Task submitted successfully!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Your task has been recorded in the Google Sheet.
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

        {/* Setup Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Setup Required:</h3>
          <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Create a Google Sheet with columns: Employee Name, Task Description, Date, Hours Worked, Timestamp</li>
            <li>Go to Extensions → Apps Script in your Google Sheet</li>
            <li>Create a script to handle POST requests (see documentation)</li>
            <li>Deploy as web app and replace YOUR_SCRIPT_ID in the code</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskTracker;