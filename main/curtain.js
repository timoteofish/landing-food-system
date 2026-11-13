const pageCurtain = document.querySelector(".page-curtain");

if (pageCurtain) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageCurtain.classList.add("page-curtain--opening"));
  });
}
