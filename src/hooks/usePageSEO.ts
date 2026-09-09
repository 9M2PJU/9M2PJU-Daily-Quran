import { useEffect } from 'react';

interface PageSEOProps {
    title: string;
    description?: string;
    canonical?: string;
    canonicalUrl?: string;
}

export const usePageSEO = ({ title, description, canonical, canonicalUrl }: PageSEOProps) => {
    useEffect(() => {
        const fullTitle = title.includes('9M2PJU') ? title : `${title} — 9M2PJU Daily Quran`;
        document.title = fullTitle;

        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
                ogDesc.setAttribute('content', description);
            }
            let twitterDesc = document.querySelector('meta[name="twitter:description"]');
            if (twitterDesc) {
                twitterDesc.setAttribute('content', description);
            }
        }

        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', fullTitle);
        }
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', fullTitle);
        }

        const resolvedCanonical = canonical || canonicalUrl;
        if (resolvedCanonical) {
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (linkCanonical) {
                linkCanonical.setAttribute('href', resolvedCanonical);
            }
        }
    }, [title, description, canonical, canonicalUrl]);
};
