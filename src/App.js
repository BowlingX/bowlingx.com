import OffCanvas from 'flexcss/src/main/OffCanvas';

global.document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'SidebarDarkener', -1).registerEvents();

    // init forms
    const header          = document.getElementById('Header'),
        logoBar           = document.getElementById('Logo-bar'),
        logo              = document.getElementById('Logo'),
        maxScroll         = 150,
        desktopBreakpoint = 768,
        shouldScroll      = () => {
            return window.innerWidth >= desktopBreakpoint;
        };

    // easing function to use for parallax effects
    function easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }

    function initScroll() {
        if (!shouldScroll()) {
            if(header.style.cssText ||  logo.style.cssText) {
                header.style.cssText = '';
                logo.style.cssText = '';
            }
            return;
        }
        requestAnimationFrame(() => {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                scrollTop = Math.max(scrollTop < maxScroll ? scrollTop : maxScroll, 0);

            // 1) parallax calculations
            const  opacityEase = easeInQuad(scrollTop, 0, 1, maxScroll),
                   opacity   = 1 - opacityEase,
                   move     = easeInQuad(scrollTop, 0, 50, maxScroll),
                   moveIn   = 50 -easeInQuad(scrollTop, 0, 50, maxScroll),
                   angel    = easeInQuad(scrollTop, 0, 12, maxScroll);

            // 2) apply to styles
            header.style.cssText += `
                transform:translate3d(0,-${scrollTop}px,0);
                -webkit-transform:translate3d(0,-${scrollTop}px,0);`;

            logo.style.cssText += `opacity:${opacity};
                transform:translate3d(0,${move}px,0);
                -webkit-transform:translate3d(0,${move}px,0);`;

            logoBar.style.cssText += `
            opacity:${opacityEase};
            transform:translateY(${moveIn}px) rotate(${angel*-1}deg) scale(.93);
            -webkit-transform:translateY(${moveIn}px) rotate(${angel*-1}deg) scale(.93);`;
        });
    }

    initScroll();
    global.window.addEventListener('scroll', initScroll, true);
})
;