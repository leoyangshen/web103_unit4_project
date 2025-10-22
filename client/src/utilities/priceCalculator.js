/**
 * Calculates the total price of the custom car based on the selected options.
 * @param {object} car - The car state object containing all selected options.
 * @returns {number} The final calculated price.
 */
export const calculateTotalPrice = (car) => {
    // Start with the mandatory base price for the car chassis and components
    let total = 10000;

    // --- Rim Style Upgrades ---
    if (car.rim_style === 'Sport') {
        total += 1500;
    } else if (car.rim_style === 'Aero Carbon') {
        total += 5000;
    }

    // --- Interior Package Upgrades ---
    if (car.interior_package === 'Premium Leather') {
        total += 2000;
    }

    return total;
};

/**
 * Checks for specific illegal combinations.
 * @param {object} car - The car state object.
 * @returns {string} An error message if invalid, or an empty string if valid.
 */
export const checkImpossibleCombo = (car) => {
    const { rim_style, interior_package } = car;

    // RULE: Aero Carbon Rims require Premium Leather.
    if (rim_style === 'Aero Carbon' && interior_package === 'Standard Cloth') {
        return "Aero Carbon Rims require the Premium Leather interior package for safety reasons.";
    }
    
    // Add more rules here if needed...

    // Return an empty string if the configuration is valid
    return '';
};

