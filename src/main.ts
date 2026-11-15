// 插件内联 CSS
import "./style.css";

const init = () => {
  const widget = document.createElement("div");
  widget.classList.add("thmr-container");
  widget.innerHTML = `
<span>hello thmr-web-plugin!</span>
  `;
  document.body.appendChild(widget);
};

init();
