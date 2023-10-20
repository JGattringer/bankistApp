'use strict';
const header = document.querySelector('.header');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// cria um dom element e armazena ele na variavel
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// seleciona o elemento section1
const section1 = document.querySelector('#section--1');
//tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const initialCoords = section1.getBoundingClientRect();
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////
//////////////////////////PAGE NAVIGATION//////////////////////////

// usamos o for each para os 3 botoes mas nao e recomendado caso tenhamos muitos elementos pois estariamos criando muitas copias dessa funcao e iria impactar no desempenho
// seleciona todos os links da barra menu
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     // evita o default de atualizar a pagina
//     e.preventDefault();
//     //pegamos o atributo href como uma id para manipularmos
//     const id = this.getAttribute('href');
//     console.log(id);
//     // realiza o smooth scroll
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////// EVENT DELEGATION

// 1 - add event listener to a common parent element
// 2 - determine what element originated the event
// na funcao abaixo usamos o conceito de bubbling para atrelar os eventos dos filhos serem escutados pelo pai e atravez dele reagir ao mesmo
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log('click');
  // matching strategy - apenas ira realizar o funcao de scroll caso o click seja feito em um dos elementos que contem nav__link
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    // realiza o smooth scroll
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////////
/////////////////////SCROLLING//////////////////////////////////////

// adiciona uma class ao elemento criado
message.classList.add('cookie-message');

message.innerHTML = `we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// faz o append da msg na base da pagina
header.append(message);

// adiciona funcao de fechar o botao ao clicar
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    //novo modo
    message.remove();
    //modo antigo
    // message.parentElement.removeChild(message);
  });

// muda cor e tamanho da msg
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//converte a string em number
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// scrolling to

btnScrollTo.addEventListener('click', function (e) {
  // pega as coordenadas do section1
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // coodernadas da posicao atual do scroll
  console.log(
    'Current scroll (x/y) position',
    window.pageXOffset,
    window.pageYOffset
  );

  // // realiza o scrolling, passamos as cordenadas que queremos que a pagina se mova para onde queremos, esse estilo e o modo antigo de se realizar
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //SMOOTH SCROLLING
  // passamos um objeto como argumento e definimos suas propriedades
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //JEITO MODERNO DE REALIZAR O SCROLL TO, funciona apenas em browsers atuais
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////
/////////////////////////TABBED COMPONENT ///////////////////////////

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // guard cause - proteje de erro caso uma area fora do botao seja clicada
  if (!clicked) return;

  //remove active classes
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  // active tab
  clicked.classList.add('operations__tab--active');

  // activate content area

  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////
//////////////////////// MENU FADE ANIMATION ////////////////////////

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////////////
/////////////////////////STICKY NAVIGATION/////////////////////

// old school way nao e muito utilizado pois pode apresentar problemas de performance
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
/////////////////////////////////////////////////////////
///////////// sticky navigation: Intersection Observer API

// const obsCallBack = function (entries, Observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }

// const observer = new IntersectionObserver (obsCallBack, obsOptions)
// observer.observe(section1)

const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry)

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////
//////////////////////REVEAL SECTIONS////////////////////////////////

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////
///////////////////////LAZY LOADING IMAGES///////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////
///////////////// SLIDER COMPONENT //////////////////////////////////

// slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = `scale(0.4) translateX`;
  // slider.style.overflow = 'visible';

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide

  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // adicionando uso da arrow key
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
