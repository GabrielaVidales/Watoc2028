import axiosClient from '@/clients/axiosClient';
import React, { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router'


function PaymentSuccess() {
    const [params] = useSearchParams()
    const session_id = params.get('session_id')

    console.log(session_id);

    useEffect(()=>{
        if (session_id) {
            const fetchPayment = async () => {
                try {
                    const res = await axiosClient.get(`payments/success?session_id=${session_id}`)
                    console.log(res);
                    
                } catch (error) {
                    console.log(error.response);
                }
                
            }
            fetchPayment()
        }


    }, [session_id])
    
    return (
        <div>


        </div>
    )
}

export default PaymentSuccess