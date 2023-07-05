const saveBtn = document.querySelector("#save");
const textInput = document.querySelector("#text");
const fileInput = document.querySelector("#file");
const modeBtn = document.querySelector("#mode-btn");
const destroyBtn = document.querySelector("#destroy-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const colorOptions = Array.from(document.querySelectorAll(".color-option"));
const lineWidth = document.querySelector("#line-width");
const color = document.querySelector("#color");
const canvas = document.querySelector("canvas");
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext("2d");
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "68px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}
lineWidth.addEventListener("change", onLineWidthChange);

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
color.addEventListener("change", onColorChange);

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}
modeBtn.addEventListener("click", onModeClick);

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
destroyBtn.addEventListener("click", onDestroyClick);

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

eraserBtn.addEventListener("click", onEraserClick);

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
}
fileInput.addEventListener("change", onFileChange);

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
saveBtn.addEventListener("click", onSaveClick);
