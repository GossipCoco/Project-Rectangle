class Rectangle {
    public element: HTMLDivElement;
    private size: number;
    private color: string;
  
    constructor(private x: number, private y: number) {
      this.size = Math.random() * 100;
      this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      this.element = this.createElement();
      this.addEventListeners();
    }
  
    private createElement(): HTMLDivElement {
      const rect = document.createElement('div');
      rect.classList.add('rectangle');
      rect.style.width = `${this.size}px`;
      rect.style.height = `${this.size}px`;
      rect.style.backgroundColor = this.color;
      rect.style.top = `${this.y - this.size / 2}px`;
      rect.style.left = `${this.x - this.size / 2}px`;
      return rect;
    }
  
    private addEventListeners() {
      this.element.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }
  
    private handleDoubleClick() {
      this.element.style.transition = 'transform 1s';
      this.element.style.transform = 'rotate(360deg)';
      this.element.classList.add('rotating');
      this.element.addEventListener('transitionend', () => {
        this.element.remove();
      });
    }
  
    public getArea(): number {
      return this.size * this.size;
    }
  
    public setColor(color: string) {
      this.element.style.backgroundColor = color;
    }
  }
  
  class RectangleDrawer {
    private rectangles: Rectangle[] = [];
    private rotatingRects = 0;
  
    constructor(private drawingArea: HTMLDivElement, private repaintButton: HTMLButtonElement) {
      this.addEventListeners();
    }
  
    private addEventListeners() {
      this.drawingArea.addEventListener('click', this.handleClick.bind(this));
      this.repaintButton.addEventListener('click', this.repaintRectangles.bind(this));
    }
  
    private handleClick(event: MouseEvent) {
      const rect = new Rectangle(event.clientX, event.clientY);
      this.rectangles.push(rect);
      this.drawingArea.appendChild(rect.element);
  
      rect.element.addEventListener('dblclick', () => {
        this.rotatingRects++;
        rect.element.addEventListener('transitionend', () => {
          this.rotatingRects--;
          if (this.rotatingRects === 0) {
            this.removeRotatingRectangles();
          }
        });
      });
    }
  
    private removeRotatingRectangles() {
      const rotatingElems = this.drawingArea.querySelectorAll('.rectangle.rotating');
      rotatingElems.forEach(el => el.remove());
    }
  
    private repaintRectangles() {
      if (this.rectangles.length < 2) return;
  
      let minDiff = Infinity;
      let rect1: Rectangle | null = null;
      let rect2: Rectangle | null = null;
  
      for (let i = 0; i < this.rectangles.length; i++) {
        for (let j = i + 1; j < this.rectangles.length; j++) {
          const area1 = this.rectangles[i].getArea();
          const area2 = this.rectangles[j].getArea();
          const diff = Math.abs(area1 - area2);
          if (diff < minDiff) {
            minDiff = diff;
            rect1 = this.rectangles[i];
            rect2 = this.rectangles[j];
          }
        }
      }
  
      if (rect1 && rect2) {
        const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        rect1.setColor(newColor);
        rect2.setColor(newColor);
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
    const repaintButton = document.getElementById('repaintButton') as HTMLButtonElement;
    new RectangleDrawer(drawingArea, repaintButton);
  });
  