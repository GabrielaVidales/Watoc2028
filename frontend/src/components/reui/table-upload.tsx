import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { formatBytes, useFileUpload, type FileMetadata, type FileWithPreview, } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"
import { CircleAlertIcon, CloudUploadIcon, DownloadIcon, FileArchiveIcon, FileSpreadsheetIcon, FileTextIcon, HeadphonesIcon, ImageIcon, RefreshCwIcon, Trash2Icon, UploadIcon, VideoIcon, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Badge } from "../ui/badge"

interface FileUploadItem extends FileWithPreview {
    progress: number
    status: "uploading" | "completed" | "error"
    error?: string
}

interface TableUploadProps {
    maxFiles?: number
    maxSize?: number
    accept?: string
    multiple?: boolean
    className?: string
    onFilesChange?: (files: FileWithPreview[]) => void
    simulateUpload?: boolean
    defaultFiles?: FileMetadata[]
    icon?: LucideIcon
}

function TableFileUploader({
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024, // 5MB
    accept = "*",
    multiple = true,
    className,
    onFilesChange,
    simulateUpload = true,
    defaultFiles = [],
    icon: Icon = UploadIcon
}: TableUploadProps) {

    const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([])

    useEffect(() => {
        setUploadFiles(
            defaultFiles.map((file) => ({
                id: file.id,
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                } as File,
                preview: file.url,
                progress: 100,
                status: "completed",
            }))
        )
    }, [defaultFiles])

    const [
        { isDragging, errors },
        {
            removeFile,
            clearFiles,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            getInputProps,
        },
    ] = useFileUpload({
        maxFiles,
        maxSize,
        accept,
        multiple,
        initialFiles: defaultFiles,
        onFilesChange: (newFiles) => {
            // Convert to upload items when files change, preserving existing status
            const newUploadFiles = newFiles.map((file) => {
                // Check if this file already exists in uploadFiles
                const existingFile = uploadFiles.find(
                    (existing) => existing.id === file.id
                )

                if (existingFile) {
                    // Preserve existing file status and progress
                    return {
                        ...existingFile,
                        ...file, // Update any changed properties from the file
                    }
                } else {
                    // New file - set to uploading
                    return {
                        ...file,
                        progress: 0,
                        status: "uploading" as const,
                    }
                }
            })
            setUploadFiles(newUploadFiles)
            
            queueMicrotask(() => {
                onFilesChange?.(newFiles)
            })
        },
    })

    // Simulate upload progress
    useEffect(() => {
        if (!simulateUpload) return

        const interval = setInterval(() => {
            setUploadFiles((prev) =>
                prev.map((file) => {
                    if (file.status !== "uploading") return file

                    const increment = Math.random() * 15 + 5 // 5-20% increment
                    const newProgress = Math.min(file.progress + increment, 100)

                    if (newProgress >= 100) {
                        // Randomly decide if upload succeeds or fails
                        const shouldFail = Math.random() < 0.1 // 10% chance to fail
                        return {
                            ...file,
                            progress: 100,
                            status: shouldFail ? ("error" as const) : ("completed" as const),
                            error: shouldFail
                                ? "Upload failed. Please try again."
                                : undefined,
                        }
                    }

                    return { ...file, progress: newProgress }
                })
            )
        }, 100)

        return () => clearInterval(interval)
    }, [simulateUpload])

    const removeUploadFile = (fileId: string) => {
        setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
        removeFile(fileId)
    }

    const retryUpload = (fileId: string) => {
        setUploadFiles((prev) =>
            prev.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        progress: 0,
                        status: "uploading" as const,
                        error: undefined,
                    }
                    : file
            )
        )
    }

    const getFileIcon = (file: File | FileMetadata) => {
        const type = file instanceof File ? file.type : file.type
        if (type.startsWith("image/"))
            return (
                <ImageIcon className="size-4" />
            )
        if (type.startsWith("video/"))
            return (
                <VideoIcon className="size-4" />
            )
        if (type.startsWith("audio/"))
            return (
                <HeadphonesIcon className="size-4" />
            )
        if (type.includes("pdf"))
            return (
                <FileTextIcon className="size-4" />
            )
        if (type.includes("word") || type.includes("doc"))
            return (
                <FileTextIcon className="size-4" />
            )
        if (type.includes("excel") || type.includes("sheet"))
            return (
                <FileSpreadsheetIcon className="size-4" />
            )
        if (type.includes("zip") || type.includes("rar"))
            return (
                <FileArchiveIcon className="size-4" />
            )
        return (
            <FileTextIcon className="size-4" />
        )
    }

    const getFileTypeLabel = (file: File | FileMetadata) => {
        const type = file instanceof File ? file.type : file.type
        if (type.startsWith("image/")) return "Image"
        if (type.startsWith("video/")) return "Video"
        if (type.startsWith("audio/")) return "Audio"
        if (type.includes("pdf")) return "PDF"
        if (type.includes("word") || type.includes("doc")) return "Word"
        if (type.includes("excel") || type.includes("sheet")) return "Excel"
        if (type.includes("zip") || type.includes("rar")) return "Archive"
        if (type.includes("json")) return "JSON"
        if (type.includes("text")) return "Text"
        return "File"
    }

    const downloadFile = (fileItem: FileUploadItem) => {
        const link = document.createElement("a");
        link.href = fileItem.preview!;
        link.download = fileItem.file.name;
        link.target = "_blank";
        link.click();
    }

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Upload Area */}
            <div
                className={cn(
                    "relative group cursor-copy rounded-lg border-2 border-dashed p-6 text-center transition-colors bg-muted/50",
                    errors.length > 0
                        ? 'bg-destructive/5 border-destructive/50 dark:bg-destructive/20 dark:ring-destructive/50'
                        : isDragging
                            ? "border-primary-main bg-primary-light/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input {...getInputProps()} className="sr-only" />

                <div className="flex flex-col items-center gap-4">
                    <div
                        className={cn(
                            "cursor-pointer p-4 rounded-full shadow-sm ring-2 transition-all duration-300 group-hover:-translate-y-0.5",
                            errors.length > 0
                                ? 'bg-destructive/10 ring-destructive/50 dark:bg-destructive/20 dark:ring-destructive/50'
                                : isDragging
                                    ? 'ring-primary-main/50 bg-primary-light/5 dark:bg-blue-900/50'
                                    : 'ring-gray-200 border-muted-foreground/25 bg-muted hover:border-gray-300 dark:bg-neutral-800 dark:ring-neutral-700'
                        )}
                    >
                        <Icon className={cn(
                            'size-6 stroke-2',
                            errors.length > 0 ? 'text-red-600' : isDragging ? 'text-primary-main' : 'text-neutral-500',
                            errors.length > 0 ? 'dark:text-red-300' : isDragging ? 'text-primary-main' : 'dark:text-neutral-300',
                        )} />
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Drop files here or{" "}
                            <button
                                type="button"
                                className="text-primary cursor-pointer underline-offset-4 hover:underline"
                            >
                                browse files
                            </button>
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Maximum file size: {formatBytes(maxSize)} • Maximum files:{" "}
                            {maxFiles}
                        </p>
                    </div>
                </div>
            </div>

            {/* Files Table */}
            {uploadFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                            Files ({uploadFiles.length})
                        </h3>
                        <div className="flex gap-2">
                            <Button type="button" onClick={openFileDialog} variant="outline" size="sm">
                                <CloudUploadIcon className="h-4 w-4" />
                                Add files
                            </Button>
                            <Button type="button" onClick={clearFiles} variant="outline" size="sm">
                                <Trash2Icon className="h-4 w-4" />
                                Remove all
                            </Button>
                        </div>
                    </div>

                    <div className="w-full min-w-0 overflow-x-hidden rounded-lg border">
                        <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow className="text-xs">
                                    <TableHead className="h-9 ps-4">Name</TableHead>
                                    <TableHead className="h-9 ">Type</TableHead>
                                    <TableHead className="h-9 ">Size</TableHead>
                                    <TableHead className="h-9 w-25 ps-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {uploadFiles.map((fileItem) => (
                                    <TableRow key={fileItem.id}>
                                        <TableCell className="py-2 ps-1.5">
                                            <div className="flex min-w-0 items-center gap-1">
                                                <div
                                                    className={cn(
                                                        "text-muted-foreground/80 relative flex size-8 shrink-0 items-center justify-center"
                                                    )}
                                                >
                                                    {fileItem.status === "uploading" ? (
                                                        <div className="relative">
                                                            <svg
                                                                className="size-8 -rotate-90"
                                                                viewBox="0 0 32 32"
                                                            >
                                                                <circle
                                                                    cx="16"
                                                                    cy="16"
                                                                    r="14"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    className="text-muted-foreground/20"
                                                                />
                                                                <circle
                                                                    cx="16"
                                                                    cy="16"
                                                                    r="14"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeDasharray={`${2 * Math.PI * 14}`}
                                                                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - fileItem.progress / 100)}`}
                                                                    className="text-primary transition-all duration-300"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>

                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                {getFileIcon(fileItem.file)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex size-8 items-center justify-center">
                                                            {getFileIcon(fileItem.file)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex min-w-0 flex-1 items-center gap-1">
                                                    <p className="min-w-0 truncate text-sm font-medium" title={fileItem.file.name}>
                                                        {fileItem.file.name}
                                                    </p>

                                                    {fileItem.status === "error" && (
                                                        <Badge variant="destructive" className="shrink-0">
                                                            Error
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {getFileTypeLabel(fileItem.file)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground py-2 text-sm">
                                            {formatBytes(fileItem.file.size)}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <div className="flex items-center gap-1">
                                                {fileItem.preview && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-8"
                                                        onClick={() => downloadFile(fileItem)}
                                                    >
                                                        <DownloadIcon className="size-3.5" />
                                                    </Button>
                                                )}
                                                {fileItem.status === "error" ? (
                                                    <Button
                                                        type="button"
                                                        onClick={() => retryUpload(fileItem.id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive/80 hover:text-destructive size-8"
                                                    >
                                                        <RefreshCwIcon className="size-3.5" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeUploadFile(fileItem.id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <Trash2Icon className="size-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Error Messages */}
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

export default TableFileUploader