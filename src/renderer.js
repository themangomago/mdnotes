const { readDirectory, readFile, readNotesData, yaml } = window.electron;
const noteList = document.getElementById("note-list");
const metadataList = document.getElementById("metadata-list");

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

window.onload = () => {
  loadNotes();
  loadMetadata();
};
