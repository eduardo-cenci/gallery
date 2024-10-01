import '../styles/main.scss';

import MasonryGrid from './masonry-grid';
import ModalCarousel from './modal-carousel';

window.addEventListener('load', () => {
  const masonry = document.getElementById('masonry');
  if (masonry) new MasonryGrid(masonry);

  const modalCarousel = document.getElementById('modal-carousel');
  if (modalCarousel) new ModalCarousel(modalCarousel);
});
