function initializeComicGrid() {
 const columnOrder = ["idFile", "title", "qty", "publisher", "year", "writers", "illustrators", "era", "cgc", "idLink", "notes"];
 
 fetch('/comics/comics.json')
   .then(response => response.json())
   .then(data => {
     let table = '<ul class="comic-grid">';
     data.forEach((item, index) => {
       table += '<li class="comic">';
       columnOrder.forEach(column => {
         if (column === 'idFile') {
           table += `<div><img class="comic-img" alt="Comic cover" src="/comics/img/covers/${item.id}.avif">`;
         } else if (column === 'title') {
           const issue = item.issue ? ` #${item.issue}` : '';
           const lgy = item.lgy ? ` (${item.lgy})` : '';
           const variant = item.variant ? `<br><span class="label2">${item.variant} Edition</span>` : '';
           table += `<p>${item.title}${issue}${lgy}${variant}</p></div>`;
           // Assign a unique ID for the collapsible button and content
           table += `<button class="collapsible" id="aboutMeButton-${index}" data-target-id="aboutMeContent-${index}">More info</button>`;
         } else if (column === 'qty') {
           table += `<div id="aboutMeContent-${index}" class="content-1" aria-hidden="true"><p><span class="label">Qty:</span> ${item.qty}</p>`;
         } else if (column === 'publisher') {
           const shortname = item.shortname ? ` (${item.shortname})` : '';
           table += `<p><span class="label">Publisher:</span> ${item.publisher}${shortname}</p>`;
         } else if (column === 'year') {
           const month = item.month ? `-${item.month}` : '';
           const day = item.day ? `-${item.day}` : '';
           table += `<p><span class="label">Release Year:</span> <time datetime="${item.year}${month}${day}">${item.year}</time></p>`;
         } else if (column === 'writers') {
           const writers = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
           table += `<p><span class="label">Writer(s):</span> ${writers}</p>`;
         } else if (column === 'illustrators') {
           const illustrators = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
           table += `<p><span class="label">Illustrator(s):</span> ${illustrators}</p>`;
         } else if (column === 'era') {
           table += `<p><span class="label">Era:</span> ${item.era}</p>`;
         } else if (column === 'cgc') {
           table += `<p><span class="label">Approx CGC Grade:</span> ${item.cgc}</p>`;
         } else if (column === 'idLink') {
           table += `<p>Database Link: <a target="_blank" tabindex="-1" href="https://www.comics.org/issue/${item.id}/">${item.id}</a></p>`;
         } else if (column === 'notes') {
           const hasNotes = Array.isArray(item[column]) && item[column].some(note => note.trim() !== '');
           const ifnotes = hasNotes ? item[column].join('<br><br>') : ' <span class="label2">none</span>';
           table += `<p><br><span class="label">Notes:</span>${hasNotes ? '<br>' : ''}${ifnotes}</p></div>`;
         } else {
           table += ``;
         }
       });
       table += '</li>';
     });
     table += '</ul>';

     document.getElementById('table-container').innerHTML = table;
     // Initialize collapsibles after content is added
     initializeCollapsible();
   })
   .catch(error => console.error('Error loading table:', error));
 console.log('Comic grid initialized');
};