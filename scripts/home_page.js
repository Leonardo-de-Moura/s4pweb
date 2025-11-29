const btn_explorar = document.querySelector("#btn-explorar");
const btn_mais = document.querySelector("#btn-mais");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

btn_explorar.addEventListener("click", () => {
	window.location.href = "index2.html"
})
btn_mais.addEventListener("click", () => {
	btn_mais.addEventListener("click", () => {
		document.querySelector(".section-artigos").scrollIntoView({ behavior: "smooth" });
	});

})



menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // impede fechar ao clicar no botão
  menuBtn.classList.toggle("active");
  nav.classList.toggle("active");
});

/* FECHAR AO CLICAR FORA */
document.addEventListener("click", (e) => {
  const clickedInsideMenu = nav.contains(e.target);
  const clickedButton = menuBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedButton) {
    menuBtn.classList.remove("active");
    nav.classList.remove("active");
  }
});
