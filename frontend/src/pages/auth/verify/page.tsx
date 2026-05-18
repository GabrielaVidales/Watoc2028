import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";

import axiosClient from "@/clients/axiosClient";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type VerifyState =
    | "loading"
    | "success"
    | "error";

function VerifyPage() {

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [state, setState] = useState<VerifyState>("loading");

    const [message, setMessage] = useState(
        "Verifying your email..."
    );

    useEffect(() => {

        async function verifyEmail() {

            if (!token) {
                setState("error");
                setMessage("Verification token is missing.");
                return;
            }

            try {

                await axiosClient.post(
                    "/verify-email/",
                    {
                        token
                    }
                );

                setState("success");

                setMessage(
                    "Your email has been verified successfully."
                );

            } catch (error: any) {

                setState("error");

                if (error?.response?.data?.detail) {

                    setMessage(
                        error.response.data.detail
                    );

                } else {

                    setMessage(
                        "This verification link is invalid or has expired."
                    );

                }
            }
        }

        verifyEmail();

    }, [token]);

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-6">

            <Card className="w-full max-w-md shadow-xl rounded-3xl">

                <CardHeader className="space-y-2">

                    <CardTitle className="text-3xl">

                        {state === "loading" && "Verifying email"}

                        {state === "success" && "Email verified"}

                        {state === "error" && "Verification failed"}

                    </CardTitle>

                    <CardDescription className="text-base">
                        {message}
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    {state === "success" && (

                        <Button asChild className="w-full">

                            <Link to="/auth/login">
                                Continue to login
                            </Link>

                        </Button>

                    )}

                    {state === "error" && (

                        <Button asChild className="w-full">

                            <Link to="/auth/resend-verification">
                                Resend verification email
                            </Link>

                        </Button>

                    )}

                </CardContent>

            </Card>

        </div>
    );
}

export default VerifyPage;