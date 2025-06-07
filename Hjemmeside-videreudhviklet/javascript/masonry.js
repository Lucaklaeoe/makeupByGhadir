const column_heights = {};
function makeMasonry() {
    if(document.querySelector('.galleri-images')){
        const masonry = document.querySelector('.galleri-images');
        const columns = getComputedStyle(masonry).getPropertyValue('--columns') || 3;
        const images = masonry.querySelectorAll('img');
        //console.log(images);
        for (let i = 0; i < columns; i++) {
            const column = document.createElement("div");
            column.classList.add("column" + i);
            column.classList.add("masonry-column");
            masonry.appendChild(column);
            column_heights["column" + i] = i;
        }

        images.forEach((img, index) => {
            img.onload = () => {
                //console.log(img);
                appendimg(img, columns);
                animateImgs(img ,index);
            }
        });

        document.querySelectorAll('.categories li').forEach(category => {
            category.addEventListener('click', () => {
                for (let i = 0; i < columns; i++) {
                    column_heights["column" + i] = i;
                }

                var category_name = category.textContent.replace(" ", '').toLowerCase();
                document.querySelector('body').classList = category_name;

                const active_category = document.querySelector('.categories li.active');
                if (active_category == category) {
                    category.classList.remove('active');
                    category_name = 'none';
                }
                else{
                    if(active_category){
                        active_category.classList.remove('active');
                    }
                    category.classList.add('active');
                }

                const important_images = document.querySelectorAll('.galleri-images img.' + category_name);
                const not_important_images = document.querySelectorAll('.galleri-images img:not(.' + category_name + ')');

                important_images.forEach(img => {
                    appendimg(img, columns, "prepend");
                });

                not_important_images.forEach(img => {
                    appendimg(img, columns);
                });
            });
        });
    }
}

function appendimg(img, columns, mode = "append") {
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
    
    if (mode == "prepend") {
        document.querySelector("." + lowest_key).prepend(img);
    }
    else{
        document.querySelector("." + lowest_key).appendChild(img);
    }

    const lightbox = document.getElementById("lightBox");
    img.addEventListener("click", (event) => {
        event.stopPropagation();
        lightbox.src = img.getAttribute('src');
        lightbox.classList.add("active");
        window.addEventListener('click', removeLightBox);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    makeMasonry();
    //console.log("masonry loaded");
    setTimeout(() => {
        const loadTheMasonry = document.getElementById("LOAD");
        loadTheMasonry.click();
        loadTheMasonry.click();

        setTimeout(() => {
            if(localStorage.getItem('masonryCategory')){
                const category = localStorage.getItem('masonryCategory');
                const buttons = document.querySelectorAll('.categories li');
                buttons.forEach(button => {
                    if(button.textContent == category){
                        button.click();
                    }
                });
                localStorage.removeItem('masonryCategory');
            } 
        }, 1)
    }, 1);

    window.addEventListener('resize', () => {
        window.location.reload();
    });

});
const removeLightBox = () => {
    console.log('click');
    const lightbox = document.getElementById("lightBox");
    lightbox.classList.remove("active");
    window.removeEventListener('click', removeLightBox);
};

function animateImgs(img, index = 0) {
    if(index >= 20) index = 20;
    setTimeout(() => {
        //console.log(img);
        img.classList.add("loaded");
    }, 10 + (index * 50));
}