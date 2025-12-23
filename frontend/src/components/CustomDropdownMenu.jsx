import { Box, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import './CustomDropdownMenu.css'

const CustomDropdownMenu = ({ textBlack = false, children }) => {

    return (
        <Box className="dropdown">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                transition: '0.3s ease',
                color: (textBlack) ? 'black' : 'white',
            }} >
                <Typography variant="h6" component="div" sx={{

                }} >
                    About
                </Typography>
                <KeyboardArrowDown />
            </Box>
            {/* NO USAR OTRO COMPONENTE, SINO SE ROMPE */}
            <div className="dropdown-content">
                {children}
            </div>
        </Box>
    );
};

export default CustomDropdownMenu;
