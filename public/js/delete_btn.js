let delete_btn = document.querySelectorAll(".delete");
delete_btn.forEach((item,index) => {
    item.addEventListener("click",(event) => {
        let check = confirm("게시글을 삭제하시겠습니까?");
        if(!check) {
            event.preventDefault();
        }
    });
});