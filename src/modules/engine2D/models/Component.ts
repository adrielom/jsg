import { v4 as uuid } from "uuid";
import type { GameObject } from "./GameObject";

export abstract class Component {
  hash = uuid();
  gameObject: GameObject | null = null;
  enabled = true;

  constructor() {}

  abstract getName(): string;
  
  onAttach(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  onDetach() {
    this.gameObject = null;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}