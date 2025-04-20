import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAllApplicants } from "../redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const InterviewScheduler = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const { companies } = useSelector((store) => store.company);
  const { allAdminJobs } = useSelector((store) => store.job);

  const [formData, setFormData] = useState({
    applicantId: "",
    jobId: "",
    employerId: "",
    scheduledTime: "",
    mode: "Online",
    meetingLink: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplicantsForJob = async () => {
      if (!formData.jobId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${formData.jobId}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.error("Error fetching applicants for job:", error);
        toast.error("Failed to fetch applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantsForJob();
  }, [formData.jobId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mode === "Online" && !formData.meetingLink) {
      toast.error("Please provide a meeting link for online interviews.");
      return;
    }
    if (formData.mode === "Offline" && !formData.location) {
      toast.error("Please provide a location for offline interviews.");
      return;
    }

    try {
      const payload = {
        ...formData,
        meetingLink: formData.mode === "Online" ? formData.meetingLink : "",
        location: formData.mode === "Offline" ? formData.location : "",
      };

      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/interviews",
        payload
      );
      toast.success("Interview scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  };

  const applicantsArray = Array.isArray(applicants?.applications)
    ? applicants.applications
    : [];

  const jobsArray = Array.isArray(allAdminJobs) ? allAdminJobs : [];

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      {/* <h2 className="text-xl font-semibold mb-4">
        Schedule Interview 
      </h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Dropdown */}
        <select
          name="jobId"
          value={formData.jobId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Job</option>
          {jobsArray.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
       

        {/* Applicant Dropdown */}
        <select
          name="applicantId"
          value={formData.applicantId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={!formData.jobId}
        >
          <option value="">Select Applicant</option>
          {applicantsArray.length > 0 ? (
            applicantsArray.map((application) => (
              <option key={application._id} value={application.applicant._id}>
                {application.applicant.fullname}
              </option>
            ))
          ) : (
            <option disabled>No applicants for this job</option>
          )}
        </select>

        {/* Company Dropdown */}
        <select
          name="employerId"
          value={formData.employerId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Date & Time */}
        <input
          type="datetime-local"
          name="scheduledTime"
          value={formData.scheduledTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Mode */}
        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        {/* Meeting Link or Location */}
        {formData.mode === "Online" && (
          <input
            type="text"
            name="meetingLink"
            placeholder="Meeting Link"
            value={formData.meetingLink}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        )}

        {formData.mode === "Offline" && (
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </form>
    </div>
  );
};

export default InterviewScheduler;
