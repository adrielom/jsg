export class ZoomPanControl {
  private zoom = 1;
  private panX = 0;
  private panY = 0;

  constructor(private canvas: HTMLCanvasElement, private render: any) {
    this.panX = canvas.width / 2;
    this.panY = canvas.height / 2;
    this.setupControls();
  }

  private setupControls() {
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const panSpeed = e.ctrlKey ? 5 : 20;
      
      if (e.altKey) {
        this.panX += e.deltaY > 0 ? panSpeed : -panSpeed;
      } else if (e.shiftKey) {
        this.panY += e.deltaY > 0 ? panSpeed : -panSpeed;
      } else {
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom *= zoomFactor;
        this.zoom = Math.max(0.1, Math.min(5, this.zoom));
      }
      
      this.updateBounds();
    }, { passive: false });
  }

  private updateBounds() {
    const viewWidth = this.canvas.width / this.zoom;
    const viewHeight = this.canvas.height / this.zoom;
    
    this.render.bounds.min.x = this.panX - viewWidth / 2;
    this.render.bounds.min.y = this.panY - viewHeight / 2;
    this.render.bounds.max.x = this.panX + viewWidth / 2;
    this.render.bounds.max.y = this.panY + viewHeight / 2;
    
    this.render.options.hasBounds = true;
  }
}