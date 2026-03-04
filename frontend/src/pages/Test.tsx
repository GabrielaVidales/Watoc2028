import { HeroSection } from '@/components/HeroSection'
import UserRegisterForm from '../forms/registration/UserRegisterForm'
import { Progress } from '@/components/ui/progress'
import { CircleCheckBig, CircleEllipsis } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { StepperLabel } from '@/components/ui/stepper'

export default function Test() {

  const [state, setState] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => !prev)
    }, 1000)

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }

  }, [state])

  return (
    <>
      <div className='w-full max-w-5xl grid grid-cols-1 gap-3 p-3 mx-auto'>
        <div className='w-full bg-background border-2 p-3 rounded-lg shadow-lg flex flex-col gap-5'>
          <div className='min-h-90 grid grid-cols-4'>
            <StepperLabel
              completed={state}
              label='Abstract Content'
            />
            <StepperLabel
              completed={!state}
              label='Authors'
            />
            <StepperLabel
              completed={state}
              label='Declarations'
            />
            <StepperLabel
              completed={!state}
              label='Submit'
            />

          </div>
        </div>
      </div>
    </>
  )
}

