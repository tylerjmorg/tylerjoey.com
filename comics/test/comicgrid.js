function initializeComicGrid() {
  fetch('/comics/comics.json')
    .then(response => response.json())
    .then(data => {
      const gridContainer = document.getElementById('table-container');
      const grid = document.createElement('ul');
      grid.classList.add('comic-grid'); // Ensure the container has the appropriate CSS grid class

      data.forEach((item, index) => {
        // Escape string values to prevent XSS
        for (let key in item) {
          if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
            item[key] = escapeHtmlEntities(item[key]);
          }
        }

        const listItem = document.createElement('li');
        listItem.classList.add('comic'); // CSS for individual comic items

        // Loop through item properties and display them
        listItem.appendChild(createImageElement(item, index));
        listItem.appendChild(createTitleElement(item, index));
        listItem.appendChild(createQuantityElement(item));
        listItem.appendChild(createPublisherElement(item));
        listItem.appendChild(createYearElement(item));
        listItem.appendChild(createCreatorElement(item, 'writers'));
        listItem.appendChild(createCreatorElement(item, 'illustrators'));
        listItem.appendChild(createAgeElement(item));
        listItem.appendChild(createCGCElement(item));
        listItem.appendChild(createApproxCGCElement(item));
        listItem.appendChild(createDatabaseLinkElement(item));
        listItem.appendChild(createNotesElement(item));

        grid.appendChild(listItem);
      });

      gridContainer.innerHTML = ''; // Clear existing content
      gridContainer.appendChild(grid);

      // Initialize collapsibles after content is added
      initializeCollapsible();
    })
    .catch(error => console.error('Error loading comics:', error));

  console.log('Comic grid initialized');
}

// Function to create the image section of each comic
function createImageElement(item, index) {
  const imgDiv = document.createElement('div');
  const mod = item.mod_id ? `-${item.mod_id}` : '';
  const altText = item.cover_alt ? item.cover_alt : '';
  const alt = altText ? `alt="A comic cover of ${altText}"` : '';

  const img = document.createElement('img');
  img.classList.add('comic-img');
  img.setAttribute('src', `/comics/img/covers/${item.issue_id}${mod}.avif`);
  img.setAttribute('alt', alt);

  imgDiv.appendChild(img);

  const button = document.createElement('button');
  button.classList.add('collapsible');
  button.setAttribute('id', `aboutMeButton-${index}`);
  button.setAttribute('data-target-id', `aboutMeContent-${index}`);
  button.textContent = 'More info';

  imgDiv.appendChild(button);
  return imgDiv;
}

function createTitleElement(item, index) {
  const { title = '', lgy } = item;
  const issueDetails = generateIssueDetails(item);
  const variantPrinting = generateVariantPrinting(item);

  const lgyText = lgy ? ` (${lgy})` : '';
  const titleText = `${title}${issueDetails}${lgyText}${variantPrinting}`;
  
  const titleParagraph = document.createElement('p');
  titleParagraph.textContent = titleText;

  return titleParagraph;
}

// Function to create the quantity section
function createQuantityElement(item) {
  const qtyParagraph = document.createElement('p');

  const labelSpan = document.createElement('span');
  labelSpan.classList.add('label');
  labelSpan.textContent = 'Qty:';

  qtyParagraph.appendChild(labelSpan);
  qtyParagraph.appendChild(document.createTextNode(` ${item.qty}`));

  return qtyParagraph;
}

// Function to create the publisher section
function createPublisherElement(item) {
  const publisherParagraph = document.createElement('p');

  const publisherText = document.createElement('span');
  publisherText.textContent = 'Publisher:';
  publisherText.classList.add('label');
  publisherParagraph.appendChild(publisherText);

  publisherParagraph.appendChild(document.createTextNode(` ${item.publisher || ''}`));

  if (item.shortname) {
    publisherParagraph.appendChild(document.createTextNode(` (${item.shortname})`));
  }

  return publisherParagraph;
}



// Function to create the release year section
function createYearElement(item) {
  const yearParagraph = document.createElement('p');
  const textNode = document.createTextNode('Release Year: ');

  const releaseDate = `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
  const timeTag = document.createElement('time');
  timeTag.setAttribute('datetime', releaseDate);
  timeTag.textContent = item.year;

  yearParagraph.appendChild(textNode);
  yearParagraph.appendChild(timeTag);

  return yearParagraph;
}

// Function to create the creator section (writers/illustrators)
function createCreatorElement(item, column) {
  const creatorDiv = document.createElement('div');
  const creators = Array.isArray(item[column]) ? item[column].join(', ') : item[column];
  const label = creators && Array.isArray(item[column]) && item[column].length === 1 ? column.slice(0, -1) : column;

  const creatorParagraph = document.createElement('p');
  creatorParagraph.classList.add('comic-creators');
  creatorParagraph.textContent = `${capitalizeFirstLetter(label)}: ${creators}`;
  creatorDiv.appendChild(creatorParagraph);
  return creatorDiv;
}

// Function to create the age section
function createAgeElement(item) {
  const ageDiv = document.createElement('div');
  const ageParagraph = document.createElement('p');
  ageParagraph.classList.add('comic-age');
  ageParagraph.textContent = `Age: ${item.age}`;
  ageDiv.appendChild(ageParagraph);
  return ageDiv;
}

// Function to create the CGC rating section
function createCGCElement(item) {
  const cgcDiv = document.createElement('div');
  const cgcValue = item.cgc ? (item.cgc === 10 ? '10' : item.cgc.toFixed(1)) : '';
  if (cgcValue) {
    const cgcParagraph = document.createElement('p');
    cgcParagraph.classList.add('comic-cgc');
    cgcParagraph.textContent = `CGC: ${cgcValue}`;
    cgcDiv.appendChild(cgcParagraph);
  }
  return cgcDiv;
}

// Function to create the approximate CGC section
function createApproxCGCElement(item) {
  const approxCgcDiv = document.createElement('div');
  const approxCgcValue = item.approx_cgc ? (item.approx_cgc === 10 ? '10' : item.approx_cgc.toFixed(1)) : '';
  if (approxCgcValue) {
    const approxCgcParagraph = document.createElement('p');
    approxCgcParagraph.classList.add('comic-approx-cgc');
    approxCgcParagraph.textContent = `Approx CGC: ${approxCgcValue}`;
    approxCgcDiv.appendChild(approxCgcParagraph);
  }
  return approxCgcDiv;
}

// Function to create the database link section
function createDatabaseLinkElement(item) {
  const link = document.createElement('a');
  link.setAttribute('href', `https://www.comics.org/issue/${item.issue_id}/`);
  link.setAttribute('target', '_blank');
  link.setAttribute('tabindex', '-1');
  link.textContent = item.issue_id;

  const linkParagraph = document.createElement('p');
  linkParagraph.textContent = 'Database Link: ';
  linkParagraph.appendChild(link);

  return linkParagraph;  // return only the <p> element
}

// Function to create the notes section
function createNotesElement(item) {
  const notesDiv = document.createElement('div');
  const notesParagraph = document.createElement('p');
  notesParagraph.classList.add('comic-notes');
  const notes = Array.isArray(item.notes) && item.notes.some(note => note.trim() !== '') ? item.notes.join(' ') : 'none';
  notesParagraph.textContent = `Notes: ${notes}`;
  notesDiv.appendChild(notesParagraph);
  return notesDiv;
}

// Helper function to generate the issue details (volume, number, etc.)
function generateIssueDetails(item) {
  const issuePrefix = item.issue_prefix || '';
  const issueSuffix = item.issue_suffix || '';
  const issueRep = item.issue_rep || '';
  const volumeRep = item.volume_rep || '';
  const volume = item.volume || '';
  const issue = item.issue || '';
  return `${issuePrefix}${volumeRep}${volume}${issueRep}${issue}${issueSuffix}`;
}

// Helper function to generate variant/printing information
function generateVariantPrinting(item) {
  const variant = item.variant ? `${item.variant} Edition` : '';
  const editionSuffix = item.edition_suffix ? ` ${item.edition_suffix}` : '';
  const printing = item.printing ? `${item.printing} Printing` : '';
  return variant || editionSuffix || printing ? `${variant}${editionSuffix}, ${printing}` : '';
}

function escapeHtmlEntities(str) {
  const element = document.createElement('div');
  if (str) {
    element.innerText = str;
    element.textContent = str;
  }
  return element.innerHTML;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
