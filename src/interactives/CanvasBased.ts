export abstract class CanvasBased {
	protected readonly canvas: HTMLCanvasElement;
	protected readonly ctx: CanvasRenderingContext2D;

	protected deltaTime: number = 0;
	protected time: number = 0;
	private frameAnimationId: number | null = null;

	public constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");

		this.onFrame = this.onFrame.bind(this);
		this.frameAnimationId = window.requestAnimationFrame(this.onFrame);
	}

	private onFrame(time: number): void {
		this.updateSize();

		if (this.time > 0) {
			this.deltaTime = time - this.time;
			this.time = time;
			this.draw();
		}
		this.time = time;

		if (this.frameAnimationId != null) {
			window.requestAnimationFrame(this.onFrame);
		}
	}

	private updateSize(): void {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
	}

	protected abstract draw(): void;

	public dispose(): void {
		window.cancelAnimationFrame(this.frameAnimationId);
		this.frameAnimationId = null;
	}
}
