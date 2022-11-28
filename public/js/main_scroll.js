let scTop;
let header = document.querySelector("header");

window.addEventListener("scroll",() => {
    let scTop = window.scrollY;
    if(scTop == 0) {
        header.style.background = "transparent"
        header.querySelector(".logo img").setAttribute("src", "/img/logo.png");
    }
    else {
        header.style.background = "#fff"
        header.querySelector(".logo img").setAttribute("src", "/img/logo_blue.png");
    }
});

