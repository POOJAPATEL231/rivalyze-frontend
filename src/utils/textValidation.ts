/** Rejects any HTML-tag-like content, script/javascript URIs, and inline
 * event-handler attributes — used to keep free-text fields from carrying
 * markup into the backend or into any future unescaped render path. */
const UNSAFE_MARKUP_PATTERN = /<\s*\/?[a-z!][\s\S]*>|javascript:|on\w+\s*=/i;

const DOMAIN_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})+$/i;

export function hasUnsafeMarkup(value: string): boolean {
    return UNSAFE_MARKUP_PATTERN.test(value);
}

export function isValidDomain(value: string): boolean {
    return DOMAIN_PATTERN.test(value);
}
