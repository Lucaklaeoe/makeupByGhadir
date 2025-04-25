function makeMasonry() {
    if(document.querySelector('.galleri-images')){
        const masonry = document.querySelector('.galleri-images');
        const columns = getComputedStyle(masonry).getPropertyValue('--columns');
        const images = masonry.querySelectorAll('img');
        const column_heights = {};
        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.classList.add("column" + i);
            masonry.appendChild(column);
            column_heights["column" + i] = i;
        }

        images.forEach(img => {
            document.querySelector(".column0").appendChild(img);
            img.onload = () => {
                const img_height = Math.round(img.getBoundingClientRect().height);
                let lowest = column_heights["column0"];
                let lowest_key = "column0";
                for (let i = 1; i < columns; i++) {
                    if(column_heights["column" + i] < lowest){
                        lowest = column_heights["column" + i];
                        lowest_key = "column" + i;
                    }
                }
                column_heights[lowest_key] += img_height;
                document.querySelector("." + lowest_key).appendChild(img);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    makeMasonry();
});