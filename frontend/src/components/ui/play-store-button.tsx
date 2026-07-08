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
            className={cn("market-btn google-btn", className)}
        >
            <span className="market-button-subtitle">
                Download on the
            </span>

            <span className="market-button-title">
                Google Play
            </span>
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
            className={cn("market-btn apple-btn", className)}
        >
            <span className="market-button-subtitle">Download on the</span>
            <span className="market-button-title">App Store</span>
        </a>
    )
}


export { PlayStoreButton, AppStoreButton }