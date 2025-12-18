import { Box, Fab, Fade, useScrollTrigger } from "@mui/material";

export function ScrollTop({ ref }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );
        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16 }} >
                <Fab
                    ref={ref}
                    onClick={handleClick}
                    size="large"
                    aria-label="scroll back to top"
                    sx={{ backgroundColor: 'white' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" /></svg>
                </Fab>
            </Box>
        </Fade>
    );
}