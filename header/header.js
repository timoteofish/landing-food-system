const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const pulseColor = '#c90018';
let animationTimer;
let activeAnimations = [];
let brand;
let brandIcon;
let brandLetters = [];

function animateIconNudge() {
    return brandIcon.animate(
        [
            { transform: 'rotate(0deg) scale(1)', offset: 0 },
            { transform: 'rotate(-7deg) scale(1.05)', offset: 0.035 },
            { transform: 'rotate(6deg) scale(1.05)', offset: 0.07 },
            { transform: 'rotate(-4deg) scale(1.03)', offset: 0.105 },
            { transform: 'rotate(2deg) scale(1.01)', offset: 0.14 },
            { transform: 'rotate(0deg) scale(1)', offset: 0.18 },
            { transform: 'rotate(0deg) scale(1)', offset: 1 },
        ],
        { duration: 810, easing: 'ease-in-out' },
    );
}

function animateLetter(letter) {
    return letter.animate(
        [
            { color: '#252525', transform: 'scale(1)' },
            { color: pulseColor, transform: 'scale(1.28)', offset: 0.35 },
            { color: '#252525', transform: 'scale(1)', offset: 1 },
        ],
        { duration: 420, easing: 'ease-in-out' },
    );
}

async function runBrandAnimation() {
    if (reducedMotion.matches) return;

    activeAnimations = [animateIconNudge()];
    try {
        await activeAnimations[0].finished;
    } catch {
        return;
    }

    for (const letter of brandLetters) {
        if (reducedMotion.matches) return;
        const animation = animateLetter(letter);
        activeAnimations.push(animation);
        try {
            await animation.finished;
        } catch {
            return;
        }
    }

    if (!reducedMotion.matches) {
        animationTimer = window.setTimeout(runBrandAnimation, 4500);
    }
}

reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
        window.clearTimeout(animationTimer);
        activeAnimations.forEach((animation) => animation.cancel());
        activeAnimations = [];
    } else {
        runBrandAnimation();
    }
});

function setupBrand() {
    brand = document.querySelector('.brand');
    brandIcon = document.querySelector('.brand img');
    brandLetters = [...document.querySelectorAll('.brand-name span')];
    if (!brand || !brandIcon) return;

    runBrandAnimation();
    brand.addEventListener('click', () => {
    if (reducedMotion.matches) return;

    const clickAnimation = brandIcon.animate(
        [
            { transform: 'rotate(0deg) scale(1)' },
            { transform: 'rotate(-9deg) scale(1.08)', offset: 0.35 },
            { transform: 'rotate(8deg) scale(1.08)', offset: 0.7 },
            { transform: 'rotate(0deg) scale(1)' },
        ],
        { duration: 420, easing: 'ease-out' },
    );
    clickAnimation.finished.then(() => {
        brandLetters.reduce((sequence, letter) => sequence.then(() => animateLetter(letter).finished), Promise.resolve());
    }).catch(() => {});
    });
}

function setupMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerMenu = document.querySelector('.header-menu');
    if (!menuToggle || !headerMenu) return;

    menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    headerMenu?.classList.toggle('is-open', !isOpen);
    });

    headerMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Abrir menu');
        headerMenu.classList.remove('is-open');
    });
    });
}



setupBrand();
setupMenu();
