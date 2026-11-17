const pageCurtain = document.querySelector(".page-curtain");

if (pageCurtain) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageCurtain.classList.add("page-curtain--opening"));
  });
}

// Header

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

// Footer

const legalContent = {
        termos: {
          title: "Termos de Uso",
          paragraphs: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ]
        },
        privacidade: {
          title: "Política de Privacidade",
          paragraphs: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          ]
        }
      };

const legalPanel = document.querySelector("#legal-panel");
const legalTitle = document.querySelector("#legal-title");
const legalBody = document.querySelector("#legal-content");
const legalButtons = document.querySelectorAll("[data-legal-tab]");
const closeLegalPanel = document.querySelector(".legal-close");

function closeLegal() {
    if (legalPanel?.open) legalPanel.close();
    legalButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

legalButtons.forEach((button) => {
        button.addEventListener("click", () => {
        const tab = button.dataset.legalTab;
        if (!legalPanel || !legalTitle || !legalBody || !legalContent[tab]) return;
        const isOpenTab = legalPanel.open && legalTitle.textContent === legalContent[tab].title;

        if (isOpenTab) {
            closeLegal();
            return;
        }

        legalTitle.textContent = legalContent[tab].title;
        legalBody.replaceChildren(
            ...legalContent[tab].paragraphs.map((text) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            return paragraph;
            })
        );
        legalPanel.showModal();
        legalButtons.forEach((item) => {
            item.setAttribute("aria-expanded", String(item === button));
        });
        });
});

legalPanel?.addEventListener("close", () => {
    legalButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
});

closeLegalPanel?.addEventListener("click", closeLegal);

// Page transition
const navigationCurtain = document.querySelector('.page-curtain');
const navigationReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin || destination.hash || !navigationCurtain) return;
        if (navigationReducedMotion.matches) return;

        event.preventDefault();
        navigationCurtain.classList.remove('page-curtain--opening');
        navigationCurtain.classList.add('page-curtain--closing');
        window.setTimeout(() => {
            window.location.href = destination.href;
        }, 700);
    });
});

// Contact panel
const contactPanel = document.querySelector('#contact-panel');
const contactButton = document.querySelector('.contact-button');
const contactClose = contactPanel?.querySelector('.contact-panel__close');
const contactForm = contactPanel?.querySelector('.contact-form');

contactButton?.addEventListener('click', () => {
    if (contactPanel && !contactPanel.open) contactPanel.showModal();
});
contactClose?.addEventListener('click', () => contactPanel?.close());
contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
});
contactPanel?.addEventListener('click', (event) => {
    if (event.target === contactPanel) contactPanel.close();
});

// Contact input validation
const contactMethodField = document.querySelector('#contact-method');
const contactValueField = document.querySelector('#contact-value');
const contactEmailGroup = document.querySelector('#contact-email-group');
const contactNumberGroup = document.querySelector('#contact-number-group');

function updateContactInput() {
    if (!contactMethodField || !contactValueField) return;

    const isEmail = contactMethodField.value === 'email';
    if (contactNumberGroup) contactNumberGroup.hidden = isEmail;
    if (contactEmailGroup) contactEmailGroup.hidden = !isEmail;
    contactValueField.type = isEmail ? 'email' : 'tel';
    contactValueField.inputMode = isEmail ? 'email' : 'numeric';
    contactValueField.pattern = isEmail ? '[^\\s@]+@[^\\s@]+\\.[^\\s@]+' : '.*';
    contactValueField.placeholder = isEmail ? 'Digite seu e-mail' : 'Digite apenas números';
    contactValueField.value = '';
}

contactMethodField?.addEventListener('change', updateContactInput);
const phoneFormats = {
    '+55': { groups: [2, 5, 4], separators: [' ', '-'] },
    '+1': { groups: [3, 3, 4], separators: [') ', '-'], prefix: '(' },
    '+351': { groups: [3, 3, 3], separators: [' ', ' '] },
    '+34': { groups: [3, 3, 3], separators: [' ', ' '] },
    '+33': { groups: [2, 2, 2, 2, 2], separators: [' ', ' ', ' ', ' '] },
    '+44': { groups: [4, 3, 4], separators: [' ', ' '] },
    '+49': { groups: [4, 4, 4], separators: [' ', ' '] },
    '+39': { groups: [3, 3, 4], separators: [' ', ' '] },
    '+81': { groups: [2, 4, 4], separators: ['-', '-'] },
    '+86': { groups: [3, 4, 4], separators: [' ', ' '] },
    '+52': { groups: [3, 3, 4], separators: [' ', ' '] },
    '+54': { groups: [2, 4, 4], separators: [' ', '-'] },
    '+56': { groups: [1, 4, 4], separators: [' ', ' '] },
    '+57': { groups: [3, 3, 4], separators: [' ', ' '] },
    '+58': { groups: [3, 3, 4], separators: [' ', ' '] },
    '+91': { groups: [5, 5], separators: [' '] },
    '+7': { groups: [3, 3, 2, 2], separators: [') ', '-', '-'], prefix: '(' },
    '+27': { groups: [2, 3, 4], separators: [' ', ' '] },
    '+61': { groups: [1, 4, 4], separators: [' ', ' '] },
    '+82': { groups: [2, 4, 4], separators: ['-', '-'] },
};

function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 15);
    const countryCode = document.querySelector('#country-code')?.value;
    const format = phoneFormats[countryCode];
    if (!format) return digits.replace(/(\d{3})(?=\d)/g, '$1 ');

    let result = '';
    let position = 0;
    format.groups.forEach((size, index) => {
        const part = digits.slice(position, position + size);
        if (!part) return;
        if (index > 0) result += format.separators[index - 1] || ' ';
        if (index === 0 && format.prefix) result += format.prefix;
        result += part;
        position += size;
    });
    return result;
}

contactValueField?.addEventListener('input', () => {
    if (contactMethodField?.value !== 'email') {
        contactValueField.value = formatPhoneNumber(contactValueField.value);
    }
});

document.querySelector('#country-code')?.addEventListener('change', () => {
    if (contactValueField && contactMethodField?.value !== 'email') {
        contactValueField.value = formatPhoneNumber(contactValueField.value);
    }
});

updateContactInput();
