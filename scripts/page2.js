
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");


menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  menuBtn.classList.toggle("active");
  nav.classList.toggle("active");
  
  
});


document.addEventListener("click", (e) => {
  const clickedInsideMenu = nav.contains(e.target);
  const clickedButton = menuBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedButton) {
    menuBtn.classList.remove("active");
    nav.classList.remove("active");
  }
});
