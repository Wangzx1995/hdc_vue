
let d_timeout = null;
let t_permit = true;
/* 防抖 */
function debounce(fn, time) {
    if (d_timeout) {
        window.clearTimeout(d_timeout);
        d_timeout = null;
        d_timeout = setTimeout(() => {
            fn();
        }, time);
    }
    else {
        d_timeout = setTimeout(() => {
            fn();
        }, time);
    }
}
/* 节流 */
function throttle(fn, time) {
    if (t_permit) {
        t_permit = false;
        fn();
        setTimeout(() => {
            t_permit = true;
        }, time);
    }
}
export {
    debounce,
    throttle
}