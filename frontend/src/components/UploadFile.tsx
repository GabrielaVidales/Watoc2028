import '@/components/UploadFile.css';
import { cn } from '@/lib/utils';
import { getFileSize } from "@/utils/getFileSize";
import { ArrowDown, Ban, ImagePlus } from 'lucide-react';
import * as React from 'react';
import * as DropZone from 'react-dropzone';


type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">

export interface UploadFileProps extends DivProps {
    onChange: (files: File[]) => void,
    onRejected?: (errors: DropZone.FileRejection[]) => void,
    disabled?: boolean,
    maxFiles?: number,
    maxSize?: number,
    accept?: DropZone.Accept
    className?: string
    icon?: React.ElementType
}


export function UploadFile({
    onChange,
    onRejected,
    disabled = false,
    maxFiles = 1,
    maxSize = 10485760,
    accept = {
        'image/png': ['.png'],
        "image/jpeg": ['.jpeg'],
        "image/webp": ['.webp'],
    },
    className = '',
    icon,
}: UploadFileProps) {

    const fileValidator = React.useCallback((file: File) => {
        if (file.size > maxSize) {
            return {
                code: "file-too-large",
                message: `The file is larger than ${getFileSize(maxSize)} (size: ${getFileSize(file)})`
            }
        }
    }, [maxSize])

    const onDropAccepted = React.useCallback((acceptedFiles: File[]) => {
        onChange?.(acceptedFiles)
    }, [onChange])

    const onDropRejected = React.useCallback((errors: DropZone.FileRejection[]) => {
        onRejected?.(errors)
    }, [onRejected])


    const { getInputProps, getRootProps, isDragActive, isDragReject } = DropZone.useDropzone({
        onDropAccepted,
        onDropRejected,
        multiple: disabled || maxFiles > 1,
        maxFiles: maxFiles,
        accept: accept,
        validator: fileValidator
    })

    const Icon = icon || ImagePlus

    return (
        <>
            <div {...getRootProps()} className={
                cn(
                    'p-4 bg-background flex flex-col items-center gap-2 justify-center text-center',
                    isDragActive ? ' drag ' : ' ',
                    isDragReject ? ' error ' : ' ',
                    className,
                    'px-6'
                )
            } >
                <input {...getInputProps()} />
                {isDragReject ? (<>
                    <Ban className='soft-translation size-8 shrink-0 hover:scale-110 duration-200' />
                    <span className='font-medium'>
                        File not accepted
                    </span>
                </>) : isDragActive ? <>
                    <Icon className='soft-translation size-8 shrink-0 hover:scale-110 duration-200' />
                    <span className='font-medium'>
                        Drop your file here...
                    </span>
                    <ArrowDown className='soft-translation size-8 shrink-0 ' />
                </> : <>
                    <Icon className='soft-translation size-8 shrink-0 hover:scale-110 duration-200' />
                    <span className='font-medium'>
                        Drop your file here to upload or click to browse files
                    </span>
                </>}
            </div>
        </>
    );
}
