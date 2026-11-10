const landingImage = document.querySelector(".landing__image");
const landingLoader = document.querySelector(".landing__loader");

const revealLoader = () => landingLoader?.classList.add("is-visible");

const revealImage = () => {
  requestAnimationFrame(() => {
    landingImage?.classList.add("is-visible");

    if (!landingImage) {
      revealLoader();
      return;
    }

    const imageTransition = getComputedStyle(landingImage).transitionDuration
      .split(",")
      .map((duration) => duration.trim())
      .map((duration) =>
        duration.endsWith("ms")
          ? Number.parseFloat(duration)
          : Number.parseFloat(duration) * 1000,
      );
    const transitionEnd = Math.max(...imageTransition, 0);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches || transitionEnd === 0) {
      revealLoader();
    } else {
      landingImage.addEventListener("transitionend", revealLoader, { once: true });
    }
  });
};

if (landingImage) {
  if (landingImage.complete) {
    revealImage();
  } else {
    landingImage.addEventListener("load", revealImage, { once: true });
    landingImage.addEventListener(
      "error",
      () => landingImage.classList.add("is-visible"),
      { once: true },
    );
  }
}
