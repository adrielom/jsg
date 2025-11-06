export class MoveButton {
  private button: HTMLButtonElement;
  private moveMode = false;

  constructor(private canvas: HTMLCanvasElement, private onToggle: (enabled: boolean) => void) {
    this.button = this.createButton();
    this.setupButton();
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = 'Move';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = '#f0f0f0';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    this.canvas.parentElement!.style.position = 'relative';
    this.canvas.parentElement!.appendChild(button);
    
    return button;
  }

  private setupButton() {
    this.button.addEventListener('click', () => {
      this.moveMode = !this.moveMode;
      this.button.style.backgroundColor = this.moveMode ? '#007bff' : '#f0f0f0';
      this.button.style.color = this.moveMode ? 'white' : 'black';
      this.onToggle(this.moveMode);
    });
  }
}