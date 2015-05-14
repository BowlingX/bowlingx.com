import OffCanvas from 'flexcss/src/main/OffCanvas';

global.document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'SidebarDarkener', -1).registerEvents();

    // init forms
    const
        desktopBreakpoint = 768,
        isSmall = window.innerWidth < desktopBreakpoint,
        header = isSmall ? document.getElementById('TopBar') : document.getElementById('Header'),
        logoBar = document.getElementById('Logo-bar'),
        logo = document.getElementById('Logo'),
        hero = document.getElementById('Hero'),
        heroContent = document.getElementById('HeroContent'),
        headerNavHeight = 50,
        headerHeight = header.getBoundingClientRect().height,
        isFrontPage = document.body.classList.contains('front-page'),
        // easing vars:
        scrollDownHeroDuration = isSmall ? headerHeight * 10 : headerHeight * 2,
        scrollDownHeroMax = isSmall ? 60 : 320;

    // easing function to use for parallax effects
    function easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }

    function easeOutQuad(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }

    function initScroll() {
        requestAnimationFrame(() => {
            const siteHeight = window.innerHeight,
                maxScroll = isFrontPage ? siteHeight + headerHeight - headerNavHeight : headerHeight - headerNavHeight;
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            scrollTop = Math.max(scrollTop < maxScroll ? scrollTop : maxScroll, 0);

            // 1) parallax calculations
            const opacityEase = easeInQuad(scrollTop, 0, 1, maxScroll),
                opacity = 1 - opacityEase,
                move = easeInQuad(scrollTop, 0, headerNavHeight, maxScroll),
                moveIn = headerNavHeight - easeInQuad(scrollTop, 0, headerNavHeight, maxScroll),
                angel = easeInQuad(scrollTop, 0, 12, maxScroll);

            // a) if there exists an hero page before
            if (hero && heroContent) {
                const startZero = Math.max(scrollTop - headerHeight, 0),
                    scrollTopHero = isSmall ? startZero : easeOutQuad(startZero, 0, siteHeight, siteHeight * 1.2),
                    opacity = 1 - easeOutQuad(startZero, 0, 1, maxScroll);
                hero.style.cssText += `
                transform:translate3d(0,-${scrollTopHero}px,0);
                -webkit-transform:translate3d(0,-${scrollTopHero}px,0);`;

                const scrollDownHeroContent = easeOutQuad(startZero, 0, scrollDownHeroMax, scrollDownHeroDuration);
                heroContent.style.cssText += `
                transform:translate3d(0,${scrollDownHeroContent}px,0);
                -webkit-transform:translate3d(0,${scrollDownHeroContent}px,0);
                opacity:${opacity};`;
            }

            // 2) apply to styles
            header.style.cssText += `
                transform:translate3d(0,-${scrollTop}px,0);
                -webkit-transform:translate3d(0,-${scrollTop}px,0);`;

            logo.style.cssText += `opacity:${opacity};
                transform:translate3d(0,${move}px,0);
                -webkit-transform:translate3d(0,${move}px,0);`;

            logoBar.style.cssText += `
            opacity:${opacityEase};
            transform:translateY(${moveIn}px) rotate(${angel * -1}deg) scale(.93);
            -webkit-transform:translateY(${moveIn}px) rotate(${angel * -1}deg) scale(.93);`;

        });
    }

    initScroll();
    global.window.addEventListener('scroll', initScroll, true);
});
