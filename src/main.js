const d = document;

const galleryWrapper = d.querySelector('.gallery-inner-wrapper');
const galleryItems = d.querySelectorAll('.gal-el-wrap');
let count = 0;

galleryItems.forEach(item => {
    count++
    item.style.setProperty('--n', count);
});
galleryWrapper.style.setProperty('--tn', count);

const percent = document.querySelector('.loader');
const openingText = d.querySelector('.opening span');
let p = 0;

function loadPage() {
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
}
loadPage();



const view = d.querySelector('.fs.view');
const aside = d.querySelector('aside');
const goFs = d.querySelector('.fullscreen-prev');
const gallery = d.querySelector('.gallery');
const readAreaSwitch = d.querySelector('.co-gal-el-read-area');
const headerContent = d.querySelector('.header-content');
const tagsField = d.querySelector('.tags-field');
const stylesLib = `Realism 
    Academicism
    Classicism
    Romanticism
    Impressionism
    Post-Impressionism
    Modernism
    Expressionism
    Symbolism
    Abstractionism
    Surrealism
    Futurism
    Minimalism
    Conceptualism
    Figurative Art
    Hyperrealism
    Avant-garde`;
const choiceFocus = d.querySelector('.choice-focus');

let isRestEnabled = true;
function restBlocked(enableScroll) {
    document.body.style.overflow = enableScroll ? 'visible' : 'hidden';
    isRestEnabled = enableScroll ? true : false;
}

function toggleMenu() {
    closeSelectedItem();
    headerContent.style.display = headerContent.style.display === 'flex' ? 'none' : 'flex';
    d.querySelector('header button img').src = headerContent.style.display === 'flex' ? `public/icons/close.svg` : 'public/icons/menu.svg';
    isRestEnabled ? restBlocked(false) : restBlocked(true)
}
function closeMenu() {
    headerContent.style.display = 'none';
    d.querySelector('header button img').src = 'public/icons/menu.svg';
    isRestEnabled ? restBlocked(false) : restBlocked(true);
}
function openSelectedItem(e) {
    const tar = e.target;
    const item = tar.closest('.gal-el-wrap');
    if (!item) return;

    const asideContent = aside.children[0];
    readAreaSwitch.classList.remove('mra-closed');
    readAreaSwitch.classList.add('mra-opened');

    asideContent.children[0].src = tar.src;
    view.children[0].src = tar.src;
    asideContent.children[1].textContent = tar.dataset.title;
    asideContent.children[2].textContent = 'canvas: ' + tar.dataset.canvas;
    asideContent.children[3].textContent = 'size: ' + tar.dataset.size + 'cm';
    
    aside.style.transform = 'translate(0)';
    goFs.style.display = 'block';
}
function toggleSelectedItem() {
    closeMenu();
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
}
function closeSelectedItem() {
    const isOpen = readAreaSwitch.classList.contains('mra-opened');

    if (isOpen) {
        readAreaSwitch.classList.remove('mra-opened');
        readAreaSwitch.classList.add('mra-closed');
        aside.style.transform = 'translatex(-30vw)';
        goFs.style.display = 'none';
    } else return
}
function openFullscreen() {
    view.style.display = 'flex';
    restBlocked(false);
}
function openLink(e) {
    if (choiceFocus.style.opacity !== '1') choiceFocus.style.opacity = '1';

    const linkObj = e.target.getBoundingClientRect();
    choiceFocus.style.transform = `translate(-40%,${linkObj.y - linkObj.height*2 - linkObj.height*.025}px)`;
    
    const linkName = e.target.dataset.link;
    const directions = d.querySelectorAll('.display div[data-link]');
    directions.forEach(dir => {
        dir.style.display = 'none';
        if (dir.dataset.link === linkName) {
            dir.style.display = 'block';

            if (linkName === 'styles' && tagsField.children.length === 0) {
                stylesLib.split('\n').forEach(style => {
                    const s = d.createElement('p');
                    s.classList.add('style-tag');
                    s.textContent = style.trim().toLowerCase();
                    
                    tagsField.appendChild(s);
                })
            }
        }
    });
}

window.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.header-btn')) toggleMenu();
    if (target.closest('.co-gal-el-read-area')) toggleSelectedItem(); 
    if (target.closest('.fullscreen-prev')) openFullscreen(); 
    if (target.closest('.gallery')) openSelectedItem(e); 
    if (target.closest('.links h1')) openLink(e);
});



// 3d gallery rotation on mousemove and scroll

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

    if (isRestEnabled) updateRotation();
});
window.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    cry = (mx - cx) * cursorSensitivity / Math.pow(window.innerWidth / window.innerHeight, 3);
    rx = (cy - my) * cursorSensitivity;
    if (isRestEnabled) updateRotation();
})
function updateRotation() {
    galleryOuterWrapper.style.transform = `
        translate(-50%,-50%)
        rotateX(${-20 + rx}deg)
        rotateY(${cry}deg)
    `;
    galleryWrapper.style.transform = `
        translate(-50%,-50%)
        rotateY(${ry + cry}deg)
    `;
}
