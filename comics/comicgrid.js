function initializeComicGrid() {
 
 // Define the fixed column order based on the mapping
 const columnOrder = ["idFile", "title", "qty", "publisher", "year", "writers", "illustrators", "era", "cgc", "idLink"];
 
 fetch('/comics/comics.json')
 .then(response => response.json())
 .then(data => {
  let table = '';
  table += '<div class="comic-grid">'
        
     // Create table rows
  data.forEach(item => {
   table += '<div class="comic">';
   columnOrder.forEach(column => {
    if (column === 'idFile') {
     table += `<div><img class="comic-img" alt="Comic cover" src="/comics/img/covers/${item.id}.avif">`;
    } else if (column === 'title') {
     const issue = item.issue ? ` #${item.issue}` : '';
     const lgy = item.lgy ? ` (${item.lgy})` : '';
     const variant = item.variant ? `<br><span class="label2">${item.variant} Edition</span>` : '';
     table += `<p>${item.title}${issue}${lgy}${variant}</p></div><button class="collapsible" id="aboutMeButton" data-target-id="aboutMeContent">Learn More</button>`;
    } else if (column === 'qty') {
     table += `<div id="aboutMeContent" class="content"><p><span class="label">Qty:</span> ${item.qty}</p>`;
    } else if (column === 'publisher') {
     const shortname = item.shortname ? ` (${item.shortname})` : '';
     table += `<p><span class="label">Publisher:</span> ${item.publisher}${shortname}</p>`;
    } else if (column === 'year') {
     table += `<p><span class="label">Release Year:</span> ${item.year}</p>`; 
    } else if (column === 'writers'){
    const writers = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
    table += `<p><span class="label">Writer(s):</span> ${writers}</p>`;
    } else if (column === 'illustrators'){
     const illustrators = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
     table += `<p><span class="label">Illustrator(s):</span> ${illustrators}</p>`;
     } else if (column === 'era') {
      table += `<p><span class="label">Era:</span> ${item.era}</p>`;
     } else if (column === 'cgc') {
      table += `<p><span class="label">Approx CGC Grade:</span> ${item.cgc}</p>`;
     } else if (column === 'idLink') {
      table += `<p>Database Link: <a target="_blank" tabindex="-1" href="https://www.comics.org/issue/${item.id}/">${item.id}</a></p></div>`;
     } else {
     table += ``;
    }
   });
   table += '</div>';
  });

  document.getElementById('table-container').innerHTML = table;
 })
 .catch(error => console.error('Error loading table:', error));
console.log('Comic grid initialized');
};