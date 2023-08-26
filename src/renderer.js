const { readDirectory, readFile, readNotesData, yaml, ipcRenderer } =
  window.electron;
const noteList = document.getElementById("note-list");
const metadataList = document.getElementById("metadata-list");

import { render } from "./components/hello/hello.js";

var notesData = [];

async function loadNotes() {
  const notesDirectory = "./notes"; // Replace with the actual path

  try {
    const files = await readDirectory(notesDirectory);
    for (const file of files) {
      const filePath = `${notesDirectory}/${file}`;
      const fileContent = await readFile(filePath);

      const matches = fileContent.match(/^---\s*([\s\S]*?)\s*---/);
      if (matches && matches.length > 1) {
        const frontMatter = matches[1];
        const metadata = yaml.load(frontMatter);

        const listItem = document.createElement("li");
        listItem.textContent = metadata.title || file;
        noteList.appendChild(listItem);

        // Store metadata and file path
        notesData.push({
          filePath,
          metadata,
        });
      }
    }
  } catch (error) {
    console.error("Error reading notes directory:", error);
  }
}

async function loadMetadata() {
  notesData = await readNotesData();
  notesData.forEach(({ filePath, metadata }) => {
    const metadataItem = document.createElement("li");
    metadataItem.textContent = `${metadata.title || filePath} - Tags: ${
      metadata.tags || "N/A"
    }`;
    metadataList.appendChild(metadataItem);
  });
}

// Load and render components
const renderComponent = async (componentName) => {
  // const template = await fetch(
  //   `components/${componentName}/${componentName}.hbs`
  // ).then((response) => response.text());
  // const compiledTemplate = Handlebars.compile(template);
  // const renderedHtml = compiledTemplate();

  // document.getElementById(`component-${componentName}`).innerHTML =
  //   renderedHtml;
  render();
};

// const loadComponent = async (componentName, element, payload) => {
//   try {
//     // Load the module dynamically
//     const { render } = await import(
//       `./components/${componentName}/${componentName}.js`
//     );

//     // Call the render function from the loaded module
//     render(element, payload);
//   } catch (error) {
//     console.error(`Error loading component: ${componentName}`);
//     console.error(error);
//   }
// // };
// const loadComponent = async (componentName, element, payload) => {
//   try {
//     // Load the module dynamically
//     const { render } = await import(
//       `./components/${componentName}/${componentName}.js`
//     );

//     console.log("loadComponent:" + componentName);

//     // Call the render function from the loaded module
//     render(element, payload);

//     console.log(element);

//     // Recursively process nested components
//     const nestedComponentElements = element.querySelectorAll("component");
//     console.log("nestedComponentElements:" + nestedComponentElements);
//     console.log("size:" + nestedComponentElements.length);

//     nestedComponentElements.forEach((nestedElement) => {
//       console.log("nestedElement:" + nestedElement);
//       const nestedModuleName = nestedElement.getAttribute("module");
//       const nestedPayload = nestedElement.getAttribute("payload");
//       if (nestedModuleName) {
//         loadComponent(nestedModuleName, nestedElement, nestedPayload);
//       }
//     });
//   } catch (error) {
//     console.error(`Error loading component: ${componentName}`);
//     console.error(error);
//   }
// };

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

// Find all <component> elements and load their specified components
document.addEventListener("DOMContentLoaded", () => {
  const componentElements = document.querySelectorAll("component");

  componentElements.forEach((element) => {
    const moduleName = element.getAttribute("module");
    const payload = element.getAttribute("payload");

    if (moduleName) {
      loadComponent(moduleName, element, payload);
    }
  });
});

window.onload = () => {
  loadNotes();
  loadMetadata();
  //renderComponent("hello");
};
