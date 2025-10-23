/**
 * Checks for impossible or restricted combinations based on business rules.
 * @param {object} options - Car configuration options.
 * @param {string} options.exterior_color - Exterior color selected.
 * @param {string} options.rim_style - Rim style selected.
 * @param {string} options.interior_package - Interior package selected.
 * @returns {string | null} An error message if a combination is invalid, otherwise null.
 */
export const checkImpossibleCombo = (options) => {
    const { item_name, exterior_color, rim_style, interior_package } = options;

    console.log("DEBUG: VALIDATION - Checking combo:", { exterior_color, rim_style, interior_package });

    // Check for car name presence (basic validation)
    if (!item_name || item_name.trim() === '') {
        console.log("DEBUG: VALIDATION - Returned: Car Name required.");
        return "Car Name cannot be empty.";
    }

    // RULE 1: High-Tier Rims (Aero Carbon) MUST require the Premium Leather Interior.
    if (rim_style === 'Aero Carbon' && interior_package !== 'Premium Leather') {
        const error = "Aero Carbon rims require the Premium Leather interior package.";
        console.log("DEBUG: VALIDATION - Returned:", error);
        return error;
    }

    // RULE 2: High-Tier Colors (Red options) MUST require at least the Sport rim style.
    if (
        (exterior_color === 'Cherry Red' || exterior_color === 'Solar Red') &&
        (rim_style === 'Standard Alloy')
    ) {
        const error = `The high-performance Red exterior colors require at least the Sport rim style.`;
        console.log("DEBUG: VALIDATION - Returned:", error);
        return error;
    }

    // RULE 3: Mid-Tier Color (Deep Blue) requires at least the Sport rim style.
    if (exterior_color === 'Deep Blue' && rim_style === 'Standard Alloy') {
        const error = "Deep Blue exterior requires at least the Sport rim style.";
        console.log("DEBUG: VALIDATION - Returned:", error);
        return error;
    }

    // If all checks pass, return null (no error)
    console.log("DEBUG: VALIDATION - Returned: null (Valid Combo)");
    return null;
};

