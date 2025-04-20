
import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    scheduledInterviews: [],
  },
  reducers: {
    setScheduledInterviews: (state, action) => {
      state.scheduledInterviews = action.payload;
    },
  },
});

export const { setScheduledInterviews } = interviewSlice.actions;
export default interviewSlice.reducer;
