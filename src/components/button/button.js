// components/button.js
const { ejs } = window.electron;

const render = async (target, payload) => {
  const template = await fetch(`components/button/button.ejs`).then(
    (response) => response.text()
  );

  const compiledTemplate = ejs.compile(template);
  const renderedHtml = compiledTemplate({ text: payload });

  target.outerHTML = renderedHtml;

  const button = target.querySelector("button");
  button.addEventListener("click", () => {
    console.log("Button Payload:", payload);
  });
};

export { render };
