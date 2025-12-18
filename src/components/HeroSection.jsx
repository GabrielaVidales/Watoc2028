import { Box, Fade, Toolbar } from '@mui/material'

export const HeroSection = ({ backgroundImgSrc, disableLinearGradient = false, height = '80dvh', children = null }) => (
  <>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
          <path>
            <animate
              attributeName="d"
              dur="2s"
              repeatCount="indefinite"
              values="
            M0 0 H1 V0.96
            C0.9 1.0 0.8 0.92 0.65 0.96
            C0.5 1.0 0.35 0.92 0.2 0.96
            C0.1 0.99 0.05 0.97 0 0.98 Z;

            M0 0 H1 V0.97
            C0.9 0.92 0.8 1.0 0.65 0.97
            C0.5 0.92 0.35 1.0 0.2 0.97
            C0.1 0.95 0.05 0.96 0 0.97 Z;

            M0 0 H1 V0.96
            C0.9 1.0 0.8 0.92 0.65 0.96
            C0.5 1.0 0.35 0.92 0.2 0.96
            C0.1 0.99 0.05 0.97 0 0.98 Z
          "
            />
          </path>
        </clipPath>
      </defs>
    </svg>


    <Box id="back-to-top-anchor"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: height,
        background: `${disableLinearGradient ? '' : `linear-gradient(
                    to bottom,
                    rgba(0,0,0,.7),
                    rgba(0,0,0,.3)
                ),` }
                url("${backgroundImgSrc}")`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        paddingBottom: 5,
        clipPath: 'url(#waveClip)'
      }}
    >
      {children && (<>
        <Toolbar />
        <Fade in timeout={800}>
          <Box className='d-flex flex-column' sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            padding: { xs: 3, sm: 5, md: 6 },
            width: { xs: '100%', sm: '80%', md: '80%' },
          }}>
            {children}
          </Box>
        </Fade>
      </>)}
    </Box >
  </>
)