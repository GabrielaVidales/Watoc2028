import * as React from 'react';
import * as DropZone from 'react-dropzone'
import '@/components/UploadFile.css'
import { ArrowDown, Ban, ImagePlus } from 'lucide-react';
import { getFileSize } from "@/utils/getFileSize";


export interface UploadFileProps {
    onChange?: (files: File[]) => void,
    onRejected?: (errors: DropZone.FileRejection[]) => void,
    value?: File | File[],
    disabled?: boolean,
    maxFiles?: number,
    maxSize?: number,
    accept?: {
        [mimeType: string]: string[]
    },
    className?: string
}


export function UploadFile({ onChange, onRejected, disabled = undefined, maxFiles = undefined, maxSize = undefined, accept = undefined, className = '' }: UploadFileProps) {
    const fileValidator = React.useCallback((file: File) => {
        if (file.size > maxSize) {
            return {
                code: "file-too-large",
                message: `The file is larger than ${getFileSize(maxSize)} (size: ${getFileSize(file)})`
            }
        }
    }, [maxSize])

    const onDropAccepted = React.useCallback((acceptedFiles: File[]) => {

        acceptedFiles.map(f => {
            console.log(getFileSize(f));
        })

        onChange?.(acceptedFiles)
    }, [onChange])

    const onDropRejected = React.useCallback((errors: DropZone.FileRejection[]) => {
        errors.map(e => {
            console.log(getFileSize(e.file));
        })
        onRejected?.(errors)
    }, [onRejected])


    const { getInputProps, getRootProps, isDragActive, isDragReject } = DropZone.useDropzone({
        onDropAccepted,
        onDropRejected,
        multiple: disabled || false,
        maxFiles: maxFiles || 1,
        accept: accept || {
            'image/png': ['.png'],
            "image/jpeg": ['.jpeg'],
            "image/webp": ['.webp'],
        },
        validator: fileValidator
    })

    return (
        <>
            <div {...getRootProps()} className={'dropzone flex flex-col items-center gap-2 justify-center' + (isDragActive ? ' drag ' : ' ') + (isDragReject ? ' error ' : ' ') + className} >
                <input {...getInputProps()} />
                {isDragReject ? (<>
                    <Ban className='soft-translation size-8 shrink-0 hover:scale-110 duration-300' />
                    <span className='font-semibold'>
                        File not accepted
                    </span>
                </>) : isDragActive ? <>
                    <ImagePlus className='soft-translation size-8 shrink-0 hover:scale-110 duration-300' />
                    <span className='font-semibold'>
                        Drop your file here...
                    </span>
                    <ArrowDown className='soft-translation size-8 shrink-0 ' />
                </> : <>
                    <ImagePlus className='soft-translation size-8 shrink-0 hover:scale-110 duration-300' />
                    <span className='font-semibold'>
                        Drop your file here to upload or click to browse files
                    </span>
                </>}
            </div>
        </>
    );
}
