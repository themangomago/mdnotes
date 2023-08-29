const { readDirectory, readFile, readNotesData, yaml, ipcRenderer } =
  window.electron;

const bridge = async (channel, payload) => {
  const response = await ipcRenderer.invoke(channel, payload);
  return response;
};

const loadComponent = async (componentName, element, payload) => {
  try {
    // Load the module dynamically
    const { render } = await import(
      `./components/${componentName}/${componentName}.js`
    );

    // Call the render function from the loaded module
    render(element, payload);

    // Set up a MutationObserver to wait for nested components to be added
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          const nestedComponentElements = element.querySelectorAll("component");
          nestedComponentElements.forEach((nestedElement) => {
            const nestedModuleName = nestedElement.getAttribute("module");
            const nestedPayload = nestedElement.getAttribute("payload");
            if (nestedModuleName) {
              loadComponent(nestedModuleName, nestedElement, nestedPayload);
            }
          });
          // Disconnect the observer once components have been processed
          observer.disconnect();
        }
      }
    });

    // Start observing the target element
    observer.observe(element, { childList: true, subtree: true });
  } catch (error) {
    console.error(`Error loading component: ${componentName}`);
    console.error(error);
  }
};

function loadComponents() {
  const componentElements = document.querySelectorAll("component");

  componentElements.forEach((element) => {
    const moduleName = element.getAttribute("module");
    const payload = element.getAttribute("payload");

    if (moduleName) {
      loadComponent(moduleName, element, payload);
    }
  });
}

window.onload = () => {
  loadComponents();
};
