import { cn, getFileSize } from "@/lib/utils";
import { Image, X, type LucideIcon } from "lucide-react";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import * as DropZone from 'react-dropzone';
import { Button } from "./ui/button";


export interface ImageUploadRef {
    open: () => void
}

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">

interface Props extends DivProps {
    onRejected?: (errors: DropZone.FileRejection[]) => void,
    onChange?: (file: File | null) => void;
    onDelete?: () => void
    maxSize?: number
    file?: File | null
    overridePreview?: string
    icon?: LucideIcon
}


const ImageUpload = forwardRef<ImageUploadRef, Props>(function ImageUpload({
    onChange,
    onDelete,
    onRejected,
    "aria-invalid": ariaInvalid,
    overridePreview,
    className,
    maxSize = 10485760,
    icon: Icon = Image,
    file,
}: Props, ref) {

    const handleRemove = () => {
        onDelete?.()
        onChange?.(null)
    };

    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(url);

            return () => URL.revokeObjectURL(url);
        }

        if (!file && overridePreview) {
            setPreview(overridePreview);
            return;
        }

        setPreview("");
    }, [file, overridePreview]);

    const fileValidator = useCallback((file: File) => {
        if (file.size > maxSize) {
            return {
                code: "file-too-large",
                message: `The file is larger than ${(
                    getFileSize(maxSize)
                )} (size: ${(
                    getFileSize(file)
                )})`
            }
        }
        return null
    }, [maxSize])

    const {
        open,
        getInputProps,
        getRootProps,
        isDragActive,
        isDragReject,
    } = DropZone.useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        multiple: false,
        validator: fileValidator,
        onDropRejected: (errors => onRejected?.(errors)),
        onDrop: ([file]) => {
            if (!file) return;
            onChange?.(file);
        },
    });


    useImperativeHandle(ref, () => ({
        open,
    }));

    const hasError = ariaInvalid || isDragReject

    return (
        <div className={cn(className)}>
            {!preview ? (
                <div
                    {...getRootProps()}
                    aria-invalid={ariaInvalid ? 'true' : 'false'}
                    className={cn(
                        'flex flex-col justify-center items-center gap-2 border-2 border-dashed h-full w-full',
                        'rounded-xl text-center cursor-pointer transition-colors',

                        isDragActive
                            ? "border-blue-400 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                            : hasError ? '' : "border-gray-200 bg-gray-100 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600",

                        hasError && "border-destructive bg-destructive/50 dark:border-destructive dark:bg-destructive/20",
                    )}
                >
                    <input {...getInputProps()} />
                    <div className={cn(
                        "p-4 rounded-full shadow-sm ring-2",
                        hasError
                            ? 'bg-destructive/50 ring-destructive dark:bg-destructive/20 dark:ring-destructive'
                            : isDragActive
                                ? 'ring-blue-400 bg-blue-200 dark:bg-blue-900/50'
                                : 'ring-gray-200 border-gray-200 bg-gray-200 hover:border-gray-300 dark:bg-neutral-800 dark:ring-neutral-700'
                    )}>
                        <Icon className={cn(
                            'size-10 stroke-[1.5]',
                            hasError ? 'text-red-100' : isDragActive ? 'text-blue-400' : 'text-neutral-500',
                            hasError ? 'dark:text-red-300' : isDragActive ? 'text-blue-400' : 'dark:text-neutral-300',
                        )} />
                    </div>

                    <div className="flex flex-col items-center">
                        <span
                            className={cn(
                                'font-medium text-sm',
                                hasError ? 'text-red-100' : 'text-neutral-500',
                                hasError ? 'dark:text-red-300' : 'dark:text-neutral-300'
                            )}
                        >
                            {isDragReject ? 'Invalid file type' : 'No photo selected'}
                        </span>
                        <span
                            className={cn(
                                'text-xs',
                                hasError ? 'text-red-100' : 'text-neutral-400',
                                hasError ? 'dark:text-red-400' : 'dark:text-neutral-500'
                            )}
                        >
                            JPG, PNG or WebP
                        </span>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 h-full w-full">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <Button
                        type="button"
                        onClick={handleRemove}
                        size={'icon'}
                        variant='destructive'
                        className="absolute top-2 right-2 bg-destructive text-white"
                    >
                        <X />
                    </Button>
                </div>
            )}
        </div >
    );
})

export default (ImageUpload)