var PSC = (function () {
    'use strict';
    var
        WATTAGE = {
            led: [4, 8, 10, 12, 15, 22],  // W for led bulbs
            cfl: [7, 10, 13, 17, 23, 35],  // W for compact fluorescent bulbs
            hal: [20, 28, 42, 53, 70, 110],  // W for halogen bulbs
            inc: [25, 40, 60, 75, 100, 150]  // W for incandescent bulbs (standard type)
        },
        BRIGHTNESS = [249, 470, 806, 1055, 1521, 2050];   // BRIGHTNESS in Lm (lumens)

    return {
        /**
         * Returns an object which maps a given brightness to the power of equivalent (in brightness) bulbs of 4 different types
         * @param lm Given brightness in Lumens (lm)
         * @returns {Object} An object with the names of different light bulbs as properties and the corresponding wattages
         */
        getWattages: function (lm) {
            var index = -1, // the floor BRIGHTNESS index based on the given BRIGHTNESS values
                obj = {},   // the returnable object with the equivalent WATTAGE of all types
                action,     // action to be taken during iteration of types
                brightnessCount = BRIGHTNESS.length,
                maxBrightness = BRIGHTNESS[brightnessCount - 1],
                minBrightness = BRIGHTNESS[0],
                b1, b2, w1, w2;

            if ((index = BRIGHTNESS.indexOf(lm)) > -1) {
                action = "EXACT_VALUE";
            }
            else {
                // requested BRIGHTNESS higher than highest value in BRIGHTNESS array
                if (lm > maxBrightness) {
                    index = BRIGHTNESS.length - 1;
                    action = "EXTRAPOLATE_MAX";
                    b1 = BRIGHTNESS[brightnessCount - 2];
                    b2 = maxBrightness;
                }
                // requested BRIGHTNESS lower than lowest value in BRIGHTNESS array
                else if (lm < minBrightness) {
                    index = 0;
                    action = "EXTRAPOLATE_MIN";
                    b1 = minBrightness;
                    b2 = BRIGHTNESS[1];
                }
                // requested BRIGHTNESS in an intermediate range in BRIGHTNESS array
                else {
                    for (var i = brightnessCount - 2; i >= 0; i--) {
                        // found the range where req BRIGHTNESS lies (b1,b2)
                        if (lm > BRIGHTNESS[i]) {
                            action = "INTERPOLATE";
                            index = i;
                            b1 = BRIGHTNESS[index];
                            b2 = BRIGHTNESS[index + 1];
                            break;
                        }
                    }
                }
            }
            // Iterate over the available bulb types in the WATTAGE array
            Object.keys(WATTAGE).forEach(function (type) {
                if (action == 'EXACT_VALUE') {
                    obj[type] = WATTAGE[type][index];
                }
                else {
                    switch (action) {
                        case 'INTERPOLATE':
                            w1 = WATTAGE[type][index];
                            w2 = WATTAGE[type][index + 1];
                            break;
                        case 'EXTRAPOLATE_MIN':
                            w1 = WATTAGE[type][0];
                            w2 = WATTAGE[type][1];
                            break;
                        case 'EXTRAPOLATE_MAX':
                            w1 = WATTAGE[type][brightnessCount - 2];
                            w2 = WATTAGE[type][brightnessCount - 1];
                            break;
                        default:
                            throw new Error('Unexpected action: ' + action);
                    }
                    obj[type] = Math.floor(w1 + (lm - b1) / (b2 - b1) * (w2 - w1));
                }
            });
            return obj;
        },
        getBulbSaverData: function() {
			// TODO: implement the function which returns data for the bulb column

        }
    }
}());