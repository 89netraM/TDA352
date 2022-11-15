import { Vec } from "./Vec";

export function circleLayout(count: number): Array<Vec> {
	const layout = new Array<Vec>();

	const radiusVec = new Vec(0, -1);
	for (let i = 0; i < count; i++) {
		const angle = Math.PI * 2 * (i / count);
		const pos = radiusVec.rotate(angle);
		layout.push(pos)
	}

	return layout;
}
