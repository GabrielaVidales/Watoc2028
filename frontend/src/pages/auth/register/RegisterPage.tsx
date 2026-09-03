import handwriting from '@/assets/handwritting.png';
import { Card, CardContent } from '@/components/ui/card';
import RegisterForm from '@/features/auth/forms/RegisterForm';
import { CheckCircle2, ClipboardSignature, SquareUserRound } from 'lucide-react';

export default function RegisterPage() {

    return (
        <Card className="mx-auto max-w-xl w-full overflow-hidden border shadow-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl gap-0 py-0">
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row items-stretch">
                    {/* Left */}
                    <section className="flex-1 bg-card p-6 py-12">
                        <div className="mx-auto max-w-md space-y-6">
                            <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-2 text-center">
                                <div className="flex size-15 items-center justify-center rounded-full bg-primary-main shadow-md">
                                    <SquareUserRound className="size-10 text-primary-contrast" />
                                </div>

                                <h2 className="text-2xl font-semibold">
                                    Create an Account
                                </h2>

                                <div className="h-1 w-12 rounded-full bg-primary-main" />
                            </div>

                            <RegisterForm />
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="h-px w-full shrink-0 bg-border lg:h-auto lg:w-px" />

                    {/* Right */}
                    <section className="flex-1 bg-background p-6 py-12">
                        <div className="mx-auto flex h-full max-w-sm flex-col justify-between space-y-8">
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                    <div className="flex size-15 items-center justify-center rounded-full bg-primary-main shadow-md">
                                        <ClipboardSignature className="size-10 text-primary-contrast" />
                                    </div>

                                    <h2 className="text-xl font-semibold leading-snug">
                                        Create an account in order to register
                                        for WATOC and/or submit an abstract for
                                        oral/poster presentation
                                    </h2>

                                    <div className="h-1 w-12 rounded-full bg-primary-main" />

                                    <p className="pt-2 text-muted-foreground">
                                        Register to attend the congress and
                                        manage your participation in WATOC
                                        2028.
                                    </p>
                                </div>

                                <img
                                    src={handwriting}
                                    alt="Handwriting"
                                    className="aspect-square w-full rounded-2xl border border-border object-cover shadow-lg"
                                />

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-foreground">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-main" />
                                        <span className="text-sm font-medium">
                                            Official registration and technical
                                            sessions
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3 text-foreground">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-main" />
                                        <span className="text-sm font-medium">
                                            Abstract submission for oral
                                            presentations and posters
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-3 text-foreground">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-main" />
                                        <span className="text-sm font-medium">
                                            Certificates of attendance and
                                            participation
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </CardContent>
        </Card>
    );
}