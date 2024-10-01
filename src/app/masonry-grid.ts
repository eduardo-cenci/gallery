export default class MasonryGrid {
  private grid: HTMLElement;
  private items: NodeListOf<HTMLElement>;

  constructor(grid: HTMLElement) {
    this.grid = grid;
    this.items = this.grid.querySelectorAll('.masonry__item');

    this.init();
  }

  private init = () => {
    this.updateItems();
    window.addEventListener('resize', this.updateItems);
    this.grid.classList.remove('masonry--hidden');
  };

  private updateItems = () => {
    this.items.forEach(item => (item.style.gridRow = 'span ' + item.offsetHeight.toString()));
  };
}
