export default function usePrimaryColor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return (url, cb) => {
        const img = new Image;
        img.setAttribute('crossOrigin', '');
        img.src = url;
        img.onload = () => {
            let blockSize = 5, // only visit every 5 pixels
                defaultRGB = { r: 0, g: 0, b: 0}, // for non-supporting envs
                data, width, height,
                i = -4,
                length,
                rgb = { r: 0, g: 0, b: 0 },
                count = 0;

            if (!ctx) {
                return defaultRGB;
            }

            height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
            width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

            ctx.drawImage(img, 0, 0);

            try {
                data = ctx.getImageData(0, 0, width, height);
            } catch(e) {
                /* security error, img on diff domain */
                console.error(e);
                return defaultRGB;
            }

            length = data.data.length;

            while ( (i += blockSize * 4) < length ) {
                ++count;
                rgb.r += data.data[i];
                rgb.g += data.data[i + 1];
                rgb.b += data.data[i + 2];
            }

            // ~~ used to floor values
            rgb.r = ~~(rgb.r / count);
            rgb.g = ~~(rgb.g / count);
            rgb.b = ~~(rgb.b / count);

            cb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        }
    }
}