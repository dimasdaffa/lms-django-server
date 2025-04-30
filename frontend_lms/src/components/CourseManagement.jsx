import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, RefreshCw } from "lucide-react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [courseStats, setCourseStats] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const [userCourseData, setUserCourseData] = useState(null);
  const [message, setMessage] = useState(null);

  const api = axios.create({
    baseURL: "http://0.0.0.0:8001",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/courses/");
      setCourses(response.data);
    } catch (error) {
      showMessage("Failed to fetch courses", "error");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/course-stats/");
      setCourseStats(response.data);
    } catch (error) {
      showMessage("Failed to fetch course statistics", "error");
    }
  };

  const fetchMemberStats = async () => {
    try {
      const response = await api.get("/api/member-stats/");
      setMemberStats(response.data);
    } catch (error) {
      showMessage("Failed to fetch member statistics", "error");
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await api.get("/api/user-courses");
      setUserCourseData(response.data);
    } catch (error) {
      showMessage("Failed to fetch user courses", "error");
    }
  };

  const handleDeleteAllCourses = async () => {
    if (window.confirm("Are you sure you want to delete all courses?")) {
      try {
        await api.delete("/api/courses/delete-all/");
        showMessage("All courses deleted successfully");
        // Refresh all data
        fetchCourses();
        fetchStats();
        fetchMemberStats();
        fetchUserCourses();
      } catch (error) {
        showMessage("Failed to delete courses", "error");
      }
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStats();
    fetchMemberStats();
    fetchUserCourses();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {message && (
        <div
          className={`p-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 flex justify-between items-center border-b">
          <h1 className="text-2xl font-bold">Course Management</h1>
          <div className="space-x-2">
            <button
              onClick={handleDeleteAllCourses}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Courses
            </button>
            <button
              onClick={() => {
                fetchCourses();
                fetchStats();
                fetchMemberStats();
                fetchUserCourses();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </button>
          </div>
        </div>

        {/* Course Statistics */}
        {courseStats && (
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Course Statistics</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xl font-bold">{courseStats.course_count}</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-xl font-bold">
                  ${courseStats.courses.avg_price?.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded">
                <p className="text-sm text-gray-600">Min Price</p>
                <p className="text-xl font-bold">
                  ${courseStats.courses.min_price}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded">
                <p className="text-sm text-gray-600">Max Price</p>
                <p className="text-xl font-bold">
                  ${courseStats.courses.max_price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Courses */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">All Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.name}
                    </td>
                    <td className="px-6 py-4">{course.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${course.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.teacher.fullname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Python Courses with Member Stats */}
        {memberStats && (
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">
              Courses Member Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Members
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberStats.data.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${course.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.member_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User's Courses */}
        {userCourseData && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              Courses by {userCourseData.fullname}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userCourseData.courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.name}
                      </td>
                      <td className="px-6 py-4">{course.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${course.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
