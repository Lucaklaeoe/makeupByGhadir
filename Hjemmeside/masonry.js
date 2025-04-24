// const imagelayout = {};
// function makeMasonry() {
//     if(document.querySelector('.galleri-images')){
//         const masonrys = document.querySelectorAll('.galleri-images');
//         masonrys.forEach(masonry => {
//             const columns = getComputedStyle(masonry).getPropertyValue('--columns');
//             for (let i = 0; i < columns; i++) {
//                 imagelayout["column" + i] = {height: 0,image: []};
//             }
//             const images = masonry.querySelectorAll('img');
//             images.forEach(image => {
//                 const height = image.getBoundingClientRect().height;
//                 for (let i = 0; i < columns; i++) {
//                     if(imagelayout["column" + i].height == 0){
//                         imagelayout["column" + i].height = height;
//                         console.log(imagelayout["column" + i].images);
//                         imagelayout["column" + i].images.push(image.outerHTML);
//                         break;
//                     }
//                     const lowest = imagelayout["column" + i] < lowest ? imagelayout["column" + i] : lowest;

//                     if(i == columns - 1){
//                         lowest.height += height;
//                         lowest.images.push(image.outerHTML);
//                         break;
//                     }
//                 }
//             });
//         });
//     }
// }

function makeMasonry() {
    if(document.querySelector('.galleri-images')){
        const masonry = document.querySelector('.galleri-images');
        const columns = getComputedStyle(masonry).getPropertyValue('--columns');
        const images = masonry.querySelectorAll('img');
        var column_heights = [];
        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.classList.add("column" + i);
            masonry.appendChild(column);
            column_heights.push(0);
        }

        images.forEach(img => {
            const current_lowest = 0;
            const choosen_column_key = 0;
            for (let i = 0; i < column_heights; i++) {
                if(column_heights[i] <= current_lowest){
                    choosen_column_key = i;
                }
            }
            document.querySelector(".column" + choosen_column_key).appendChild(img);
            column_heights[choosen_column_key] += img.getBoundingClientRect().height;
        });
        console.log(column_heights);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    makeMasonry();
});