import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import api from "@/clients/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, } from "lucide-react";
import logo from '@/assets/WatocPNGLogo.png';


type VerifyState = "loading" | "success" | "error";

interface VerifyResponse {
    code: string;
    detail: string;
}

function VerifyPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const hasVerified = useRef(false);
    const [state, setState] = useState<VerifyState>("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (hasVerified.current) return;

        async function verifyEmail() {

            if (!token) {
                setState("error");
                setMessage("Verification token is missing.");
                return;
            }

            try {

                hasVerified.current = true;

                await new Promise(resolve => setTimeout(resolve, 1000));

                const response = await api.post<VerifyResponse>("/auth/verify-email/", { token });

                const { code, detail } = response.data;
                switch (code) {
                    case "verification_success":
                        setState("success");
                        setMessage(detail || "Your email has been verified successfully.");
                        break;

                    case "already_verified":
                        setState("success");
                        setMessage(detail || "Your email address has already been verified.");
                        break;

                    default:
                        setState("error");
                        setMessage(detail || "Unable to verify your email.");
                }

            } catch (error) {
                const err = error as AxiosError<VerifyResponse>;
                const code = err.response?.data?.code;
                const detail = err.response?.data?.detail;

                switch (code) {
                    case "missing_token":
                        setState("error");
                        setMessage(detail || "Verification token is missing.")
                        break;

                    case "token_expired":
                        setState("error");
                        setMessage(detail || "This verification link has expired.");
                        break;

                    case "invalid_token":
                    case "invalid_token_data":
                        setState("error");
                        setMessage(detail || "This verification link is invalid.");
                        break;

                    case "user_not_found":
                        setState("error");
                        setMessage(detail || "Account not found.");
                        break;

                    default:
                        setState("error");
                        setMessage(detail || "Something went wrong while verifying your email.");
                }
            }
        }

        verifyEmail();

    }, [token]);

    const isLoading = state === "loading";
    const isSuccess = state === "success";
    const isError = state === "error";

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted">
            <Card className="w-full max-w-md border shadow-2xl rounded-3xl backdrop-blur animate-in fade-in-0 zoom-in-95 duration-300">
                <CardHeader className="items-center text-center">
                    <img src={logo} alt="WATOC 2028" className="max-w-xs mx-auto" />

                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-medium tracking-tight">
                            {isLoading && "Verifying your email"}

                            {isSuccess && "Email verified"}

                            {isError && "Verification failed"}
                        </CardTitle>

                        <CardDescription className="text-base leading-relaxed max-w-sm mx-auto">
                            {message}
                        </CardDescription>

                        <div className="flex items-center justify-center">
                            {isLoading && (
                                <Loader2 className="size-10 animate-spin" />
                            )}

                            {isSuccess && (
                                <CheckCircle2 className="size-10" />
                            )}

                            {isError && (
                                <XCircle className="size-10 text-red-500" />
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {isSuccess && (
                        <>
                            <Button asChild className="w-full" size="lg">
                                <Link to="/auth/login">
                                    Continue to login
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full">
                                <Link to="/">
                                    Go to home
                                </Link>
                            </Button>
                        </>
                    )}

                    {isError && (
                        <>
                            <Button asChild className="w-full" size="lg">
                                <Link to="/auth/resend-verification">
                                    Resend verification email
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full">
                                <Link to="/auth/login">
                                    Back to login
                                </Link>
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default VerifyPage;