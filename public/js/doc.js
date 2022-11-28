let doc = document.querySelectorAll(".doc_wrap .center .doc_boxs .left_box >div");
let doc_box = document.querySelectorAll(".doc_wrap .center .doc_boxs .right_box .box");


doc.forEach((item, index) => {
    item.addEventListener("click",() => {
        doc.forEach((item, index) => {
            item.classList.remove("on");
        });
        doc_box.forEach((item, index) => {
            item.classList.remove("box_on");
            // item.style.right = 0;
        });
        item.classList.add("on");
        doc_box[index].classList.add("box_on");
        // doc_box[index].style.right = (-730 * index) + "px"
    });
});