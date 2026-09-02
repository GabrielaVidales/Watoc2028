import api from '@/clients/api';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';


function PaymentSuccess() {
    const [params] = useSearchParams()
    const session_id = params.get('session_id')

    const [idempotencyKey, setIdempotencyKey] = useState('')

    useEffect(() => {
        setIdempotencyKey(crypto.randomUUID())
    }, [])


    console.log(session_id);
    console.log(idempotencyKey);
    

    useEffect(() => {
        if (session_id && idempotencyKey) {
            const fetchPayment = async () => {
                try {
                    const res = await api.get(
                        `payments/${session_id}/`,
                        {
                            headers: {
                                'Idempotency-Key': idempotencyKey
                            }
                        }
                    )
                    console.log(res);

                } catch (error) {
                    console.log(error.response);
                }

            }
            fetchPayment()
        }


    }, [session_id, idempotencyKey])

    return (
        <div>


        </div>
    )
}

export default PaymentSuccess