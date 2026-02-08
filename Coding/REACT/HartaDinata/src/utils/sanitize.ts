import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true }, // Keep HTML structure
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'u', 'strong', 'em', 'a',
            'ul', 'ol', 'li', 'br', 'span', 'div', 'img', 'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'style', 'title'],
    });
};
