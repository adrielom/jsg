import { Render, Mouse, Events, type IRendererOptions } from "matter-js";
import type { IEngine2D } from "../types/IEngine2D";
import type { IRender2D } from "../types/IRender2D";
import { ZoomPanControl } from "../controls/ZoomPanControl";
import { DragControl } from "../controls/DragControl";
import { MoveButton } from "../controls/MoveButton";

export class RenderFactory {
  engine: IEngine2D | null = null;
  render: IRender2D | null = null;
  element: HTMLElement | null = null;
  mouse = Mouse;
  private gameObjects: any[] = [];
  private zoomPanControl?: ZoomPanControl;
  private dragControl?: DragControl;
  private moveButton?: MoveButton;

  constructor(_engine: IEngine2D, _element: HTMLElement, gameObjects: any[] = []) {
    this.engine = _engine;
    this.element = _element;
    this.gameObjects = gameObjects;
  }

  create(options?: IRendererOptions) {
    try {
      let canvas: HTMLCanvasElement;
      
      if (this.element instanceof HTMLCanvasElement) {
        canvas = this.element;
      } else {
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        this.element!.appendChild(canvas);
      }
      
      const render = Render.create({
        canvas: canvas,
        engine: this.engine!,
        options: {
          width: 800,
          height: 600,
          wireframes: false,
          background: '#dddddd',
          showVelocity: false,
          showCollisions: true,
          showAngleIndicator: false,
          showDebug: false,
          ...options
        },
      });
      
      // Store render reference
      this.render = render;
      
      // Add sprite rendering
      Events.on(render, 'afterRender', () => {
        this.renderSprites(render.canvas, render.context);
      });
      
      // Initialize controls
      this.setupControls(canvas, render);
      
      return render;
    } catch (e) {
      throw new Error("Not able to create render " + (e as Error).message);
    }
  }
  
  private renderSprites(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!this.render?.bounds) return;
    
    ctx.save();
    this.applyCameraTransform(canvas, ctx);
    
    this.gameObjects.forEach(gameObject => {
      this.renderGameObjectSprite(ctx, gameObject);
    });
    
    ctx.restore();
  }
  
  private applyCameraTransform(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const bounds = this.render!.bounds;
    const scaleX = canvas.width / (bounds.max.x - bounds.min.x);
    const scaleY = canvas.height / (bounds.max.y - bounds.min.y);
    const offsetX = -bounds.min.x * scaleX;
    const offsetY = -bounds.min.y * scaleY;
    
    ctx.scale(scaleX, scaleY);
    ctx.translate(offsetX / scaleX, offsetY / scaleY);
  }
  
  private renderGameObjectSprite(ctx: CanvasRenderingContext2D, gameObject: any) {
    const sprite = gameObject.getComponent("Sprite");
    if (!sprite || !sprite.visible) return;
    
    ctx.save();
    this.applyTransform(ctx, gameObject);
    
    const { width, height } = this.getSpriteSize(gameObject);
    this.drawSprite(ctx, sprite, width, height);
    
    ctx.restore();
  }
  
  private applyTransform(ctx: CanvasRenderingContext2D, gameObject: any) {
    const transform = gameObject.getComponent("Transform");
    
    const posX = transform?.position?.x || gameObject.Position?.x || 0;
    const posY = transform?.position?.y || gameObject.Position?.y || 0;
    const rotation = transform?.rotation || 0;
    const scaleX = transform?.scale?.x || 1;
    const scaleY = transform?.scale?.y || 1;
    
    ctx.translate(posX, posY);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);
  }
  
  private getSpriteSize(gameObject: any): { width: number; height: number } {
    const rigidBody = gameObject.getComponent("RigidBody");
    
    if (rigidBody?.body) {
      return {
        width: rigidBody.body.bounds.max.x - rigidBody.body.bounds.min.x,
        height: rigidBody.body.bounds.max.y - rigidBody.body.bounds.min.y
      };
    }
    
    return { width: 50, height: 50 };
  }
  
  private drawSprite(ctx: CanvasRenderingContext2D, sprite: any, width: number, height: number) {
    ctx.globalAlpha = sprite.opacity;
    
    if (sprite.imageUrl && sprite.texture) {
      this.drawSpriteImage(ctx, sprite, width, height);
    } else {
      this.drawSpriteRectangle(ctx, sprite, width, height);
    }
  }
  
  private drawSpriteImage(ctx: CanvasRenderingContext2D, sprite: any, width: number, height: number) {
    const img = new Image();
    img.src = sprite.texture;
    if (img.complete) {
      ctx.drawImage(img, -width/2, -height/2, width, height);
    }
  }
  
  private drawSpriteRectangle(ctx: CanvasRenderingContext2D, sprite: any, width: number, height: number) {
    ctx.fillStyle = sprite.color;
    ctx.fillRect(-width/2, -height/2, width, height);
  }
  
  private findGameObjectByBody(body: any) {
    return this.gameObjects.find(obj => {
      const rb = obj.getComponent?.("RigidBody");
      return rb && rb.body === body;
    }) || null;
  }
  
  private setupControls(canvas: HTMLCanvasElement, render: any) {
    // Initialize render bounds
    render.bounds = {
      min: { x: 0, y: 0 },
      max: { x: canvas.width, y: canvas.height }
    };
    
    // Create control instances
    this.zoomPanControl = new ZoomPanControl(canvas, render);
    this.dragControl = new DragControl(canvas, render, this.findGameObjectByBody.bind(this), this.engine);
    this.moveButton = new MoveButton(canvas, (enabled) => {
      this.dragControl?.setMoveMode(enabled);
    });
  }
}
