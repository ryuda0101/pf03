const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
    dragSize: 'auto',
    hide: true
  },

  autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});

const swiper2 = new Swiper('.brd_swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  breakpoints: {
    1920: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    320: {
      slidesPerView: 2,
      spaceBetween: 20
    },
  },

  autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});

const swiper3 = new Swiper('.review_swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  breakpoints: {
    1920: {
      slidesPerView: 5,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20
    },
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
    dragSize: 'auto',
    hide: true
  },

  autoplay: {
    delay: 3000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});