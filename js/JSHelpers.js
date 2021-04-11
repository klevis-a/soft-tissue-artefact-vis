'use strict';

export function range(numElements) {
    return Array.from(Array(numElements).keys());
}

export function loadScript(src) {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script');
        script.src = src;

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));

        document.head.append(script);
    });
}

export function loadCsv(url, hasHeader = false) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: !(url instanceof File), dynamicTyping: true, skipEmptyLines: true, header: hasHeader,
            complete: results => {
                resolve(results)
            }
        });
    });
}
