export const debounce = (callback, timer = 1000,timeRef, immediate = false) => {
    if(typeof callback === "function" && timeRef && Object.keys(timeRef).some(key => key === "current")) return (...args) => {
        if (immediate) {
            return callback(...args);
        } else {
            if (timeRef.current) {
                clearTimeout(timeRef.current);
            }
            timeRef.current = setTimeout(() => {
                return callback(...args);
            }, Number(timer));
        }
    }
}