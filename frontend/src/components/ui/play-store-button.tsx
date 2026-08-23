import { cn } from '@/lib/utils';
import React from 'react'
import '@/assets/store-icons/store-icons.css'

type StoreButtonProps = {
    href?: string;
    className?: string;
}

function PlayStoreButton({ href = '#', className = '' }: StoreButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            role="button"
            className={cn("bg-card flex border p-3 gap-1 bg-no-repeat hover:bg-slate-100", className)}
        >
            <span className='google-btn size-7 bg-contain'></span>
            <div className='flex flex-col justify-stretch'>
                <span className="text-xs text-muted-foreground leading-1 mt-1">
                    Download on the
                </span>

                <span className="text-base">
                    Google Play
                </span>
            </div>
        </a>
    )
}


function AppStoreButton({ href = '#', className = '' }: StoreButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            role="button"
            className={cn("bg-card flex border p-3 gap-1 bg-no-repeat hover:bg-slate-100", className)}
        >
            <span className='apple-btn size-8 bg-contain'></span>
            <div className='flex flex-col justify-stretch'>
                <span className="text-xs text-muted-foreground leading-1 mt-1">
                    Download on the
                </span>

                <span className="text-base">
                    App Store
                </span>
            </div>
        </a>
    )
}


export { PlayStoreButton, AppStoreButton }