function initializeComicGrid() {
  const columnOrder = ["idFile", "title", "qty", "publisher", "year", "writers", "illustrators", "age", "cgc", "approx_cgc", "idLink", "notes"];
  
  fetch('/comics/comics.json')
    .then(response => response.json())
    .then(data => {
      let table = '<ul class="comic-grid">';
      data.forEach((item, index) => {
        table += '<li class="comic">';
        columnOrder.forEach(column => {
          if (column === 'idFile') {
            const mod = item.mod_id ? `-${item.mod_id}` : '';
            table += `<div><img class="comic-img" alt="A comic cover of ${item.cover_alt}" src="/comics/img/covers/${item.issue_id}${mod}.avif">`;
          } else if (column === 'title') {
            const issuePrefix = item.issue_prefix ? `${item.issue_prefix}` : '';
            const issueSuffix = item.issue_suffix ? `${item.issue_suffix}` : '';
            const issue = item.issue ? `#${item.issue}` : '';
            const issueDetails = issuePrefix || issue || issueSuffix ? ` ${issuePrefix}${issue}${issueSuffix}` : '';
            const lgy = item.lgy ? ` (${item.lgy})` : '';
            const variant = item.variant ? `${item.variant} Edition` : '';
            const printing = item.printing ? `${item.printing} Printing` : '';
            const variant_printing = variant && printing ? `${variant}, ${printing}` : `${variant}${printing}`;
            const variant_printing_html = variant_printing ? `<br><span class="label2">${variant_printing}</span>` : '';
            table += `<p class="comic-title">${item.title}${issueDetails}${lgy}${variant_printing_html}</p></div>`;
            // Wrap the button and content in a relative container
            table += `<div class="comic-content-wrapper">`;
            table += `<button class="collapsible" id="aboutMeButton-${index}" data-target-id="aboutMeContent-${index}">More info</button>`;
          } else if (column === 'qty') {
            table += `<div id="aboutMeContent-${index}" class="content-1" aria-hidden="true"><p style="margin-top: 15px"><span class="label">Qty:</span> ${item.qty}</p>`;
          } else if (column === 'publisher') {
            const shortname = item.shortname ? ` (${item.shortname})` : '';
            table += `<p><span class="label">Publisher:</span> ${item.publisher}${shortname}</p>`;
          } else if (column === 'year') {
            const month = item.month ? `-${String(item.month).padStart(2, '0')}` : '';
            const day = item.day ? `-${String(item.day).padStart(2, '0')}` : '';
            table += `<p><span class="label">Release Year:</span> <time datetime="${item.year}${month}${day}">${item.year}</time></p>`;
          } else if (column === 'writers') {
            const writers = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
            table += `<p><span class="label">Writer(s):</span> ${writers}</p>`;
          } else if (column === 'illustrators') {
            const illustrators = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
            table += `<p><span class="label">Illustrator(s):</span> ${illustrators}</p>`;
          } else if (column === 'age') {
            table += `<p><span class="label">Age:</span> ${item.age}</p>`;
          } else if (column === 'cgc') {
            const cgcValue = item.cgc ? (item.cgc === 10 ? '10' : item.cgc.toFixed(1)) : '';
            const cgc = cgcValue ? `<p><span class="label">CGC Grade:</span> ${cgcValue}</p>` : '';
            table += cgc;
          } else if (column === 'approx_cgc') {
            const approxCgcValue = item.approx_cgc ? (item.approx_cgc === 10 ? '10' : item.approx_cgc.toFixed(1)) : '';
            const approx_cgc = approxCgcValue ? `<p><span class="label">Approx CGC Grade:</span> ${approxCgcValue}</p>` : '';
            table += approx_cgc;
          } else if (column === 'idLink') {
            table += `<p>Database Link: <a target="_blank" tabindex="-1" href="https://www.comics.org/issue/${item.issue_id}/">${item.issue_id}</a></p>`;
          } else if (column === 'notes') {
            const hasNotes = Array.isArray(item[column]) && item[column].some(note => note.trim() !== '');
            const ifnotes = hasNotes ? item[column].join('<br><br>') : ' <span class="label2">none</span>';
            table += `<p><br><span class="label">Notes:</span>${hasNotes ? '<br>' : ''}${ifnotes}</p></div></div>`; // Close the wrapper div
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