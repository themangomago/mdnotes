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

const loadComponent = async (componentName, element, payload) => {
  try {
    // Load the module dynamically
    const { render } = await import(
      `./components/${componentName}/${componentName}.js`
    );

    // Call the render function from the loaded module
    render(element, payload);
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
