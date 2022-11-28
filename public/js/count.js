let count_ten = document.querySelector(".main_banner .left_box .years_Count .count_ten");
let count_one = document.querySelector(".main_banner .left_box .years_Count .count_one");
let num_ten = 0;
let num_one = 0;

window.addEventListener("load", () => {
    let count_ten_act = setInterval (() => {
        if (num_ten >= 555) {
            clearInterval(count_ten_act);
        }
        else {
            num_ten = num_ten+1;
            count_ten.style.top = -num_ten + "px";
        }
    },5)

    let count_one_act = setInterval (() => {
        if (num_one >= 3607.5) {
            clearInterval(count_one_act);
        }
        else {
            num_one = num_one+5;
            count_one.style.top = -num_one + "px";
        }
    },1)
});