'use client';

import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-10 md:mb-14 pb-10 md:pb-12 border-b border-border-light">
            <span className="text-slate-600 text-sm md:text-base font-semibold">Share:</span>

            {/* Twitter/X */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-light text-amber-900 hover:bg-amber-900 hover:text-cream hover:border-amber-900 transition-all duration-200 ease-in-out"
                title="Share on X"
                aria-label="Share this collection on X"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.759-5.868 6.759h-3.308l7.73-8.835L2.4 2.25h6.742l4.759 6.285L17.25 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            {/* Facebook */}
            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-light text-amber-900 hover:bg-amber-900 hover:text-cream hover:border-amber-900 transition-all duration-200 ease-in-out"
                title="Share on Facebook"
                aria-label="Share this collection on Facebook"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            </a>

            {/* WhatsApp */}
            <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-light text-amber-900 hover:bg-amber-900 hover:text-cream hover:border-amber-900 transition-all duration-200 ease-in-out"
                title="Share on WhatsApp"
                aria-label="Share this collection on WhatsApp"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a8.06 8.06 0 00-8.05 8.05 8.065 8.065 0 0013.007 6.41l.886-.457-2.867-1.468.718 2.299c.578.944.89 2.041.89 3.186 0 5.514-4.486 10-10 10S2 21.514 2 16 6.486 6 12 6c1.145 0 2.242.312 3.186.89l2.299.718-1.468-2.867.457.886A8.067 8.067 0 0012 8h-.004c-4.418 0-8.04 3.594-8.04 8.04z" />
                </svg>
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border-light text-amber-900 hover:bg-amber-900 hover:text-cream hover:border-amber-900 transition-all duration-200 ease-in-out"
                title="Copy link"
                aria-label="Copy collection link"
            >
                {copied ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                )}
            </button>

            {copied && <span className="text-xs md:text-sm text-slate-600">Copied!</span>}
        </div>
    );
}
