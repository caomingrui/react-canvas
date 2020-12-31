/**
 * rgb 转 hsl
 * */
export function rgbToHsl(r, g, b) {
    // eslint-disable-next-line no-unused-expressions
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min){
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}


/**
 * hsl 转 rgb
 * */
export const hslToRgb = (h, s, l) => {
    let r, g, b;
    if(s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255),Math.round(g * 255),Math.round(b * 255)];
}

/**
 * 颜色转换 - 16进制转换成rgb
 * @param { string } h -> '#cccccc'
 * */
export const HexToRgb = (h, rgb = false) => {
    const dd = Number(h.replace('#', '0x'));
    const r = dd >> 16;
    const g = dd >> 8 & 0xff;
    const b = dd & 0xff;
    if (rgb) {
        return [r, g, b]
    }
    else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}


export const changePic = (img, pic, scope, color = null, opacity = 1, num) => {
    console.log(scope)
    // const img = document.createElement('img')
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    console.log(img)
    img.onload = function(){
        let w = this.width
        let h = this.height
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data

        for (let i = 0, l = data.length; i < l; i += 4) {
            let hsl = rgbToHsl(data[i], data[i + 1], data[i + 2]);
            if (hsl[0] > scope[0] && hsl[0] < scope[1]) { // .41 .45
                hsl[0] += 0.44
                hsl[1] += 0.1 //调整亮度
                hsl[2] += 0.4
                let rgb = color!=null?color: hslToRgb.apply(this, hsl);
                data[i] = rgb[0] + num
                data[i + 1] = rgb[1] + num
                data[i + 2] = rgb[2] + num
                if (opacity == 0) {
                    data[i + 3] = opacity
                }
            }
        }
        ctx.putImageData(imageData, 0, 0, 0, 0, w, h)
    }
    img.src = pic
}
