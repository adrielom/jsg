export class DragControl {
  private draggedObject: any = null;
  private dragOffset = { x: 0, y: 0 };
  private isDragging = false;
  private moveMode = false;

  constructor(
    private canvas: HTMLCanvasElement, 
    private render: any, 
    private findGameObjectByBody: (body: any) => any,
    private engine: any
  ) {
    this.setupControls();
  }

  private setupControls() {
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.moveMode) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = this.render.bounds.min.x + (mouseX / this.canvas.width) * (this.render.bounds.max.x - this.render.bounds.min.x);
      const worldY = this.render.bounds.min.y + (mouseY / this.canvas.height) * (this.render.bounds.max.y - this.render.bounds.min.y);
      
      for (const body of this.engine.world.bodies) {
        if (worldX >= body.bounds.min.x && worldX <= body.bounds.max.x &&
            worldY >= body.bounds.min.y && worldY <= body.bounds.max.y) {
          this.draggedObject = this.findGameObjectByBody(body);
          if (this.draggedObject) {
            this.isDragging = true;
            this.dragOffset.x = worldX - body.position.x;
            this.dragOffset.y = worldY - body.position.y;
            break;
          }
        }
      }
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.draggedObject || !this.moveMode) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = this.render.bounds.min.x + (mouseX / this.canvas.width) * (this.render.bounds.max.x - this.render.bounds.min.x);
      const worldY = this.render.bounds.min.y + (mouseY / this.canvas.height) * (this.render.bounds.max.y - this.render.bounds.min.y);
      
      this.draggedObject.Position = {
        x: worldX - this.dragOffset.x,
        y: worldY - this.dragOffset.y
      };
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.draggedObject = null;
    });
  }

  setMoveMode(enabled: boolean) {
    this.moveMode = enabled;
  }
}