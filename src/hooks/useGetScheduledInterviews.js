import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setScheduledInterviews } from "@/redux/interviewSlice";

const useGetScheduledInterviews = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
       
        const res = await axios.get(`https://career-builder-backend.onrender.com/api/v1/interviews/user/${userId}`);


        console.log("📦 API Response:", res.data); 

       
        dispatch(setScheduledInterviews(res.data));

      } catch (error) {
        console.error("❌ Failed to fetch interviews", error);
      }
    };

    if (userId) {
      fetchInterviews();
    }
  }, [userId, dispatch]);
};

export default useGetScheduledInterviews;
