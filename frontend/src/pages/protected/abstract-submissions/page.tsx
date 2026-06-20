import React from 'react'
import ViewAbstracts from '../ViewAbstracts'

type Props = {}

function AbstractSubmissionsPage({ }: Props) {
    return (
        <div>
            <h1 className='text-3xl font-medium'>My Submissions</h1>

            <ViewAbstracts/>
        </div>
    )
}

export default AbstractSubmissionsPage