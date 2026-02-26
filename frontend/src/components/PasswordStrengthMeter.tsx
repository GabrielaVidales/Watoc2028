import { LinearProgress } from "@mui/material";
import { useWatch, type Control, type FieldValues } from "react-hook-form";
import { Progress } from "./ui/progress";

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const PasswordStrengthMeter = ({ control }: { control: any }) => {
    const password = useWatch({ control, name: "password.value", defaultValue: "" });
    const score = getPasswordStrength(password);

    const config = [
        { color: 'text-destructive text-xs', label: 'Very weak', value: 20 },
        { color: 'text-amber-500 text-xs', label: 'Weak', value: 40 },
        { color: 'text-amber-800 text-xs', label: 'Medium', value: 60 },
        { color: 'text-primary text-xs', label: 'Strong', value: 80 },
        { color: 'text-primary text-xs', label: 'Very strong', value: 100 },
    ];

    const current = config[score - 1] || { color: 'inherit', label: '', value: 0 };

    return (
        <div >
            <Progress value={current.value} className="h-1" />
            <div className="flex justify-between text-sm mt-1">
                <span className="text-xs">Password strength</span>
                <span className={current.color}>
                    {current.label}
                </span>
            </div>
        </div>
    );
};

export default PasswordStrengthMeter