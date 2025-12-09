const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

// As divs que precisam sumir quando o menu abrir
const div1 = document.querySelector(".image-container");
const div2 = document.querySelector(".title-container");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  menuBtn.classList.toggle("active");
  nav.classList.toggle("active");

  // Esconde/mostra as divs
  const menuOpen = menuBtn.classList.contains("active");

  if (menuOpen) {
    div1.style.display = "none";
    div2.style.display = "none";
  } else {
    div1.style.display = "";
    div2.style.display = "";
  }
});

document.addEventListener("click", (e) => {
  const clickedInsideMenu = nav.contains(e.target);
  const clickedButton = menuBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedButton) {
    menuBtn.classList.remove("active");
    nav.classList.remove("active");

    // Reexibe as divs quando o menu fechar
    div1.style.display = "";
    div2.style.display = "";
  }
});
 