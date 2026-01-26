import { Avatar, Box, Button, ButtonBase, Container, Divider, Grid, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Edit, Phone, Work } from '@mui/icons-material';
import { getCountryImage } from '../../utils/countriesInfo';

export function UploadAvatars() {
    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} // prevent label from tab focus
            aria-label="Avatar image"
            sx={{
                borderRadius: '100%',
                '&:has(:focus-visible)': {
                    outlineColor: 'primary.main',
                    outlineWidth: '4px',
                    outlineStyle: 'solid',
                    outlineOffset: '2px',
                },
                height: 160, width: 160,
            }}
        >
            <Avatar alt="Upload new avatar" src={avatarSrc} sx={{ height: 150, width: 150 }} />
            <input
                type="file"
                accept="image/*"
                style={{
                    border: 0,
                    clip: 'rect(0 0 0 0)',
                    height: '1px',
                    margin: '-1px',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    width: '1px',
                }}
                onChange={handleAvatarChange}
            />
        </ButtonBase>
    );
}

interface IUserProfileProps { }

const UserProfile = ({ }: IUserProfileProps) => {

    const { currentUser } = useAuth()

    return (
        <Grid container spacing={3} justifyContent='center'>
            <Grid size={10} >
                <Paper elevation={3} sx={{ p: 4, display: 'flex', borderRadius: 3 }} >
                    <UploadAvatars />
                    <Stack sx={{ p: 3 }}>
                        <h5>{currentUser?.data?.prefix} {currentUser?.data?.firstName} {currentUser?.data?.lastName} </h5>
                        <p>{currentUser?.data?.cargo}</p>
                        <p>{currentUser?.data?.affiliation} | {currentUser?.data?.department} </p>
                        <Button variant='contained' startIcon={<Edit/>}>
                            Edit profile
                        </Button>
                    </Stack>
                </Paper>
            </Grid>
            <Grid size={5} >
                <Paper elevation={3} sx={{ borderRadius: 3, borderTop: 12, borderColor: 'primary.main', padding: { xs: 2, sm: 3, md: 5 } }}>
                    <Stack direction='row' spacing={5}>
                        <Stack spacing={4} flex={1}>
                            <Box display='flex' alignItems='center' gap={1.5}>
                                <Avatar sx={{ bgcolor: 'primary.main', height: 'auto', width: 35, aspectRatio: '1 / 1' }}>
                                    <Work />
                                </Avatar>
                                <Typography variant='h6' fontWeight='bold'>
                                    Academic Details
                                </Typography>
                            </Box>
                            <Box alignItems='center' gap={3}>
                                <TextField
                                    label='Affiliation'
                                    size='medium'
                                    defaultValue={currentUser?.data?.affiliation}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Box>
                            <Box alignItems='center' gap={3}>
                                <TextField
                                    label='Department'
                                    size='medium'
                                    defaultValue={currentUser?.data?.department}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Box>
                            <Box alignItems='center' gap={3}>
                                <TextField
                                    label='Cargo'
                                    size='medium'
                                    defaultValue={currentUser?.data?.cargo}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
            <Grid size={5} >
                <Paper elevation={3} sx={{ borderRadius: 3, borderTop: 12, borderColor: 'primary.main', padding: { xs: 2, sm: 3, md: 5 } }}>
                    <Stack direction='row' spacing={5}>
                        <Stack spacing={4} flex={1}>
                            <Box display='flex' alignItems='center' gap={1.5}>
                                <Avatar sx={{ bgcolor: 'primary.main', height: 'auto', width: 35, aspectRatio: '1 / 1' }}>
                                    <Phone />
                                </Avatar>
                                <Typography variant='h6' fontWeight='bold'>
                                    Contact info
                                </Typography>
                            </Box>
                            <Box display='flex' alignItems='center' gap={3}>
                                <TextField
                                    label='Email'
                                    size='medium'
                                    defaultValue={currentUser?.email}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Box>
                            <Box display='flex' alignItems='center' gap={3}>
                                <TextField
                                    label='Phone'
                                    fullWidth
                                    size='medium'
                                    defaultValue={currentUser?.data?.phone}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </Box>
                            <Box display='flex' alignItems='center' gap={3}>
                                <TextField
                                    label='City'
                                    size='medium'
                                    defaultValue={currentUser?.data?.city}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                                <TextField
                                    label='country'
                                    size='medium'
                                    defaultValue={currentUser?.data?.country}
                                    variant="outlined"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {getCountryImage(currentUser?.data?.country)}
                                                </InputAdornment>
                                            )
                                        },
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
};

export default UserProfile;
