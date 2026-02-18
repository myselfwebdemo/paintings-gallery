const d = document;

const galleryItems = d.querySelectorAll('.gal-el-wrap');
galleryItems.forEach((item, index) => {
  item.style.setProperty('--n', index + 1);
});

let isRestEnabled = true;
function restBlocked(enableScroll) {
    document.body.style.overflow = enableScroll ? 'visible' : 'hidden';
    isRestEnabled = enableScroll ? true : false;
}

const percent = document.querySelector('.loader');
const openingText = d.querySelector('.opening span');
let p = 0;

const loader = setInterval(() => {
    p += Math.random() * 4;
    
    onload = () => {
        p += 100;
    }
    
    if (p >= 100) {
        p = 100;
        clearInterval(loader);
        setTimeout(() => {
            d.body.style.overflow = 'visible';
            d.querySelector('.loader').style.display = 'none';
        }, 300);
    }
    
    percent.textContent = `${Math.floor(p)}%`;
}, 60);
window.addEventListener('load', () => p += 50);


const aboutBtn = d.querySelector('.about');

aboutBtn.addEventListener('click', () => {
    d.querySelector('header div').style.display = d.querySelector('header div').style.display === 'block' ? 'none' : 'block';
    d.querySelector('header button').innerHTML = d.querySelector('header div').style.display === 'block' ? `<img src="public/cross.png"></img>` : 'About';
})

const view = d.querySelector('.fs.view');
const aside = d.querySelector('aside');
const goFs = d.querySelector('.fullscreen-prev');
const gallery = d.querySelector('.gallery');
const readAreaSwitch = d.querySelector('.co-gal-el-read-area');
const galleryWrapper = d.querySelector('.gallery-inner-wrapper');

readAreaSwitch.addEventListener('click', () => {
    const isOpen = readAreaSwitch.classList.contains('mra-opened');

    if (isOpen) {
        readAreaSwitch.classList.remove('mra-opened');
        readAreaSwitch.classList.add('mra-closed');
        aside.style.transform = 'translatex(-30vw)';
        goFs.style.display = 'none';
    } else {
        readAreaSwitch.classList.remove('mra-closed');
        readAreaSwitch.classList.add('mra-opened');
        aside.style.transform = 'none';
        goFs.style.display = 'block';
    }
});
goFs.addEventListener('click', () => {
    view.style.display = 'flex';
    restBlocked(false);
})

gallery.addEventListener('click', (e) => {
    const tar = e.target;
    const item = tar.closest('.gal-el-wrap');
    if (!item) return;

    const asideContent = aside.children[0];
    readAreaSwitch.classList.remove('mra-closed');
    readAreaSwitch.classList.add('mra-opened');

    asideContent.children[0].src = tar.src;
    view.children[0].src = tar.src
    asideContent.children[1].textContent = tar.dataset.title;
    asideContent.children[2].textContent = tar.dataset.info;
    
    aside.style.transform = 'translate(0)';
    goFs.style.display = 'block';

    console.log(tar.src)
});

const galleryOuterWrapper = d.querySelector('.gallery-outer-wrapper');
const cursorSensitivity = 0.01;
const initRX = -10;
let cry = 0;
let ry = 0;
let rx = 0;
let rz = 0;
let last_sy = 0;

window.addEventListener('scroll', () => {
    let delta = window.scrollY - last_sy; // ensures constant speed s=1
    ry += delta / 50;
    
    if (window.scrollY >= galleryWrapper.scrollHeight) {
        window.scrollTo(0,10);
    }
    if (window.scrollY <= 0) {
        window.scrollTo(0, galleryWrapper.scrollHeight);
    }

    last_sy = window.scrollY;

    if (isRestEnabled) UR();
});
window.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    cry = (mx - cx) * cursorSensitivity / Math.pow(window.innerWidth / window.innerHeight, 3);
    rx = (cy - my) * cursorSensitivity;
    if (isRestEnabled) UR();
})
function UR() {
    galleryOuterWrapper.style.transform = `
        translate(-50%,-50%)
        rotateX(${-20 + rx}deg)
        rotateY(${cry}deg)
    `
    
    galleryWrapper.style.transform = `
        translate(-50%,-50%)
        rotateY(${ry + cry}deg)
    `;
}
