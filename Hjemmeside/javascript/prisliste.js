const order = [
    "makeup",
    "hårstyling",
    "bridal",
    "udkørsel"
]

document.addEventListener('DOMContentLoaded', async () => {
    const prisliste = document.getElementById('prisliste');
    const bridalPrisliste = document.getElementById('prisliste-bridal');
    const pakker = await fetch('pakker.json').then(response => response.json());
    const bridalPakker = pakker.filter(pakke => pakke.tag.includes('bridal'));

    const categories = {};
    pakker.forEach(pakke => {
        const tag = pakke.tag.replace('featured', '').trim();
        if (!categories[tag]) {
            categories[tag] = [];
        }
        categories[tag].push(pakke);
    });

    const orderedCategories = [];
    order.forEach(tag => {
        if (categories[tag]) {
            orderedCategories.push(categories[tag]);
            delete categories[tag];
        }
    });

    const otherItems = [];
    Object.keys(categories).forEach(tag => {
        otherItems.push(...categories[tag]);
    });
    if (otherItems.length > 0) {
        orderedCategories.push(otherItems);
    }

    orderedCategories.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        const h3 = document.createElement('h3');
        h3.textContent = order[index] || 'Andet';
        categoryDiv.appendChild(h3);
        
        category.forEach(pakke => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            //console.log(pakke);
            if(pakke.tag.includes('udkørsel')){
                itemDiv.innerHTML = `
                    <div class="beskrivelse">
                        <p>${pakke.label}</p>
                    </div>
                    <div class="streg"></div>
                    <div class="pris">
                        <p>Fra ${pakke.price} Kr.</p>
                    </div>
                `;
            }else{
                itemDiv.innerHTML = `
                    <div class="beskrivelse">
                        <p>${pakke.label}</p>
                        <p>Tid: ${pakke.duration} min</p>
                    </div>
                    <div class="streg"></div>
                    <div class="pris">
                        <p>${pakke.price} Kr.</p>
                    </div>
                `;
            }

            categoryDiv.appendChild(itemDiv);
        });

        prisliste.appendChild(categoryDiv);
    });

    const otherItemsDiv = document.createElement('div');
    otherItemsDiv.classList.add('category');
    bridalPakker.forEach(pakke => {
        const itemDiv = document.createElement('div');
        const isFeatured = pakke.tag.includes('featured');
        itemDiv.classList = (isFeatured ? 'item featured' : 'item');

        if(isFeatured) {
            itemDiv.innerHTML = `<div>
                <p>${pakke.label}</p>
                <p>${pakke.price} Kr.</p>
                <p>Denne pakke indeholder: <br> ${pakke.inkl}</p>
            </div>`
        }
        else{
            itemDiv.innerHTML = `
                <div class="beskrivelse">
                    <p>${pakke.label}</p>
                    <p>Tid: ${pakke.duration} min</p>
                </div>
                <div class="streg"></div>
                <div class="pris">
                    <p>${pakke.price} Kr.</p>
                </div>
            `;
        }

        if(isFeatured) {
            bridalPrisliste.appendChild(itemDiv)
        } else {
            otherItemsDiv.appendChild(itemDiv);
        }
    });
    bridalPrisliste.appendChild(otherItemsDiv);

    const tabAll = document.getElementById("alt");
    const tabBridal = document.getElementById("Bridal");
    tabAll.addEventListener("click", () => {
        if(tabAll.classList.contains("active-tab")) return;
        document.querySelector(".active-tab").classList.remove("active-tab");
        tabAll.classList.add("active-tab");
        prisliste.style.display = "flex";
        bridalPrisliste.style.display = "none";
    });

    tabBridal.addEventListener("click", () => {
        if(tabBridal.classList.contains("active-tab")) return;
        document.querySelector(".active-tab").classList.remove("active-tab");
        tabBridal.classList.add("active-tab");
        prisliste.style.display = "none";
        bridalPrisliste.style.display = "flex";
    });
});