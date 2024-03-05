import React from 'react'
import { useSelector } from 'react-redux'
import { privateRequest } from '../utils/useFetch'
import StepperComponent from './Stepper'

const Workflow = ({id}) => {
  const steps = [
    "User Details",
    "Upload Document",
    "Acceptance",
    "Download PDF"
  ]
  const user = useSelector((state) => state.user);
  const makeRequest = privateRequest(user.accessToken, user.refreshToken);
  const stepsCompleted = 2;
  return (
    <div className=' flex flex-col justify-center col-span-3 shadow-lg p-8 gap-10'>
      <StepperComponent steps={steps} stepsCompleted={stepsCompleted}/>
      <div className='w-full mt-10 flex justify-around'>
        <button onClick={()=>{makeRequest.put("/reservation/approve/"+ id)}} className='border rounded-lg p-3 px-4 bg-green-400 hover:bg-green-500'>Approve</button>
        <button onClick={()=>{makeRequest.put("/reservation/reject/"+ id)}} className='border rounded-lg p-3 px-4 bg-red-400 hover:bg-red-500'>Reject</button>
        <button className='border rounded-lg p-3 px-4 bg-yellow-400 hover:bg-yellow-500'>Review</button>
      </div>
      <div className='w-full'>
        {/* <input type="textArea"></input> */}
        <textarea className='w-full p-2' rows={5} placeholder="Write any review or comments"></textarea>
      </div>
    </div>
  )
}

export default Workflow