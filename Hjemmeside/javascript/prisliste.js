const order = [
    "makeup",
    "hårstyling",
    "bridal",
    "udkørsel"
]

document.addEventListener('DOMContentLoaded', async () => {
    const prisliste = document.getElementById('prisliste');
    const pakker = await fetch('pakker.json').then(response => response.json());

    const categories = {};
    pakker.forEach(pakke => {
        const tag = pakke.tag;
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

    Object.keys(categories).forEach(tag => {
        orderedCategories.push(categories[tag]);
    });

    orderedCategories.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        const h3 = document.createElement('h3');
        h3.textContent = order[index] || 'Andet';
        categoryDiv.appendChild(h3);
        
        category.map(pakke => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            itemDiv.innerHTML = `
                <div class="beskrivelse">
                    <p>${pakke.label}</p>
                    <p>tid: ${pakke.duration} min</p>
                </div>
                <div class="streg"></div>
                <div class="pris">
                    <p>${pakke.price} Kr.</p>
                </div>
            `;

            categoryDiv.appendChild(itemDiv);
        });

        prisliste.appendChild(categoryDiv);
    });
});