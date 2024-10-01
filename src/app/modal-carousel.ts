export default class ModalCarousel {
  private modal: HTMLElement;
  private list: HTMLElement;
  private buttonClose: HTMLButtonElement;
  private buttonPrev: HTMLButtonElement;
  private buttonNext: HTMLButtonElement;
  private items: HTMLImageElement[];
  private allowShift: boolean;
  private current!: number;
  private dragStartPosition: number | undefined;

  constructor(modal: HTMLElement) {
    this.modal = modal;
    this.list = this.modal.querySelector('[data-modal-carousel="list"]')!;
    this.buttonClose = this.modal.querySelector('[data-modal-carousel="close"]')!;
    this.buttonPrev = this.modal.querySelector('[data-modal-carousel="prev"]')!;
    this.buttonNext = this.modal.querySelector('[data-modal-carousel="next"]')!;
    this.items = Array.from(document.querySelectorAll('[data-modal-carousel="item"]'));
    this.allowShift = true;

    this.buildItems();
    this.setEvents();
  }

  private buildItems = () => {
    this.items.forEach(item => {
      const newImg = document.createElement('img');
      const newItem = document.createElement('li');

      newImg.classList.add('modal-carousel__img');
      newImg.setAttribute('src', item.src);
      newImg.setAttribute('alt', item.alt);

      newItem.classList.add('modal-carousel__item');
      newItem.appendChild(newImg);

      this.list.appendChild(newItem);
    });
  };

  private setEvents = () => {
    this.items.forEach(item => item.addEventListener('click', this.open));

    this.buttonClose.addEventListener('click', this.close);
    this.buttonPrev.addEventListener('click', this.prev);
    this.buttonNext.addEventListener('click', this.next);

    this.list.addEventListener('transitionend', this.checkIndex);
    this.list.addEventListener('mousedown', this.dragStart);
    this.list.addEventListener('touchstart', this.dragStart);

    window.addEventListener('mousemove', this.dragAction);
    window.addEventListener('touchmove', this.dragAction);
    window.addEventListener('mouseup', this.dragEnd);
    window.addEventListener('touchend', this.dragEnd);
    window.addEventListener('mouseleave', this.dragEnd);
    window.addEventListener('resize', this.updateList);

    document.addEventListener('keydown', event => {
      switch (event.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        default:
          break;
      }
    });
  };

  private open = (event: Event) => {
    this.current = this.items.indexOf(event.target as HTMLImageElement);
    this.updateList();
    document.body.classList.add('modal-open');
    this.modal.classList.add('open');
  };

  private close = () => {
    this.modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  private updateList = () => {
    if (isNaN(this.current)) return;

    this.list.style.left = `${-window.innerWidth * this.current}px`;
  };

  private prev = () => {
    this.shiftSlide(-1);
  };

  private next = () => {
    this.shiftSlide(1);
  };

  private dragStart = (event: Event) => {
    this.list.classList.remove('shifting');
    this.list.classList.add('move');
    this.dragStartPosition =
      event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
  };

  private dragAction = (event: Event) => {
    if (!this.dragStartPosition) return;

    const currentPosition =
      event.type === 'touchmove' ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const distance = this.dragStartPosition - currentPosition;
    const startPosition = window.innerWidth * this.current;

    this.list.style.left = `${-startPosition - distance}px`;
  };

  private dragEnd = () => {
    if (!this.dragStartPosition) return;

    const startPosition = -window.innerWidth * this.current;
    const finalPosition = parseInt(this.list.style.left);
    const distance = startPosition - finalPosition;
    const threshold = window.innerWidth / 4;

    this.list.classList.add('shifting');
    this.list.classList.remove('move');

    if (Math.abs(distance) > threshold) {
      this.shiftSlide(Math.sign(distance));
    } else {
      this.list.style.left = `${startPosition}px`;
    }

    this.dragStartPosition = undefined;
  };

  private shiftSlide = (dir: number) => {
    if (!this.allowShift || dir === 0) return;

    this.list.classList.add('shifting');
    dir === 1 ? this.current++ : this.current--;
    this.updateList();
    this.allowShift = false;
  };

  private checkIndex = () => {
    this.list.classList.remove('shifting');

    if (this.current === -1) {
      this.current = this.items.length - 1;
    } else if (this.current === this.items.length) {
      this.current = 0;
    }

    this.updateList();
    this.allowShift = true;
  };
}
