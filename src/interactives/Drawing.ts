import { Vec } from "../utils/Vec";
import { opacity, themeColor } from "../utils/colors";
import { CanvasBased } from "./CanvasBased";

export abstract class Drawing extends CanvasBased {
	public static readonly ModelRadius: number = 1.4;

	public get width(): number {
		return this.canvas.width * this.scale;
	}
	public get height(): number {
		return this.canvas.height * this.scale;
	}
	public get scale(): number {
		return Drawing.ModelRadius / (Math.min(this.canvas.width / 3, this.canvas.height / 2));
	}
	public get screenCenter(): Vec {
		return new Vec(this.canvas.width * 2 / 3, this.canvas.height / 2);
	}

	public constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected toScreenSpace(point: Vec): Vec {
		return point.scale(1 / this.scale).add(this.screenCenter);
	}
	protected toModelSpace(point: Vec): Vec {
		return point.sub(this.screenCenter).scale(this.scale);
	}

	protected clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	protected drawFPS(deltaTime: number): void {
		this.ctx.fillStyle = themeColor("--color");
		this.ctx.font = "20px monospace";
		this.ctx.textBaseline = "top";
		this.ctx.textAlign = "right"
		this.ctx.fillText(`${(1000 / deltaTime).toFixed(0)}fps`, this.canvas.width - 5, 5);
	}

	public static readonly NodeRadius: number = 0.1;
	protected drawNode(point: Vec): void {
		const screenPoint = this.toScreenSpace(point);
		const screenRadius = Drawing.NodeRadius / this.scale;
		this.ctx.beginPath();
		this.ctx.fillStyle = themeColor("--border");
		this.ctx.ellipse(screenPoint.x, screenPoint.y, screenRadius, screenRadius, 0, 0, Math.PI * 2);
		this.ctx.fill();
	}
	public static readonly CircleRadius: number = Drawing.NodeRadius + 0.015;
	public static readonly CircleThickness: number = 0.005;
	protected drawCircle(point: Vec, o: number = 1): void {
		const screenPoint = this.toScreenSpace(point);
		const screenRadius = Drawing.CircleRadius / this.scale;
		this.ctx.beginPath();
		this.ctx.lineWidth = Drawing.CircleThickness / this.scale;
		this.ctx.setLineDash([]);
		this.ctx.strokeStyle = opacity(themeColor("--accent"), o);
		this.ctx.ellipse(screenPoint.x, screenPoint.y, screenRadius, screenRadius, 0, 0, Math.PI * 2);
		this.ctx.stroke();
	}

	public static readonly FontSize: number = 0.05;
	protected drawLabel(point: Vec, label: string): void {
		const screenPoint = this.toScreenSpace(point);
		this.ctx.fillStyle = themeColor("--color");
		this.ctx.font = `${(Drawing.FontSize / this.scale).toFixed(2)}px monospace`;
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center"
		this.ctx.fillText(label, screenPoint.x, screenPoint.y);
	}

	public static readonly ArrowThickness: number = 0.0075;
	public static readonly ArrowDash: number = 0.02;
	public static readonly ArrowWidth: number = 0.025;
	public static readonly ArrowLength: number = 0.05;
	protected drawArrow(from: Vec, to: Vec, percentage: number): void {
		const diff = to.sub(from);
		const screenFrom = this.toScreenSpace(from.add(diff.withLength(Drawing.NodeRadius)));
		const screenMaxTo = this.toScreenSpace(to.sub(diff.withLength(Drawing.NodeRadius)));
		const screenTo = screenFrom.add(screenMaxTo.sub(screenFrom).scale(percentage));

		const midPointDiff = screenTo.sub(screenFrom).scale(0.5);
		const arrowNormal = new Vec(midPointDiff.y, -midPointDiff.x).withLength(Drawing.ArrowWidth / this.scale);
		const arrowDrawBack = screenTo.sub(midPointDiff.withLength(Math.min(Drawing.ArrowLength / this.scale, screenTo.sub(screenFrom).length)));
		const rightArrowPoint = arrowDrawBack.sub(arrowNormal);
		const leftArrowPoint = arrowDrawBack.add(arrowNormal);

		this.ctx.beginPath();
		this.ctx.lineWidth = Drawing.ArrowThickness / this.scale;
		this.ctx.lineCap = "butt";
		this.ctx.lineDashOffset = Drawing.ArrowDash / this.scale;
		this.ctx.setLineDash([Drawing.ArrowDash / this.scale, Drawing.ArrowDash * 1.5 / this.scale]);
		this.ctx.strokeStyle = opacity(themeColor("--color"), 0.75);
		this.ctx.moveTo(screenFrom.x, screenFrom.y);
		this.ctx.lineTo(arrowDrawBack.x, arrowDrawBack.y);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.fillStyle = themeColor("--color");
		this.ctx.moveTo(rightArrowPoint.x, rightArrowPoint.y);
		this.ctx.lineTo(screenTo.x, screenTo.y);
		this.ctx.lineTo(leftArrowPoint.x, leftArrowPoint.y);
		this.ctx.closePath();
		this.ctx.fill();
	}
}
