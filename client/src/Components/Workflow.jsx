import React from 'react'
import StepperComponent from './Stepper'

const Workflow = () => {
  const steps = [
    "User Details",
    "Upload Document",
    "Acceptance",
    "Download PDF"
  ]
  const stepsCompleted = 2;
  return (
    <div className=' flex flex-col justify-center col-span-3 shadow-lg p-8'>
      <StepperComponent steps={steps} stepsCompleted={stepsCompleted}/>
    </div>
  )
}

export default Workflow