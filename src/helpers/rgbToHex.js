export default function rgbToHex(red, green, blue) {
    let r16 = red.toString(16);
    let g16 = green.toString(16);
    let b16 = blue.toString(16);

    if (red < 16) r16 = `0${r16}`;
    if (green < 16) g16 = `0${g16}`;
    if (blue < 16) b16 = `0${b16}`;

    return r16 + g16 + b16;
}
