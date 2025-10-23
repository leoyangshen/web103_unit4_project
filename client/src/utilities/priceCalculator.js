/**
 * Calculates the total price of a custom car configuration based on selected options.
 * * @param {object} carOptions - Object containing selected options.
 * @param {string} carOptions.color - Exterior color selected.
 * @param {string} carOptions.rims - Rim style selected.
 * @param {string} carOptions.package - Interior package selected.
 * @returns {number} The total price in USD.
 */
export const calculateTotalPrice = (carOptions) => {
    // Base price for the "Bolt Bucket" model
    let totalPrice = 10000;

    // --- Add Exterior Color Cost ---
    switch (carOptions.color) {
        case 'Deep Blue':
            totalPrice += 1000;
            break;
        case 'Cherry Red':
        case 'Solar Red': // Both high-tier reds cost the same premium
            totalPrice += 2500;
            break;
        // 'Midnight Silver' adds 0 (default/standard)
    }

    // --- Add Rim Style Cost ---
    switch (carOptions.rims) {
        case 'Sport':
            totalPrice += 1500;
            break;
        case 'Aero Carbon':
            totalPrice += 5000;
            break;
        // 'Standard Alloy' adds 0
    }

    // --- Add Interior Package Cost ---
    switch (carOptions.package) {
        case 'Premium Leather':
            totalPrice += 2000;
            break;
        // 'Standard Cloth' adds 0
    }
    
    // Always return a number
    return totalPrice;
};

