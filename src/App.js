/* global clearTimeout*/

'use strict';

import {OffCanvas, Form, Modal, Settings, Util, Widget} from 'flexcss';

global.document.addEventListener('DOMContentLoaded', () => {

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'SidebarDarkener', -1).registerEvents();
    Form.init('form', {fetchOptions: {includeCredentials: false}});

    Settings.setup({scrollbarUpdateNodes: [document.body, document.getElementById('Header')]});
    new Modal(document.body, {fixedContainer: false}).registerEvents();

    let isSmall, header, scrollDownHeroDuration, headerHeight, siteHeight;
    const
        desktopBreakpoint = 768,
        logoBar = document.getElementById('Logo-bar'),
        logo = document.getElementById('Logo'),
        hero = document.getElementById('Hero'),
        heroContent = document.getElementById('HeroContent'),
        headerNavHeight = 50,
        stageElement = document.getElementById('Stage'),
        isHeroPage = document.body.classList.contains('hero-page'),
    // easing vars:
        scrollDownHeroMax = 320;

    document.addEventListener('flexcss.form.ajaxCompleted', function (e) {
        // reset form:
        const form = e.detail.originalEvent.target;
        form.reset();
        // close modal:
        let modalContainer = Util.parentsUntil(form, (n) => n.classList.contains('modal')),
            modal = Widget.findWidget(modalContainer);
        modal.fromWidget(document.getElementById('contact-success'));
    });

    function calcScreenDelta() {
        const topBar = document.getElementById('TopBar'), headerBar = document.getElementById('Header');
        isSmall = window.innerWidth < desktopBreakpoint;
        header = isSmall ? topBar : headerBar;
        headerHeight = header.getBoundingClientRect().height;
        siteHeight = window.innerHeight;
        scrollDownHeroDuration = isSmall ? headerHeight * 20 : headerHeight * 2;
        if (isSmall) {
            headerBar.style.cssText = '';
        } else {
            topBar.style.cssText = '';
        }
    }

    // detect screen size changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calcScreenDelta();
            initScroll(window.pageYOffset);
        }, 250);
    });

    // easing function to use for parallax effects
    function easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }

    function easeOutQuad(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }

    const cls = document.documentElement.classList;

    if (stageElement) {
        // detect animation ready
        document.addEventListener('compositionReady', () => {
            cls.add('composition-ready');
        }, true);
    } else {
        cls.add('composition-ready');
        cls.add('without-stage');
    }

    let lastPosition = window.pageYOffset;


    function initScroll(scrollTop) {
        // checkout: http://www.html5rocks.com/en/tutorials/speed/animations/
        // 0) calculations based on scrollTop
        // unfortunately we need to request the inner height here because on android/ios devices
        // the viewport changes when scrolling:

        const maxScroll = isHeroPage ? siteHeight + headerHeight - headerNavHeight : headerHeight - headerNavHeight;
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
                scrollTopHero = isSmall ? startZero + 1 : easeOutQuad(startZero, 0, siteHeight, siteHeight * 1.2),
                heroOpacity = 1 - easeOutQuad(startZero, 0, 1, isSmall ? maxScroll * 1.5 : maxScroll);
            hero.style.cssText += `
                transform:translate3d(0,-${scrollTopHero}px,0);
                -webkit-transform:translate3d(0,-${scrollTopHero}px,0);`;

            const scrollDownHeroContent = easeOutQuad(startZero, 0, scrollDownHeroMax, scrollDownHeroDuration);
            heroContent.style.cssText += `
                transform:translate3d(0,${scrollDownHeroContent}px,0);
                -webkit-transform:translate3d(0,${scrollDownHeroContent}px,0);
                opacity:${heroOpacity};`;
        }

        // b) if the screen is not small, we move the logo around
        if (!isSmall) {
            logo.style.cssText += `opacity:${opacity};
                transform:translate3d(0,${move}px,0);
                -webkit-transform:translate3d(0,${move}px,0);`;

            // we scale down the logo a little bit so it does not appear blurry in chrome
            logoBar.style.cssText += `
            opacity:${opacityEase};
            transform:translateY(${moveIn}px) rotate(${angel * -1}deg) scale(.93);
            -webkit-transform:translateY(${moveIn}px) rotate(${angel * -1}deg) scale(.93);`;
        }
        // 2) apply to styles
        header.style.cssText += `
                transform:translate3d(0,-${scrollTop}px,0);
                -webkit-transform:translate3d(0,-${scrollTop}px,0);`;
    }

    function animationLoop() {
        // Avoid calculations if not needed
        const pos = window.pageYOffset;
        if (lastPosition === pos) {
            requestAnimationFrame(animationLoop);
            return false;
        } else lastPosition = pos;

        initScroll(lastPosition);

        requestAnimationFrame(animationLoop);
    }

    calcScreenDelta();
    initScroll(lastPosition);
    animationLoop();
});
