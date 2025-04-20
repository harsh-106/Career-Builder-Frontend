import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useSelector } from "react-redux";
import useGetScheduledInterviews from '@/hooks/useGetScheduledInterviews'
import { Link } from 'react-router-dom'


const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    useGetScheduledInterviews(user?._id);
    const { scheduledInterviews } = useSelector((store) => store.interview);


    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={
                                                        
                                                            user?.profile?.profilePhoto ? user?.profile?.profilePhoto : "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                                                        
                            } alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
                <div className='max-w-4xl mx-auto bg-white rounded-2xl mt-5'>
  <h1 className='font-bold text-lg my-5'>Scheduled Interviews</h1>
  {Array.isArray(scheduledInterviews) && scheduledInterviews.length > 0 ? (
    <ul className="space-y-4">
      {scheduledInterviews.map((interview) => (
        <li key={interview._id} className="border p-4 rounded shadow-sm">
            {/* <p>
                    <strong>Job:</strong>{" "}
                    <Link
                      to={`/jobs/${interview?.jobId?._id}`}
                      className="text-blue-500 underline"
                    >
                      {interview?.jobId?.title}
                    </Link>
                  </p> */}
         <p><strong>Job:</strong> {interview?.jobId?.title}</p>
        <p><strong>Company:</strong> {interview?.employerId?.name}</p>
          <p><strong>Mode:</strong> {interview.mode}</p>
          <p><strong>Scheduled Time:</strong> {new Date(interview.scheduledTime).toLocaleString()}</p>
          {interview.mode === "Online" && (
            <p><strong>Meeting Link:</strong> <a href={interview.meetingLink} className="text-blue-500 underline">{interview.meetingLink}</a></p>
          )}
          {interview.mode === "Offline" && (
            <p><strong>Location:</strong> {interview.location}</p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No interviews scheduled yet.</p>
  )}
</div>

            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile