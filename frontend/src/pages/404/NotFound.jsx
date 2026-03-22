import { Button } from "@/components/ui/button"
import { Home, Undo2 } from "lucide-react"
import { useNavigate } from "react-router"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">

            <div className="w-full max-w-2xl">
                <div className="flex flex-col items-center text-center gap-8">

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Error 404
                        </span>

                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                            Page not found
                        </h1>
                    </div>

                    <p className="max-w-md text-muted-foreground text-base">
                        The page you are looking for doesn’t exist or may have been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            size="lg"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2"
                        >
                            <Home size={18} />
                            Go home
                        </Button>

                        <Button
                            size="lg"
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <Undo2 size={18} />
                            Go back
                        </Button>
                    </div>

                    <div className="w-full border-t pt-6">
                        <p className="text-sm text-muted-foreground">
                            Need help?{" "}
                            <a
                                href="mailto:support@watoc2028.org"
                                className="font-medium text-foreground hover:underline"
                            >
                                support@watoc2028.org
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}