const left_menu = document.querySelectorAll("header .right_menu .left_box .sub_gnb li a");
const right_img = document.querySelectorAll("header .right_menu .right_box .img_box img");
const mobile_menu = document.querySelector("header .right_menu");
const ham_menu = document.querySelector("header .center .ham_gnb");

ham_menu.addEventListener("click",() => {
    ham_menu.classList.toggle("on");
    mobile_menu.classList.toggle("on");
    if(ham_menu.classList.contains("on")) {
        ham_menu.classList.remove("black");
        left_menu.forEach((item,index) => {
            item.addEventListener("mouseenter",() => {
                right_img.forEach((item, index) => {
                    item.classList.remove("show");
        
                });
                right_img[index].classList.add("show");
                mobile_menu.className = "right_menu on bg"+(index);
            });
        });
    }
    else {
        mobile_menu.classList.remove("on");
        if(window.scrollY == 0) {
            ham_menu.classList.remove("black");
        }
        else {
            ham_menu.classList.add("black");
        }
    }
});

