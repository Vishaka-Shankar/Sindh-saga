/**
 * piiScrubService.ts — PII Scrubbing for COPPA 2025 Compliance
 *
 * This service provides functions to detect and remove personally identifiable information (PII)
 * from text to ensure compliance with COPPA 2025 regulations for children's data protection.
 *
 * The scrubbing process removes:
 * - Phone numbers (Pakistani formats)
 * - Email addresses
 * - National ID numbers (CNIC)
 * - Names (English and Sindhi patterns)
 * - Address information
 */

/**
 * Scrub personally identifiable information from text.
 *
 * Applies regex replacements in order to remove PII patterns.
 * Each replacement is documented with the pattern it matches.
 *
 * @param text - Text to scrub for PII
 * @returns Text with PII replaced by placeholder markers
 */
export function scrubPII(text: string): string {
  let scrubbed = text;

  // Pakistani mobile numbers: 0 followed by 3, then 9 digits (e.g., 03001234567)
  scrubbed = scrubbed.replace(/0[3][0-9]{9}/g, '[PHONE REMOVED]');

  // International Pakistani format: +92 followed by 10 digits (e.g., +923001234567)
  scrubbed = scrubbed.replace(/\+92[0-9]{10}/g, '[PHONE REMOVED]');

  // Email addresses: standard email pattern (e.g., user@example.com)
  scrubbed = scrubbed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REMOVED]');

  // CNIC format: 5 digits, hyphen, 7 digits, hyphen, 1 digit (e.g., 12345-1234567-1)
  scrubbed = scrubbed.replace(/[0-9]{5}-[0-9]{7}-[0-9]/g, '[ID REMOVED]');

  // English name pattern: "my name is [word]" (case-insensitive)
  scrubbed = scrubbed.replace(/my name is \w+/gi, '[NAME REMOVED]');

  // Sindhi name pattern: "mera naam [word]" (case-insensitive)
  scrubbed = scrubbed.replace(/mera naam \w+/gi, '[NAME REMOVED]');

  // Urdu/Hindi name pattern: "main [Name]" where Name starts with capital letter
  scrubbed = scrubbed.replace(/main [A-Z][a-z]+/g, '[NAME REMOVED]');

  // House/Plot addresses: house, plot, h.no, flat followed by numbers (case-insensitive)
  scrubbed = scrubbed.replace(/(?:house|plot|h\.no|flat)\s*#?\s*\d+/gi, '[ADDRESS REMOVED]');

  // Block/Sector addresses: block or sector followed by alphanumeric identifier (case-insensitive)
  scrubbed = scrubbed.replace(/(?:block|sector)\s+[A-Za-z0-9-]+/gi, '[ADDRESS REMOVED]');

  return scrubbed;
}

/**
 * Check if text contains any PII patterns.
 *
 * Tests the text against all PII regex patterns before scrubbing.
 *
 * @param text - Text to check for PII
 * @returns true if any PII patterns are detected, false otherwise
 */
export function hasPII(text: string): boolean {
  // Pakistani mobile numbers
  if (/0[3][0-9]{9}/.test(text)) return true;

  // International Pakistani format
  if (/\+92[0-9]{10}/.test(text)) return true;

  // Email addresses
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) return true;

  // CNIC format
  if (/[0-9]{5}-[0-9]{7}-[0-9]/.test(text)) return true;

  // English name pattern
  if (/my name is \w+/i.test(text)) return true;

  // Sindhi name pattern
  if (/mera naam \w+/i.test(text)) return true;

  // Urdu/Hindi name pattern
  if (/main [A-Z][a-z]+/.test(text)) return true;

  // House/Plot addresses
  if (/(?:house|plot|h\.no|flat)\s*#?\s*\d+/i.test(text)) return true;

  // Block/Sector addresses
  if (/(?:block|sector)\s+[A-Za-z0-9-]+/i.test(text)) return true;

  return false;
}
