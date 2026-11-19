/**
 * 这个文件专门进行频谱分析与绘制
 */

const fftSize = 128;
const barWidth = 2;
const barGap = 1;

let audioCtx: AudioContext | null;
let analyser: AnalyserNode | null;
let dataArray: Uint8Array<ArrayBuffer> | null;
let bufferLength: number | null = null;
let ctx: CanvasRenderingContext2D | null;
let canvas: HTMLCanvasElement;

const init = (audio: HTMLAudioElement) => {
  canvas = document.getElementById("thmr-spectrum-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");
  audioCtx = new window.AudioContext();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = fftSize;
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  draw();
};

const draw = () => {
  if (!audioCtx || !analyser || !dataArray || !bufferLength || !ctx) {
    return;
  }
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.5;

  let xf = canvas.width / 2 + barWidth / 2 + barGap / 2;
  let xb = canvas.width / 2 - barWidth / 2 - barGap / 2;

  for (let i = 0; i < bufferLength; i++) {
    // 取值 0-255
    const normal = dataArray[i] / 255;
    const barHeight = (canvas.height * normal) / 3;
    const grad = ctx.createLinearGradient(
      0,
      canvas.height,
      0,
      canvas.height - barHeight,
    );
    grad.addColorStop(0, "rgba(255,0,0,1)");
    grad.addColorStop(0.2, "rgba(255,0,0,1)");
    grad.addColorStop(1, "rgba(255,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(xf, canvas.height - barHeight, barWidth, barHeight);
    ctx.fillRect(xb, canvas.height - barHeight, barWidth, barHeight);
    xf += barWidth + barGap;
    xb -= barWidth + barGap;
  }
  requestAnimationFrame(draw);
};

export const Spectrum = {
  init,
};
