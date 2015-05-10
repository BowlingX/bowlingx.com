import OffCanvas from 'flexcss/src/main/OffCanvas';

global.document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'SidebarDarkener', -1).registerEvents();
    // init forms
    const header = document.getElementById('Header'), maxScroll = 150;


    function initScroll() {
        requestAnimationFrame(() => {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            scrollTop = Math.max(scrollTop < maxScroll? scrollTop : maxScroll,0);
                header.style.cssText += `
                transform:translate3d(0,-${scrollTop}px,0);
                -webkit-transform:translate3d(0,-${scrollTop}px,0);`;
        })
    }

    initScroll();

    global.window.addEventListener('scroll', initScroll, true);
});