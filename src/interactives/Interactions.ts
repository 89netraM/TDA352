import { Vec } from "../utils/Vec";
import { Drawing } from "./Drawing";

export abstract class Interactions extends Drawing {
	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.canvas.addEventListener("mousemove", this.onMouseMove, true);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.canvas.addEventListener("mousedown", this.onMouseDown, true);
	}

	private onMouseMove(e: MouseEvent): void {
		this.onMouseHover(this.toModelSpace(new Vec(e.clientX, e.clientY)));
	}
	protected onMouseHover(point: Vec): void { }

	private onMouseDown(e: MouseEvent): void {
		this.onMouseClick(this.toModelSpace(new Vec(e.clientX, e.clientY)));
	}
	protected onMouseClick(point: Vec): void { }

	public override dispose(): void {
		super.dispose();
		this.canvas.removeEventListener("mousedown", this.onMouseDown, true);
	}
}
