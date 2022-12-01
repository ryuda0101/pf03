let scTop;
let header = document.querySelector("header");
let ham_gnb_span = document.querySelectorAll("header .center .ham_gnb span");

window.addEventListener("load",() => {
    loadScTop = window.scrollY;
    if (loadScTop > 0) {
        header.style.background = "#fff";
        ham_menu.classList.add("black");
        header.querySelector(".logo img").setAttribute("src", "/img/logo_blue.png");
    }
});

window.addEventListener("scroll",() => {
    let scTop = window.scrollY;
    if(scTop == 0) {
        ham_menu.classList.remove("black");
        header.style.background = "transparent";
        header.querySelector(".logo img").setAttribute("src", "/img/logo.png");
    }
    else {
        header.style.background = "#fff"
        if (ham_menu.classList.contains("on")){
            ham_menu.classList.remove("black");
        }
        else {
            ham_menu.classList.add("black");
        }
        header.querySelector(".logo img").setAttribute("src", "/img/logo_blue.png");
    }
});