


const $comments = document.querySelectorAll(".comment div")

console.log($comments.length)

async function setItemData(){
    const res = await fetch("http://127.0.0.1:8000/quiz_data");
    const data = await res.json();
    for(let i=0; i < $comments.length; i++){
        $comments[i].textContent = data.items[0].reviews[i];
    }

};

setItemData();