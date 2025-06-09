document.addEventListener("DOMContentLoaded", () => {
    const faqitems = document.querySelectorAll(".faq-item");
    faqitems.forEach(fagitem => {
        fagitem.addEventListener("click", () => {
            fagitem.classList.toggle("active");
        });
    });
});