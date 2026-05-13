import type { HTMLAttributes } from "react";
import { useWatch } from "react-hook-form";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const PasswordStrengthMeter = ({ control, className }: { control: any } & HTMLAttributes<HTMLDivElement>) => {
    const password = useWatch({ control, name: "password.value", defaultValue: "" });
    const score = getPasswordStrength(password);

    const config = [
        { color: 'text-destructive', label: 'Very weak', value: 20 },
        { color: 'text-amber-500', label: 'Weak', value: 40 },
        { color: 'text-amber-800', label: 'Medium', value: 60 },
        { color: 'text-primary', label: 'Strong', value: 80 },
        { color: 'text-primary', label: 'Very strong', value: 100 },
    ];

    const current = config[score - 1] || { color: 'inherit', label: 'Password strength', value: 0 };

    return (
        <div className={className}>
            <Progress value={current.value} className="h-1" />
            <div className="flex justify-end text-sm mt-1">
                <span className={cn('text-xs', current.color)}>
                    {current.label}
                </span>
            </div>
        </div>
    );
};

export default PasswordStrengthMeter