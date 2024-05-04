const fs = require('fs');
const path = require('path');

const baseImageURL = 'https://bafybeibm5kcupvkixeieonzisk4slwigc2zxesmj3dt3wx4oawybupnfza.ipfs.nftstorage.link/';
const externalURL = 'https://ethsydney.vercel.app'; // Replace with your desired external URL
const description = 'Connekt NFTs represent your identity on the connekt app'; // Replace with a more descriptive text

const numberOfImages = 97;

function generateMetadata(imageIndex) {
  const filename = `metadata-${imageIndex}.json`;
  const metadata = {
    name: `#${imageIndex}`,
    description,
    image: `${baseImageURL}${imageIndex}.jpg`,
    external_url: externalURL,
    attributes: [
      {
        trait_type: 'id',
        value: imageIndex.toString(),
      },
    ],
  };

  const filePath = path.join(__dirname, filename); // Create path relative to script location

  fs.writeFile(filePath, JSON.stringify(metadata, null, 2), (err) => {
    if (err) {
      console.error('Error writing metadata:', err);
    } else {
      console.log(`Generated metadata file: ${filename}`);
    }
  });
}

for (let i = 0; i < numberOfImages; i++) {
  generateMetadata(i);
}
