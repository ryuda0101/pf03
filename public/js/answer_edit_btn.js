let edit_btn = document.querySelectorAll(".result_box .answer_btns .edit");
let cancel_btn = document.querySelectorAll(".result_box .answer_edit_box .cancel");

const edit_box = document.querySelectorAll(".result_box .answer_edit_box");

for(let i = 0; i < edit_btn.length; i++){
    edit_btn[i].addEventListener("click",(event) => {
        event.preventDefault();
        edit_box[i].classList.add("on");
    });
    
    cancel_btn[i].addEventListener("click",(event) => {
        event.preventDefault();
        edit_box[i].classList.remove("on");
    });
}
