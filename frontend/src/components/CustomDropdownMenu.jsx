import { Box, Typography } from "@mui/material";
import './CustomDropdownMenu.css'
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomDropdownMenu = ({ textBlack = false, children }) => {
    const style = cn(
        'text-lg font-medium tracking-wider',
        (textBlack) ? 'text-black after:bg-black' : 'text-white',
    )
    return (
        <div className="dropdown">
            <div className='flex gap-1 items-center cursor-pointer'>
                <span className={style}>About</span>
                <ChevronDown className={style} />
            </div>
            <div className="dropdown-content">
                {children}
            </div>
        </div>
    );
};

export default CustomDropdownMenu;
