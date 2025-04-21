import React, { useEffect, useState } from "react";
import axios from "axios";

const InterviewList = ({ userId }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(`https://career-builder-backend.onrender.com/api/v1/interviews/user/${userId}`);
      setInterviews(res.data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (interviewId) => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) return;
    try {
      await axios.put(`https://career-builder-backend.onrender.com/api/v1/interviews/cancel/${interviewId}`);
      fetchInterviews(); 
    } catch (error) {
      console.error("Failed to cancel interview:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  if (loading) return <div>Loading interviews...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Interviews</h2>
      {interviews.length === 0 ? (
        <p>No interviews scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <li
              key={interview._id}
              className="p-4 border rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p><strong>Job:</strong> {interview.jobId?.title || interview.jobId}</p>
                <p><strong>Applicant:</strong> {interview.applicantId?.name || interview.applicantId}</p>
                <p><strong>Date:</strong> {new Date(interview.scheduledTime).toLocaleString()}</p>
                <p><strong>Mode:</strong> {interview.mode}</p>
                {interview.mode === "Online" && <p><strong>Meeting Link:</strong> {interview.meetingLink}</p>}
                {interview.mode === "Offline" && <p><strong>Location:</strong> {interview.location}</p>}
                <p className="text-sm text-gray-500">Status: {interview.status}</p>
              </div>
              {interview.status === "Scheduled" && (
                <button
                  onClick={() => handleCancel(interview._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InterviewList;
