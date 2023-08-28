const { ejs } = window.electron;

// Function to render the hello component
const render = async (target, payload) => {
  const template = await fetch(`components/sidebar/sidebar.ejs`).then(
    (response) => response.text()
  );

  // const compiledTemplate = ejs.compile(template);
  // const renderedHtml = compiledTemplate({ text: customText });
  // Assume you have a "ejs" function that compiles and renders the template
  const renderedHtml = ejs.render(template, { text: payload });

  target.outerHTML = renderedHtml;

  // Add event listeners
  const toggleButton = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const sidebarElements = document.querySelectorAll(".sidebar-toggle");

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    sidebarElements.forEach(function (element) {
      element.classList.toggle("visible");
      element.classList.toggle("invisible");
    });
  });
};

// Export the render function

export { render };
