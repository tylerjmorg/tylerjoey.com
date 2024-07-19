document.addEventListener('DOMContentLoaded', () => {
 // Define the mapping between JSON keys and column headers
 const columnMapping = {
  "qty": "Qty",
  "idFile": "Cover",
  "publisher": "Publisher",
  "title": "Comic Title",
  "year": "Release Year",
  "writers": "Writer(s)",
  "illustrators": "Illustrator(s)",
  "era": "Era",
  "cgc": "Approx<br>CGC Grade",
  "idLink": "Database Link",
  "notes": "Notes",
 };
 
 // Define the fixed column order based on the mapping
 const columnOrder = ["qty", "idFile", "publisher", "title", "year", "writers", "illustrators", "era", "cgc", "idLink", "notes"];
 
 fetch('/comics/comics.json')
 .then(response => response.json())
 .then(data => {
  let table = '<table><thead><tr>';
      
  // Create table header based on the column mapping
  columnOrder.forEach(column => {
  table += `<th>${columnMapping[column]}</th>`;
 });
 table += '</tr></thead><tbody>';
        
     // Create table rows
  data.forEach(item => {
   table += '<tr>';
   columnOrder.forEach(column => {
    if (column === 'idFile') {
     table += `<td><img height="75" width="49" alt="Comic cover" src="/comics/img/covers/${item.id}.avif"></td>`;
    } else if (column === 'idLink') {
     table += `<td><a target="_blank" href="https://www.comics.org/issue/${item.id}/">${item.id}</a></td>`;
    } else if (column === 'title') {
     const issue = item.issue ? ` #${item.issue}` : '';
     const lgy = item.lgy ? ` (${item.lgy})` : '';
     const variant = item.variant ? `<br><span class="label2">${item.variant} Edition</span>` : '';
     table += `<td>${item.title}${issue}${lgy}${variant}</td>`;
    } else if (column === 'publisher') {
     const shortname = item.shortname ? ` (${item.shortname})` : '';
     table += `<td>${item.publisher}${shortname}</td>`;
    } else {
     const cellValue = Array.isArray(item[column]) ? item[column].join('<br>') : item[column];
     table += `<td>${cellValue}</td>`;
    }
   });
   table += '</tr>';
  });
  table += '</tbody></table>';

  document.getElementById('table-container').innerHTML = table;
 })
 .catch(error => console.error('Error loading table:', error));
});