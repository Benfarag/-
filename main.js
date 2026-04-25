const openBtn = document.getElementById('open-btn')

const closeBtn = document.getElementById('close-btn')

const sideMenu = document.getElementById('side-menu')

openBtn.onclick = function() {
    sideMenu.classList.add('open')
};

closeBtn.onclick = function() {
    sideMenu.classList.remove('open')
};




