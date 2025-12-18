import { ArrowForward, Email } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Container, Fab, Fade, Grid, Paper, Stack, Toolbar, Typography, Avatar } from '@mui/material'
import GenericCTASection from '../../../components/GenericCTASection';

const NewsletterSection = () => (
    <GenericCTASection>
        <Stack spacing={3} alignItems="center" textAlign="center">
            <NewsletterSignup />
        </Stack>
    </GenericCTASection>
)

const NewsletterSignup = () => (
    <Box
        component="section"
        sx={{
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 3, md: 10, lg: 15 },
        }}
    >
        <Container maxWidth="md">
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    textAlign: 'center',
                }}
            >
                <Email sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Stay Updated
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                    Subscribe to receive the latest news, updates, and important announcements about WATOC 2028
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            px: 4,
                            textTransform: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        Subscribe to Newsletter
                    </Button>
                </Stack>
            </Paper>
        </Container>
    </Box>
);

export default NewsletterSection