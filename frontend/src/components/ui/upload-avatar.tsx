import {
    formatBytes,
    useFileUpload,
    type FileWithPreview,
} from "@/hooks/use-file-upload"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CircleAlertIcon, UserIcon, XIcon } from 'lucide-react'

interface AvatarUploadProps {
    maxSize?: number
    className?: string
    onFileChange?: (file: FileWithPreview | null) => void
    defaultAvatar?: string
    accept?:string
}

export function AvatarUpload({
    maxSize = 2 * 1024 * 1024, // 2MB
    className,
    onFileChange,
    defaultAvatar,
    accept = "image/*",
}: AvatarUploadProps) {
    const [
        { files, isDragging, errors },
        {
            removeFile,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            getInputProps,
        },
    ] = useFileUpload({
        maxFiles: 1,
        maxSize,
        accept: accept,
        multiple: false,
        onFilesChange: (files) => {
            onFileChange?.(files[0] || null)
        },
    })

    const currentFile = files[0]
    const previewUrl = currentFile?.preview || defaultAvatar

    const handleRemove = () => {
        if (currentFile) {
            removeFile(currentFile.id)
        }
    }

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="relative">
                <div
                    className={cn(
                        "group/avatar relative size-40 cursor-pointer shadow-sm overflow-hidden rounded-full bg-muted/50 border-2 border-dashed transition-colors",
                        isDragging
                            ? "border-solid border-primary-light ring-primary-light/50 ring-[3px]"
                            : "border-input hover:border-primary-light",
                        previewUrl && "border-solid"
                    )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <input {...getInputProps()} className="sr-only" />

                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <UserIcon className="text-muted-foreground/25 size-12" />
                        </div>
                    )}
                </div>

                {currentFile && (
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleRemove}
                        className="absolute inset-e-0.5 top-0.5 z-10 size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700"
                        aria-label="Remove avatar"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}
            </div>

            <div className="space-y-0.5 text-center">
                <p className="font-medium">
                    {currentFile ? "Avatar uploaded" : "Upload avatar"}
                </p>
                <p className="text-muted-foreground text-sm">
                    PNG, JPG up to {formatBytes(maxSize)}
                </p>
            </div>

            {errors.length > 0 && (
                <Alert variant="destructive" className="mt-5">
                    <CircleAlertIcon />
                    <AlertTitle>File upload error(s)</AlertTitle>
                    <AlertDescription>
                        {errors.map((error, index) => (
                            <p key={index} className="last:mb-0">
                                {error}
                            </p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
