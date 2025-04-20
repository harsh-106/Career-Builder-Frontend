import React from "react";
import InterviewScheduler from "./InterviewScheduler";
import InterviewList from "./InterviewList";
import { useSelector } from 'react-redux'
import Navbar from "./shared/Navbar";


const Dashboard = () => {
  const {user} = useSelector(store=>store.auth);

  return (
    <div>
        <Navbar/>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Schedule Interview</h1>

      {/* Schedule New Interview */}
      <div className="mb-10">
        <InterviewScheduler />
      </div>

      {/* View Existing Interviews */}
      <div>
        {/* <InterviewList userId={user} /> */}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
