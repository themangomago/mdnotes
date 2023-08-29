const { ejs, bridge } = window.electron;

var activeId = 0;

// Function to render the hello component
const render = async (target, payload) => {
  const notesData = await bridge("get-notes", null);
  const template = await fetch(`components/sidebar/sidebar.ejs`).then(
    (response) => response.text()
  );

  const renderedHtml = ejs.render(template, {
    notes: notesData,
    activeId: activeId,
  });

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
