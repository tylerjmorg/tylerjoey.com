function initializeComicSort() {
const fs = require('fs');
const path = require('path');

// Function to sort comics based on the specified priorities
function sortComics(comics) {
  return comics.sort((a, b) => {
    // 1. Compare by shortname lexicographically
    if (a.shortname < b.shortname) return -1;
    if (a.shortname > b.shortname) return 1;

    // 2. If shortnames are the same, compare by series_start numerically
    if (a.series_start !== b.series_start) {
      return a.series_start - b.series_start;
    }

    // 3. If series_start are the same, compare by series_id numerically
    if (a.series_id !== b.series_id) {
      return a.series_id - b.series_id;
    }

    // 4. If series_id are the same, compare by issue numerically
    return a.issue - b.issue;
  });
}

// Path to the JSON file
const filePath = path.join(__dirname, 'comics', 'comics.json');

// Read JSON data from the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse JSON data
  const comics = JSON.parse(data);

  // Sort the comics
  const sortedComics = sortComics(comics);

  // Output the sorted result
  console.log(JSON.stringify(sortedComics, null, 2));
});
initializeComicGrid();
initializeCollapsible();
};
