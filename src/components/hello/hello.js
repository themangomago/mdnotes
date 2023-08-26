const { ejs } = window.electron;

// Function to render the hello component
const render = async (target, payload) => {
  const template = await fetch(`components/hello/hello.ejs`).then((response) =>
    response.text()
  );

  console.log("data:" + target + " " + payload);

  // const compiledTemplate = ejs.compile(template);
  // const renderedHtml = compiledTemplate({ text: customText });
  // Assume you have a "ejs" function that compiles and renders the template
  const renderedHtml = ejs.render(template, { text: payload });

  target.innerHTML = renderedHtml;
};

// Export the render function

export { render };
