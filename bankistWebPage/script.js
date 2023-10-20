'use strict';
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Cria um elemento DOM e armazena-o em uma variável
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');

// Seleciona o elemento com id "section--1"
const section1 = document.querySelector('#section--1');

// Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// Obtém as coordenadas iniciais do section1
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

// Adiciona um evento de clique a cada botão para abrir o modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Fecha o modal quando o botão "btnCloseModal" é clicado
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Fecha o modal quando a tecla "Esc" é pressionada
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////
//////////////////////////PAGE NAVIGATION//////////////////////////

// EVENT DELEGATION

// 1 - Adicione um ouvinte de eventos a um elemento pai comum
// 2 - Determine qual elemento originou o evento
// Na função abaixo, usamos o conceito de "bubbling" para anexar eventos dos filhos ouvirem pelo pai e reagir a eles.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log('click');

  // Estratégia de correspondência - realizamos a rolagem suave somente se o clique for feito em um dos elementos que contêm "nav__link"
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);

    // Realiza a rolagem suave
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////////
/////////////////////SCROLLING//////////////////////////////////////

// Adiciona uma classe ao elemento criado
message.classList.add('cookie-message');

message.innerHTML = `we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// Anexa a mensagem na parte superior da página
header.append(message);

// Adiciona uma função para fechar a mensagem ao clicar
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// Altera a cor e o tamanho da mensagem
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// Converte a string em número
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// Rolar para

btnScrollTo.addEventListener('click', function (e) {
  // Obtém as coordenadas de "section1"
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // Coordenadas da posição atual da rolagem
  console.log(
    'Current scroll (x/y) position',
    window.pageXOffset,
    window.pageYOffset
  );

  // Maneira moderna de realizar a rolagem (funciona apenas em navegadores atuais)
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////
/////////////////////////TABBED COMPONENT ///////////////////////////

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard clause - protege contra erros caso uma área fora do botão seja clicada
  if (!clicked) return;

  // Remove as classes ativas
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  // Ativa a aba clicada
  clicked.classList.add('operations__tab--active');

  // Ativa a área de conteúdo correspondente
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

// Passando "argumento" para o manipulador
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////////////////////////
/////////////////////////STICKY NAVIGATION/////////////////////

// Obtém a altura da barra de navegação
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;

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

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Substitui "src" por "data-src"
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

// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

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

  // Próximo slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Slide anterior
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

  // Manipuladores de eventos
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Adicionando uso das teclas de seta
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
