import { ref, watch } from "vue";
import tinycolor from "tinycolor2";

export function usePrimaryColor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return (url, cb) => {
        const defaultRGB = { r: 18, g: 18, b: 18 }

        const img = new Image;
        img.setAttribute('crossOrigin', '');
        img.src = url;
        img.onerror = () => {
            cb(`rgb(${defaultRGB.r}, ${defaultRGB.g}, ${defaultRGB.b})`);
        }
        img.onload = () => {
            let blockSize = 5, // only visit every 5 pixels
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

export function useInterpColor(color) {
    const interpColor = ref(color.value);

    const doingInterp = ref(false);
    const interpInitialColor = ref();
    const interpNewColor = ref();
    const interpAccumulator = ref(0);

    watch(color, (newColor, initialColor) => {
        if (doingInterp.value) {
            interpAccumulator.value = 0;
            interpInitialColor.value = interpColor.value;
            interpNewColor.value = newColor;
        } else {
            interpAccumulator.value = 0;
            interpInitialColor.value = initialColor;
            interpNewColor.value = newColor;
            animateColor();
        }
    });

    function animateColor(time = 0.3, refreshRate = 5) {
        doingInterp.value = true;
        const clear = setInterval(() => {
            const progress = (interpAccumulator.value / 1000) / time;
            if (progress >= 1) {
                clearInterval(clear);
                doingInterp.value = false;
            } else {
                interpAccumulator.value += refreshRate;
                interpColor.value = tinycolor.mix(interpInitialColor.value, interpNewColor.value, Math.floor(progress * 100));
            }
        }, refreshRate);
    }

    return interpColor;
}