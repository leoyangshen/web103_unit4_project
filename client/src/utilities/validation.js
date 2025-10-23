/**
 * Checks for impossible or restricted combinations based on business rules.
 * @param {object} options - Car configuration options.
 * @returns {string | null} An error message if a combination is invalid, otherwise null.
 */
export const checkImpossibleCombo = (options) => {
    const { exterior_color, rim_style, interior_package } = options;

    // RULE 1: High-Tier Rims (Aero Carbon) MUST require the Premium Leather Interior.
    if (rim_style === 'Aero Carbon' && interior_package !== 'Premium Leather') {
        return "Aero Carbon rims require the Premium Leather interior package.";
    }

    // RULE 2: High-Tier Colors (Red options) MUST require at least the Sport rim style.
    if (
        (exterior_color === 'Cherry Red' || exterior_color === 'Solar Red') &&
        (rim_style === 'Standard Alloy')
    ) {
        return `The high-performance Red exterior colors require at least the Sport rim style.`;
    }

    // RULE 3: Deep Blue (Mid-Tier Color) requires at least the Sport rim style.
    if (exterior_color === 'Deep Blue' && rim_style === 'Standard Alloy') {
        return "Deep Blue exterior requires at least the Sport rim style.";
    }

    // If all checks pass
    return null;
};

