import { HeroSection } from '@/components/HeroSection'
import UserRegisterForm from '../forms/registration/UserRegisterForm'

export default function Test() {

  return (
    <>
      <HeroSection />
      <div className='container-fluid h-100'>
        <div className='row h-100 justify-content-center'>
          <div className='col-12 col-sm-10 col-lg-4 p-1 p-sm-3'>
            <UserRegisterForm />
          </div>
          {/* 
        <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3'>
          <AbstractSubmissionForm/>
        </div>

        <div className='col-12 col-sm-10 col-lg-8 p-1 p-sm-3 h-100'>
          <RegistrationSteper/>
        </div> */}



        </div>
      </div>
    </>
  )
}

