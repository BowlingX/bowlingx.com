import OffCanvas from 'flexcss/src/main/OffCanvas';

global.document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'SidebarDarkener', -1).registerEvents();
    // init forms
    const header = document.getElementById('Header'),
        logo = document.getElementById('Logo'), maxScroll = 150;

    function easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }

    function initScroll() {
        requestAnimationFrame(() => {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            scrollTop = Math.max(scrollTop < maxScroll ? scrollTop : maxScroll, 0);
            header.style.cssText += `
                transform:translate3d(0,-${scrollTop}px,0);
                -webkit-transform:translate3d(0,-${scrollTop}px,0);`;
            const opacity = 1 - easeInQuad(scrollTop, 0, 1, maxScroll),
                move = easeInQuad(scrollTop, 0, 50, maxScroll);

            logo.style.cssText += `opacity:${opacity};
                transform:translate3d(0,${move}px,0);
                -webkit-transform:translate3d(0,${move}px,0);
                `;
        });
    }

    initScroll();

    global.window.addEventListener('scroll', initScroll, true);
});