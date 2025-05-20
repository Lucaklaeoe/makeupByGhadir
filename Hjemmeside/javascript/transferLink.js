document.addEventListener("DOMContentLoaded", () => {
    const transferLink = document.querySelectorAll(".mini-galleri a");
    transferLink.forEach(link => {
        const category = link.classList[1].charAt(0).toUpperCase() + link.classList[1].slice(1);
        link.addEventListener("click", () => {
            localStorage.setItem('masonryCategory', category);
            window.location = 'galleri.html';
        });
    })
});