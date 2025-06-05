const burger_menu = document.querySelector('.burger-menu');
if(burger_menu){
    const burger_transition = getComputedStyle(burger_menu).getPropertyValue('--logo-transition').split('s')[0] * 1000;
    burger_menu.addEventListener('click', () => {
        burger_menu.classList.toggle('isCrossed');
        burger_menu.style.scale = "0.6";
    
        setTimeout(() => {
            burger_menu.style.scale = "1";
            if(burger_menu.classList.contains('isCrossed')){ 
                document.querySelector('.navbar ul').style.right = "0%";
                document.querySelector('.burger-menu path').setAttribute('d', 'M12.1035 13L19.1035 20M12.1035 13L5.10352 6M12.1035 13L5.10352 20M12.1035 13L19.1035 6');
            }
            else{
                document.querySelector('.burger-menu path').setAttribute('d', 'M3.10352 18H21.1035M3.10352 12H21.1035M3.10352 6H21.1035');
                document.querySelector('.navbar ul').style.right = "-100%";
            }
        }, 100);
    })
}