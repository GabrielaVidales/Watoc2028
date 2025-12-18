import React, { useEffect } from 'react'
import WizardRegistration from '../components/wizard registration/WizardRegistration'
import { useAPI } from '../contexts/APIContext'
import { Button } from '@mui/material'

export default function Test() {
  const api = useAPI()

  const handleMierda = async () => {
    const send = await api.post({ url: '/protected' })
    console.log(send)
    console.log('--------------------');
  }

  return (
    <div className='container-fluid h-100'>
      <div className='row h-100 justify-content-center'>
        <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3 h-100'>
          <WizardRegistration></WizardRegistration>
        </div>
      </div>
    </div>
  )
}

