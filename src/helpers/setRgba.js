function isValidRGBValue(value) {
    return (typeof (value) === 'number' && Number.isNaN(value) === false && value >= 0 && value <= 255);
}

export default function setRGBA(red, green, blue, alpha) {
    if (isValidRGBValue(red) && isValidRGBValue(green) && isValidRGBValue(blue)) {
        const color = {
            red: red | 0,
            green: green | 0,
            blue: blue | 0,
        };

        if (isValidRGBValue(alpha) === true) {
            color.alpha = alpha | 0;
        }

        // RGBToHSL(color.r, color.g, color.b);

        return color;
    }
}
