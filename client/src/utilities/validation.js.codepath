/**
 * Checks for specific illegal combinations.
 * @param {object} car - The car state object containing all selected options.
 * @returns {string} An error message if invalid, or an empty string if valid.
 */
export const checkImpossibleCombo = (car) => {
    const { rim_style, interior_package } = car;

    // RULE: Aero Carbon Rims require the Premium Leather interior. 
    // This is illegal if the user picks 'Aero Carbon' AND 'Standard Cloth'.
    if (rim_style === 'Aero Carbon' && interior_package === 'Standard Cloth') {
        return "Aero Carbon Rims require the Premium Leather interior package for structural and safety compliance.";
    }
    
    // Add other rules here if needed...

    // Return an empty string if the configuration is valid
    return '';
};

