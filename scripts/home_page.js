const btn_explorar = document.querySelector("#btn-explorar");
const btn_mais = document.querySelector("#btn-mais");

btn_explorar.addEventListener("click", () => {
	window.location.href = "index2.html"
})
btn_mais.addEventListener("click", () => {
	btn_mais.addEventListener("click", () => {
		document.querySelector(".section-artigos").scrollIntoView({ behavior: "smooth" });
	});

})
