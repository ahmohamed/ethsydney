const fs = require("fs");
const path = require("path");

const imagesFolder = "images"; // Replace with your images folder name
const metadataFolder = "metadata"; // Replace with your metadata folder name

function updateMetadata(imageName, index) {
  const imageFilename = path.join(imagesFolder, imageName);

  // Extract image number from filename (assuming numbers are at the beginning)
  const imageNumber = index;

  // Construct potential metadata filename based on numbering
  const metadataFilename = `metadata-${imageNumber}.json`;
  const metadataPath = path.join(metadataFolder, metadataFilename);

  if (!fs.existsSync(metadataPath)) {
    console.warn(
      `Skipping update: Metadata file not found - ${metadataFilename}`
    );
    return;
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    metadata.name = imageName.replace(/\.[^/.]+$/, ""); // Remove extension
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Updated name in metadata file: ${metadataPath}`);
  } catch (err) {
    console.error(`Error updating metadata for ${imageName}:`, err);
  }
}

// Enumerate files in the images folder
fs.readdirSync(imagesFolder).forEach(updateMetadata);
