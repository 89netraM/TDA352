import { GroupStar } from "./interactives/GroupStar";
import "./styles/index.scss";

const canvas = document.querySelector("canvas");
const groupStar = new GroupStar(canvas);
const pInput = document.getElementById("p") as HTMLInputElement;
const pRange = document.getElementById("pRange") as HTMLInputElement;
const gInput = document.getElementById("g") as HTMLInputElement;
const gRange = document.getElementById("gRange") as HTMLInputElement;
const setElement = document.getElementById("set");

groupStar.onG = updateG;
groupStar.onSet = updateSet;
pInput.addEventListener("change", () => updateP(pInput.valueAsNumber), true);
pRange.addEventListener("input", () => updateP(pRange.valueAsNumber), true);
gInput.addEventListener("change", () => updateG(gInput.valueAsNumber), true);
gRange.addEventListener("input", () => updateG(gRange.valueAsNumber), true);

function updateP(p: number): void {
	if (Number.isSafeInteger(p)) {
		if (pInput.valueAsNumber !== p) {
			pInput.valueAsNumber = p;
		}
		if (pRange.valueAsNumber !== p) {
			pRange.valueAsNumber= p;
		}
		if (groupStar.P !== p) {
			gInput.max = (p - 1).toFixed(0);
			gInput.value = null;
			gRange.max = (p - 1).toFixed(0);
			gRange.valueAsNumber = 0;
			groupStar.P = p;
		}
	}
}
function updateG(g: number): void {
	const gString = g?.toFixed(0) ?? "";
	if (gInput.value !== gString) {
		gInput.value = gString;
	}
	if (gRange.valueAsNumber !== g ?? 0) {
		gRange.valueAsNumber = g ?? 0;
	}
	if (groupStar.G !== g) {
		groupStar.G = g;
	}
}
function updateSet(set: Array<number>): void {
	setElement.innerText = "{" + set.join(", ") + "}";
}

if (!("MathMLElement" in window)) {
	document.getElementById("headerMath").outerHTML = `<span>Z<sub>p</sub><sup style="position: relative; left: -1ch; margin-right: -1ch">*</sup>=&lt;g&gt;</span>`;
	document.getElementById("pMath").outerHTML = "p";
	document.getElementById("gMath").outerHTML = "g";
}
