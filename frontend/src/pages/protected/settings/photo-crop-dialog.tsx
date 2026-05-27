import { useRef, useState } from "react";
import { centerCrop, makeAspectCrop, ReactCrop, type Crop, type PixelCrop } from "react-image-crop";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean
    image: string
    onClose: () => void
    onConfirm: (file: File) => void
}

export function PhotoCropDialog({ open, image, onClose, onConfirm }: Props) {

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const imgRef = useRef<HTMLImageElement>(null);

    const handleConfirm = async () => {
        if (!imgRef.current || !completedCrop) return;

        const canvas = document.createElement('canvas');

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const scaleX =
            imgRef.current.naturalWidth / imgRef.current.width;

        const scaleY =
            imgRef.current.naturalHeight / imgRef.current.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        canvas.toBlob((blob) => {
            if (!blob) return;

            const file = new File(
                [blob],
                'cropped.webp',
                { type: 'image/webp' }
            );

            onConfirm(file);
        }, 'image/webp');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Crop Your Photo
                    </DialogTitle>

                    <DialogDescription>
                        Drag and scale to fit the desired dimensions.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative flex items-center justify-center bg-gray-300 rounded-md border-2 border-gray-500 overflow-hidden">

                    <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        onComplete={setCompletedCrop}
                        className="max-h-90 flex items-center justify-center"
                    >
                        <img
                            ref={imgRef}
                            src={image}
                            className="max-h-40 w-auto object-contain"
                            onLoad={(e) => {
                                const { width, height } = e.currentTarget;

                                setCrop(
                                    centerCrop(
                                        makeAspectCrop(
                                            {
                                                unit: '%',
                                                width: 90
                                            },
                                            1,
                                            width,
                                            height
                                        ),
                                        width,
                                        height
                                    )
                                );
                            }}
                        />
                    </ReactCrop>

                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        type={'button'}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type={'button'}
                        onClick={handleConfirm}
                    >
                        Crop image
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}