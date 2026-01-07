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
                color: (textBlack) ? 'black' : 'white',
            }} >
                <Typography component="div" sx={{
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    textAlign: 'center',
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
