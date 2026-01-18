/**
 * Converts a hex color string to an RGBA string with the specified opacity.
 * @param hex The hex color string (e.g., "#FFFFFF" or "FFFFFF")
 * @param opacity The opacity value (0 to 1)
 * @returns The RGBA string (e.g., "rgba(255, 255, 255, 0.5)")
 */
export function hexToRgba(hex: string, opacity: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    // Fallback if invalid hex
    return hex;
}
