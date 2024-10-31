import React from 'react'
import TopBar from '@/components/topBar'

const form = () => {
  return (
    <div>
      <TopBar pageName='Appointment Form' />
      <div className='pt-2'>Please fill out the form below to schedule an appointment. Ensure all fields are completed accurately to avoid any delays in
        processing your request.
      </div>
    </div>
  )
}

export default form