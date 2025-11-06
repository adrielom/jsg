import { Component } from "../models/Component";

export class ScriptComponent extends Component {
  private _script: string = "";
  private _isRunning = false;
  private compiledScript: any = null;

  getName(): string {
    return "Script";
  }

  get script(): string {
    return this._script;
  }

  set script(value: string) {
    this._script = value;
    this.compileScript();
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  private compileScript() {
    if (!this._script) return;
    
    try {
      // Create a function that returns an object with lifecycle methods
      const func = new Function('gameObject', 'Component', `
        ${this._script}
        return {
          start: typeof start !== 'undefined' ? start : null,
          update: typeof update !== 'undefined' ? update : null,
          destroy: typeof destroy !== 'undefined' ? destroy : null,
          onCollisionEnter: typeof onCollisionEnter !== 'undefined' ? onCollisionEnter : null,
          onCollisionExit: typeof onCollisionExit !== 'undefined' ? onCollisionExit : null
        };
      `);
      
      this.compiledScript = func(this.gameObject, Component);
    } catch (error) {
      console.error(`Script compilation error in ${this.gameObject?.name}:`, error);
    }
  }

  start() {
    this._isRunning = true;
    if (this.compiledScript?.start) {
      try {
        this.compiledScript.start();
      } catch (error) {
        console.error(`Script start error in ${this.gameObject?.name}:`, error);
      }
    }
  }

  stop() {
    this._isRunning = false;
    if (this.compiledScript?.destroy) {
      try {
        this.compiledScript.destroy();
      } catch (error) {
        console.error(`Script destroy error in ${this.gameObject?.name}:`, error);
      }
    }
  }

  update(deltaTime: number) {
    if (!this._isRunning || !this.compiledScript?.update) return;
    
    try {
      this.compiledScript.update(deltaTime);
    } catch (error) {
      console.error(`Script update error in ${this.gameObject?.name}:`, error);
    }
  }

  // Legacy execute method
  execute() {
    if (!this._isRunning || !this._script) return;
    
    try {
      const func = new Function('gameObject', this._script);
      func(this.gameObject);
    } catch (error) {
      console.error(`Script error in ${this.gameObject?.name}:`, error);
    }
  }

  onAttach(gameObject: any) {
    super.onAttach(gameObject);
    this.compileScript();
  }
}