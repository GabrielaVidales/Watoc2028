import { Button } from '@mui/material'
import axiosClient from '../clients/axiosClient'
import AbstractSubmissionForm from '../forms/AbstractSubmissionForm'
import RegistrationSteper from '../components/wizard registration/RegistrationSteper'

export default function Test() {

  const onLogin = async () => {
    const response = await axiosClient.post('login/', {
      username: 'eduar',
      password: 'password'
    })
    console.log(response)
  }
  
  const onProtected = async () => {
    const response = await axiosClient.get('protected/')
    console.log(response)
  }

  return (
    <div className='container-fluid h-100'>
      <div className='row h-100 justify-content-center'>
        <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3'>
          <AbstractSubmissionForm/>
        </div>

        {/* <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3 h-100'>
          <RegistrationSteper/>
        </div>
        <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3 h-100'>
          <Button onClick={onLogin}>
            Login
          </Button>
          <Button onClick={onProtected}>
            Protected
          </Button>
        </div> */}

        
      </div>
    </div>
  )
}

