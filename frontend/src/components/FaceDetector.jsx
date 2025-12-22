// import { useEffect, useRef, useState } from 'react'
// import * as faceapi from 'face-api.js'
// import { Button, Typography } from '@mui/material'


// export default function FaceDetector({ onSuccess }) {
//     const videoRef = useRef(null)
//     const canvasRef = useRef(null)
//     const [ready, setReady] = useState(false)
//     const [detected, setDetected] = useState(false)

//     useEffect(() => {
//         const load = async () => {
//             await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
//             await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
//             console.log('Done!')

//             const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//             videoRef.current.srcObject = stream
//             setReady(true)
//         }

//         load()
//     }, [])

//     const checkFace = async () => {
//         const video = videoRef.current
//         const canvas = canvasRef.current
//         if (!video || !canvas) return

//         const detection = await faceapi
//             .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()

//         if (!detection) return

//         setDetected(true)

//         const displaySize = {
//             width: video.videoWidth,
//             height: video.videoHeight
//         }

//         faceapi.matchDimensions(canvas, displaySize)

//         const ctx = canvas.getContext('2d')

//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

//         const resized = faceapi.resizeResults(detection, displaySize)

//         faceapi.draw.drawDetections(canvas, resized)
//         faceapi.draw.drawFaceLandmarks(canvas, resized)

//         stopCamera()
//         onSuccess?.()
//     }


//     const stopCamera = () => {
//         const video = videoRef.current
//         const stream = video?.srcObject
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop())
//             video.srcObject = null
//         }
//     }

//     return (
//         <>
//             <Typography>
//                 Coloca tu rostro frente a la cámara y presiona verificar
//             </Typography>

//             <div
//                 style={{
//                     // position: 'relative',
//                     width: 300,
//                     height: 225 // o auto si controlas aspect ratio
//                 }}
//             >
//                 {!detected &&
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         muted
//                         playsInline
//                         style={{
//                             width: '100%',
//                             height: '100%',
//                             borderRadius: 8,
//                             objectFit: 'cover'
//                         }}
//                     />
//                 }

//                 <canvas
//                     ref={canvasRef}
//                     style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         pointerEvents: 'none',
//                         transform: 'translateY(100%)'
//                     }}
//                 />
//             </div>

//             <Button
//                 onClick={checkFace}
//                 disabled={!ready}
//                 variant="contained"
//                 sx={{ mt: 2 }}
//             >
//                 Verificar
//             </Button>

//             {detected && <Typography color="success.main">Rostro detectado</Typography>}
//         </>
//     )
// }
