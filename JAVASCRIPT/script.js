/*=====SHOWING AND HIDDING MENU=====*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));


/*=====STATS COUNTER HOME=====*/
let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                counter('animation__1', 0, 10, 1000);
                counter('animation__2', 0, 150, 2000);
                counter('animation__3', 0, 100, 1500);
            }, 500);
        }
    });
});

function counter(cls, start, end, duration) {
    let obj = document.getElementById(cls);
    let current = start;
    let range = end - start;
    let increment = end > start ? 1 : -1;
    let step = Math.abs(Math.floor(duration / range));
    let timer = setInterval(() => {
        current += increment;
        obj.textContent = current;

        if (current == end) {
            clearInterval(timer);
        }
    }, step);
}

let stats = document.querySelector('#stats');
observer.observe(stats);


/*=====SKILLS SCRIPTS=====*/
const skillsContent = document.getElementsByClassName('skills__content');
const skillsHeader = document.querySelectorAll('.skills__header');

function toggleSkills() {
    let itemClass = this.parentNode.className;

    for (let i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close';
    }
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open';
    }
}

skillsHeader.forEach((element => {
    element.addEventListener('click', toggleSkills);
}));


/*=====SERVICES MODAL=====*/
const modalViews = document.querySelectorAll('.services__modal');
const modalBtns = document.querySelectorAll('.services__button');
const modalCloses = document.querySelectorAll('.services__modal-close');

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal');
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i);
    });
});

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal');
        });
    });
});


/*=====PORTFOLIO POPUP ANIMATIONS=====*/
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('work__button')) {
        togglePortfolioPopup();
        portfolioItemDetails(e.target.parentElement);
    }
});

function togglePortfolioPopup() {
    document.querySelector('.portfolio__popup').classList.toggle('open');
}
document.querySelector('.portfolio__popup-close').addEventListener('click', togglePortfolioPopup);

function portfolioItemDetails(portfolioItem) {
    document.querySelector('.pp__thumbnail img').src = portfolioItem.querySelector('.work__img').src;
    document.querySelector('.portfolio__popup-subtitle span').innerHTML = portfolioItem.querySelector('.work__title').innerHTML;
    document.querySelector('.portfolio__popup-body').innerHTML = portfolioItem.querySelector('.portfolio__item-details').innerHTML;
}


/*=====SCROLL SECTIONS ACTIVE LINK=====*/
const sections = document.querySelectorAll('section[id]');

function scroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scroll);


/*=====SCROLLING UP WHEN THE BUTTON IS PRESSED=====*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');

    if (this.scrollY >= 570) {
        scrollUp.classList.add('show-scroll');
    }
    else {
        scrollUp.classList.remove('show-scroll');
    }
}
window.addEventListener('scroll', scrollUp);


/*=====DARK & LIGHT THEME=====*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'uil-sun';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

function getCurrentTheme() {
    document.body.classList.contains(darkTheme) ? 'dark' : 'light';
}
function getCurrentIcon() {
    themeButton.classList.contains(iconTheme) ? 'uil-sun' : 'uil-instagram';
}

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'uil-sun' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});


/*=====CUSTOMIZED CURSOR=====*/
let cursor1 = document.querySelector('.cursor-1');
let cursor2 = document.querySelector('.cursor-2');

window.onmousemove = (e) => {
    cursor1.style.top = e.pageY + 'px';
    cursor1.style.left = e.pageX + 'px';
    cursor2.style.top = e.pageY + 'px';
    cursor2.style.left = e.pageX + 'px';
}

document.querySelectorAll('a').forEach(links => {

    links.onmouseenter = () => {
        cursor1.classList.add('active');
        cursor2.classList.add('active');
    }

    links.onmouseleave = () => {
        cursor1.classList.remove('active');
        cursor2.classList.remove('active');
    }

});


/*=====ANIMATION ON SCROLL INITIATION=====*/
AOS.init();
AOS.init({

    offset: 100,
    delay: -1, 
    duration: 500,
    easing: 'ease',
    once: false,
    mirror: false,
    anchorPlacement: 'top-bottom',

});