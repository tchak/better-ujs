import { getMetaContent } from './dom';

// Content-Security-Policy nonce for inline scripts
export function cspNonce() {
  return getMetaContent('csp-nonce');
}
