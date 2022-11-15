import { circleLayout } from "../utils/circleLayout";
import { Vec } from "../utils/Vec";
import { Drawing } from "./Drawing";
import { Interactions } from "./Interactions";

export class GroupStar extends Interactions {
	private p: number;
	private g: number | null;

	public onG?: (g: number) => void;
	public onSet?: (set: Array<number>) => void;

	private hovering: number | null = null;

	private nodes: ReadonlyArray<Vec>;

	private startTime: number = 0;
	private static readonly PauseTime: number = 250;
	private static readonly DrawTime: number = 1000;
	private drawTime: number;
	private found: Array<number> = new Array<number>();
	private isDone: boolean = false;

	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this.P = 7;
	}

	protected draw(): void {
		this.clear();

		let shouldAddAnother = false;

		for (let i = 1; i < this.P; i++) {
			this.drawNode(this.nodes[i - 1]);
			this.drawLabel(this.nodes[i - 1], i.toString());
		}

		for (let i = 1; i < this.found.length; i++) {
			let percentage = 1;
			if (i + 1 === this.found.length) {
				percentage = Math.max(0, Math.min((this.time - this.startTime) / this.drawTime, 1));
				shouldAddAnother = percentage === 1;
			}
			this.drawArrow(this.nodes[this.found[i - 1] - 1], this.nodes[this.found[i] - 1], percentage);
		}

		if (this.G != null) {
			this.drawCircle(this.nodes[this.G - 1]);
		}

		if (this.hovering != null && this.hovering !== this.G) {
			this.drawCircle(this.nodes[this.hovering - 1], 0.5);
		}
		
		if (!this.isDone && shouldAddAnother) {
			if (this.found.some((n, i) => this.found.indexOf(n) !== i)) {
				this.isDone = true;
			}
			else {
				const current = this.found[this.found.length - 1];
				const next = this.calculateNext(current);
				this.found.push(next);
				this.onSet?.(this.found.slice(0, -1));
				this.startTime = this.time + GroupStar.PauseTime;
				this.setDrawTime();
			}
		}
	}

	protected override onMouseHover(point: Vec): void {
		const hit = this.hitTestNodes(point);
		if (hit != null) {
			this.canvas.style.cursor = "pointer";
		}
		else {
			this.canvas.style.cursor = null;
		}
		this.hovering = hit;
	}

	protected override onMouseClick(point: Vec): void {
		this.G = this.hitTestNodes(point);
		this.onG?.(this.G);
	}

	private hitTestNodes(point: Vec): number | null {
		for (let i = 1; i < this.p; i++) {
			if (this.nodes[i - 1].distanceTo(point) < Drawing.NodeRadius) {
				return i;
			}
		}
		return null;
	}

	public get P(): number {
		return this.p;
	}
	public set P(p: number) {
		this.p = p;
		this.nodes = circleLayout(this.p - 1);
		this.G = null;
	}

	public get G(): number {
		return this.g;
	}
	public set G(g: number | null) {
		if (g != null) {
			this.g = g;
			this.found = [1, this.g];
			this.isDone = false;
			this.startTime = this.time;
			this.setDrawTime();
			this.onSet?.(this.found.slice(0, -1));
		}
		else {
			this.g = null;
			this.found = new Array<number>();
			this.onSet?.(new Array<number>());
		}
	}

	private calculateNext(current: number): number {
		return (current * this.g) % this.p;
	}

	private setDrawTime(): void {
		const current = this.found[this.found.length - 2];
		const next = this.found[this.found.length - 1];
		this.drawTime = this.nodes[current - 1].distanceTo(this.nodes[next - 1]) / 2 * GroupStar.DrawTime;
	}
}
