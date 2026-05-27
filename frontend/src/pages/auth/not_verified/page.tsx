import React, { useEffect, useState } from 'react';
import { Clock, LogOut, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import axiosClient from '@/clients/axiosClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner"


function VerifyYourEmailPage() {
    const { handleLogout, currentUser: { email } } = useAuth()
    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        if (cooldown < 0) return;

        const timer = setInterval(() => {
            setCooldown(prev => prev - 1)
        }, 1000);

        return () => clearInterval(timer)
    }, [cooldown])


    const resendEmail = async () => {
        try {
            const response = await axiosClient.post('/users/resend-verification-email/')
            if (import.meta.env.DEV){
                console.log(response);
            }
            toast(`We've sent a new verification link to ${email}. Please check your inbox and spam folder.`)
        } catch (error) {
            if (import.meta.env.DEV) {
                console.log(error);
            }
            toast(`Email couldn't be sended. Please try again.`)
        }
    }

    return (
        <Card className="max-w-md w-full mx-auto overflow-hidden pt-0 my-10">
            <CardHeader className="relative h-48 bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #003d9b 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative z-10 w-24 h-24 bg-card rounded-2xl shadow-lg flex items-center justify-center text-primary transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Mail className="h-12 w-12" />
                </div>

                <div
                    className="absolute top-10 right-20 w-8 h-8 rounded-full bg-primary/10 animate-bounce"
                    style={{ animationDuration: '3000ms' }}
                />
                <div className="absolute bottom-8 left-16 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
            </CardHeader>

            <CardContent className="pt-6 text-center space-y-4">
                <h1 className="text-2xl font-bold">Verify your email address</h1>

                <p className="text-muted-foreground max-w-sm mx-auto">
                    We've sent a verification link to your email. Please click the link
                    to confirm your account and get started.
                </p>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the email?
                    </p>
                    <Button
                        disabled={cooldown > 0}
                        className='select-none'
                        onClick={async () => {
                            if (cooldown < 0) {
                                setCooldown(4)
                                resendEmail()
                            }
                        }}
                    >
                        {cooldown > 0 ?
                            <React.Fragment>
                                <Clock />
                                Resend in {cooldown}s
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Mail />
                                Resend verification email
                            </React.Fragment>
                        }
                    </Button>
                    <div>
                        <Button
                            type='button'
                            variant='link'

                            onClick={handleLogout}
                        >
                            <LogOut />
                            Logout
                        </Button>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-muted/50 border-t justify-center gap-2 py-4">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                    Secured by WATOC 2028 Mail Service
                </span>
            </CardFooter>
        </Card>
    );
}

export default VerifyYourEmailPage
