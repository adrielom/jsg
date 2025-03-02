import { v4 as uuid } from "uuid";
import type { Cell } from "@/shared/types/Cell";
import { Bodies } from "matter-js";
import EnumGeometry from "../enums/EnumGeometry";

export class Geometry extends Bodies implements Cell {
  hash = uuid();
  type: EnumGeometry = EnumGeometry.None;
}
