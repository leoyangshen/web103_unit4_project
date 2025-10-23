/**
 * Calculates the total price of the customized car based on selected options.
 * @param {object} options - Car configuration options.
 * @returns {number} The total price in USD.
 */
export const calculateTotalPrice = (options) => {
    // Base price of the car
    let totalPrice = 10000; 

    // Destructure options for cleaner access
    const { exterior_color, rim_style, interior_package } = options;

    console.log("DEBUG: CALCULATOR - Calculating price for:", { exterior_color, rim_style, interior_package });

    // --- 1. Exterior Color Pricing ---
    switch (exterior_color) {
        case 'Deep Blue':
            totalPrice += 1000;
            break;
        case 'Cherry Red':
        case 'Solar Red':
            totalPrice += 2500;
            break;
        // Midnight Silver (default/base, cost 0)
    }

    // --- 2. Rim Style Pricing ---
    switch (rim_style) {
        case 'Sport':
            totalPrice += 1500;
            break;
        case 'Aero Carbon':
            totalPrice += 5000; // <--- This was the likely culprit being skipped
            break;
        // Standard Alloy (default/base, cost 0)
    }

    // --- 3. Interior Package Pricing ---
    switch (interior_package) {
        case 'Premium Leather':
            totalPrice += 2000;
            break;
        // Standard Cloth (default/base, cost 0)
    }

    console.log("DEBUG: CALCULATOR - Final calculated price:", totalPrice);
    return totalPrice;
};

