import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome to your dashboard!</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Projects</h2>
          <p className="text-3xl">5</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Tasks</h2>
          <p className="text-3xl">23</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">Recent Activity</h2>
        <ul className="divide-y">
          <li className="py-2">Task #1 completed</li>
          <li className="py-2">Task #2 completed</li>
          <li className="py-2">Task #3 in progress</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
