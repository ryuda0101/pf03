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
    1200: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    769: {
      slidesPerView: 2,
      spaceBetween: 20
    }
  },

  autoplay: {
    delay: 1000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});

const swiper3 = new Swiper('.review_swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  breakpoints: {
    1800: {
      slidesPerView: 5,
    },
    1500: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 3,
    },
    769: {
      slidesPerView: 2,
    }
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
    dragSize: 'auto',
    hide: true
  },

  autoplay: {
    delay: 1500,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },
});