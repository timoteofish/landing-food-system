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

