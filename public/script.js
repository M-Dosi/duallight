// const { Collapse } = require("bootstrap");

const auditBtn = document.getElementById('auditBtn');

// function toggleAuditBtn() {
//     const onlyCategories = Array.from(checkboxes).filter(checkbox => checkbox.checked);
//     auditBtn.disabled = onlyCategories.length === 0; // Disable button if no categories are selected
// }

function toggleAuditBtn(disableDueToInput = false) {
    const onlyCategories = Array.from(checkboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    const hasSelectedCategories = onlyCategories.length > 0;
    const hasEmptyInput = disableDueToInput;
  
    auditBtn.disabled = !hasSelectedCategories || hasEmptyInput;
  }

async function getMap() {
    let map = [];
    try {
        const response = await fetch('http://localhost:3000/api/map');
        const body = await response.json();
        map = body.map;
        // console.log(body);
    } catch (error) {
        // console.error(error);
    }
    return map;
}

const maps = await getMap();
displayMapList(maps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

function displayMapList(maps) {
    const reports = document.getElementById('reports');
    reports.innerHTML = ''; // Clear any existing content

    // Create a container for the header, search input, and search button
    const container = document.createElement('div');
    container.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-4');

    // Create the header element
    // const header = document.createElement('h2');
    // header.innerText = 'Audit Reports';
    // header.classList.add('audit-label');

    // Create the search input field
    const searchInput = document.createElement('input');
    searchInput.classList.add( 'form-control', 'w-25'); // Use Bootstrap's form-control for styling
    searchInput.setAttribute('placeholder', 'Search...'); // Add placeholder text

    // Create the search button
    const searchButton = document.createElement('button');
    searchButton.classList.add('btn', 'btn-primary');

    // Append the header, search input, and search button to the container
    // container.appendChild(header);
    // container.appendChild(searchInput);

    // Add the container to the reports section
    reports.appendChild(container);

    const row = document.createElement('div');
    row.classList.add('row');  // Bootstrap row for grid layout



    


















  


    // Loop through maps and create the cards
    maps.forEach(item => {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'p-1');  // Use Bootstrap's grid system for columns

        // Extract the domain name without "www." and extension
        const formattedDomain = item.domaine.replace(/^www\./, '').split('.')[0].toUpperCase();

        // Create the card HTML using Bootstrap card components
        const cardHTML = `
        <div class="rpt-card h-100" data-map-id="${item.id}">
                <div class="card-body d-flex pb-0 ps-1 pe-1 pt-1">
                    <div class="collapse-btn pe-3  align-items-center justify-content-between">
                        <div class="card-title">${formattedDomain}</div>
                        <div data-bs-theme="dark" class="nowrap d-flex align-items-center ">
                        <div class="card-text">${formatDate(item.created_at)}</div>
                             <button type="button" class="btn-close" data-map-id="${item.id}" aria-label="Close"></button>
                        </div>
                    </div>
                    
                    <div class="collapse col">
                        <div class="">
                            ${item.urls.map((elem, index) => `
                                <a target="_blank" href="report/?id=${item.id}&domaine=${item.domaine}&routeIndex=${index}"
                                   class=" report-btn btn mb-1 w-100"
                                   id="${item.id}"
                                   data-route-index="${index}">
                                   ${elem.path[elem.path.length - 1]}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>


                
            </div>
        `;

        col.innerHTML = cardHTML;
        row.appendChild(col);
    });

    reports.appendChild(row);





// Get the sorting buttons
const sortByTimeButton = document.getElementById('sortByDate');
sortByTimeButton.textContent = 'Time';

const sortByFormattedDomainButton = document.getElementById('sortByDomain');
sortByFormattedDomainButton.textContent = 'Domain';

// Event listener for "Sort by Time" button
sortByTimeButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // If the "Sort by Time" button is already active, do nothing
    if (sortByTimeButton.classList.contains('active')) return;

    // console.log('Sort by Time button clicked');

    // Make the "Sort by Time" button active and remove from the other button
    sortByTimeButton.classList.add('active');
    sortByFormattedDomainButton.classList.remove('active');

    const sortedMaps = maps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    displayMapList(sortedMaps);
});

// Event listener for "Sort by Formatted Domain" button
sortByFormattedDomainButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // If the "Sort by Formatted Domain" button is already active, do nothing
    if (sortByFormattedDomainButton.classList.contains('active')) return;

    // console.log('Sort by Formatted Domain button clicked');

    // Make the "Sort by Formatted Domain" button active and remove from the other button
    sortByFormattedDomainButton.classList.add('active');
    sortByTimeButton.classList.remove('active');

    const sortedMaps = maps.sort((a, b) => {
        const formattedDomainA = a.domaine.replace(/^www\./, '').split('.')[0].toUpperCase();
        const formattedDomainB = b.domaine.replace(/^www\./, '').split('.')[0].toUpperCase();
        return formattedDomainA.localeCompare(formattedDomainB);
    });
    displayMapList(sortedMaps);
});






// Create the filter buttons div wrap
// const filterButtonsWrap = document.createElement('div');
// filterButtonsWrap.classList.add('d-flex', 'justify-content-between');

// Append the buttons to the filter buttons div wrap
// filterButtonsWrap.appendChild(sortByTimeButton);
// filterButtonsWrap.appendChild(sortByFormattedDomainButton);

// Append the filter buttons div wrap to the container
// container.appendChild(filterButtonsWrap);













// Collapse

const cards = document.querySelectorAll('.rpt-card');

cards.forEach((card) => {
  const collapseBtn = card.querySelector('.collapse-btn');
  const mapId = card.dataset.mapId;
//   console.log(mapId); // Add this line
  collapseBtn.addEventListener('click', (e) => {
    const collapse = card.querySelector('.collapse.col');
    // console.log(collapse); // Add this line
    collapse?.classList.toggle('show');
  });
});



    // Add functionality to search the content
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase(); // Get search query (case insensitive)

        // If no search term is entered, remove highlights
        if (!query) {
            removeHighlights();
            return;
        }

        // Get all cards in the reports section
        const cards = row.getElementsByClassName('rpt-card');

        // Loop through each card and highlight matching text
        Array.from(cards).forEach(card => {
            const cardElements = card.querySelectorAll('.card-title, .card-text, a'); // Select all relevant text elements in the card
            let matchFound = false;

            // Loop through text elements and highlight matching text
            cardElements.forEach(element => {
                highlightText(element, query);
                if (element.innerHTML.includes(query)) {
                    matchFound = true;
                }
            });

            // If no match is found in the card, hide it
            card.style.display = matchFound ? '' : 'none';
        });
    });

    // Highlight text within an element
    function highlightText(element, query) {
        const innerHTML = element.innerHTML;
        const index = innerHTML.toLowerCase().indexOf(query);
        if (index >= 0) {
            element.innerHTML = innerHTML.substring(0, index) + 
                `<span class="highlight">${innerHTML.substring(index, index + query.length)}</span>` + 
                innerHTML.substring(index + query.length);
        }
    }

    // Remove all highlights
    function removeHighlights() {
        const highlightedElements = document.querySelectorAll('.highlight');
        highlightedElements.forEach(el => {
            const parent = el.parentNode;
            parent.innerHTML = parent.innerHTML.replace(el.outerHTML, el.textContent);
        });
    }
}

// Adding event listeners to the buttons after the DOM has been updated
document.addEventListener('DOMContentLoaded', () => {
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        const id = btn.id;
        const domaine = maps.find(item => item.id === id).domaine;
        const routeIndex = btn.getAttribute('data-route-index');
        btn.href = `report/?id=${id}&domaine=${domaine}&routeIndex=${routeIndex}`;
        btn.target = '_blank';  // Open in a new tab
    });
});

async function getReport(id, domaine) {
    try {
        const response = await fetch('http://localhost:3000/report', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, domaine }),
        });
        const body = await response.json();
        // console.log(body);
    } catch (error) {
        console.error(error);
    }
}

const config = {
    urls: [],
    lighthouseOptions: {
        onlyCategories: [],
    },
    scanner: {
        device: 'mobile',
        throttle: false,
    }
};


// Create a container for the scanner settings
const scannerContainer = document.createElement('div');
scannerContainer.classList.add( 'align-items-center','pb-1', 'ps-4', 'pe-4', 'd-flex', 'flex-sm-row', 'pt-0', 'justify-content-between', 'flex-column');

// Create a label for the scanner device switch
const scannerEmptyTarget = document.createElement('label');
scannerEmptyTarget.textContent = 'min 1 target url and  min 1 checkbox!';
scannerContainer.appendChild(scannerEmptyTarget);

// Create a switch for the scanner device
const scannerDeviceSwitch = document.createElement('select');
scannerDeviceSwitch.classList.add('form-select', 'w-auto');
scannerDeviceSwitch.innerHTML = `
  <option value="mobile" selected>Mobile</option>
  <option value="desktop">Desktop</option>
`;
scannerContainer.appendChild(scannerDeviceSwitch);

// Add event listener to the scanner device switch
scannerDeviceSwitch.addEventListener('change', () => {
  config.scanner.device = scannerDeviceSwitch.value;
});

// Add the scanner container to the page
container.appendChild(scannerContainer);

scannerDeviceSwitch.addEventListener('change', () => {
    switch (scannerDeviceSwitch.value) {
      case 'mobile':
        config.scanner.device = 'mobile';
        break;
      case 'desktop':
        config.scanner.device = 'desktop';
        break;
    }
  });

// Create a container for the input fields
const inputContainer = document.createElement('div');
inputContainer.classList.add( 'pb-1', 'pt-0', 'ps-4', 'pe-4', 'd-flex', 'flex-sm-row', 'p-4', 'justify-content-between', 'flex-column');

// Create a wrapper for the input fields
const inputWrapper = document.createElement('div');
inputWrapper.classList.add('input-wrapper', 'w-100' );
inputContainer.appendChild(inputWrapper);

// Create an initial input field
const urlInput = document.createElement('input');
urlInput.type = 'text';
urlInput.placeholder = 'Enter URL';
urlInput.classList.add('form-control-url');
inputWrapper.appendChild(urlInput);

// Create a button container
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('d-flex', 'justify-content-between', 'url-button-wrap');
inputContainer.appendChild(buttonContainer);

// Create a button to add a new input field
const addInputBtn = document.createElement('button');
addInputBtn.textContent = 'Add URL';
addInputBtn.classList.add('btn', 'btn-success', 'w-auto',  'me-1');
buttonContainer.appendChild(addInputBtn);

// Create a button to remove the last input field
const removeInputBtn = document.createElement('button');
removeInputBtn.textContent = 'Remove URL';
removeInputBtn.classList.add('btn', 'btn-danger', 'w-auto');
buttonContainer.appendChild(removeInputBtn);

// Add event listener to the add button
addInputBtn.addEventListener('click', () => {
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.placeholder = 'Enter URL';
  newInput.classList.add('form-control-url', 'w-50');
  inputWrapper.appendChild(newInput);
});

// Add event listener to the remove button
removeInputBtn.addEventListener('click', () => {
  const inputs = inputWrapper.querySelectorAll('input');
  if (inputs.length > 1) {
    inputs[inputs.length - 1].remove();
  }
});

// Add event listener to the input fields
inputWrapper.addEventListener('input', () => {
  const inputs = inputWrapper.querySelectorAll('input');
  const urls = Array.from(inputs).map((input) => input.value.trim());
  config.urls = urls; // update the config object with the input values

  // Check if any input field is empty
  const hasEmptyInput = urls.includes('');

  // Disable audit button if any input field is empty
  if (hasEmptyInput) {
    toggleAuditBtn(true); // Pass true to disable the button
  } else {
    toggleAuditBtn(false); // Pass false to enable the button
  }



});

// Add the input container to the page
container.appendChild(inputContainer);

const checkboxes = document.querySelectorAll('input[name="onlyCategories"]');
const lighthouseOptions = config.lighthouseOptions;

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const onlyCategories = Array.from(checkboxes).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
      lighthouseOptions.onlyCategories = onlyCategories;
  
      const inputs = inputWrapper.querySelectorAll('input');
      const urls = Array.from(inputs).map((input) => input.value.trim());
      const hasEmptyInput = urls.includes('');
  
      if (hasEmptyInput) {
        toggleAuditBtn(true); // Pass true to disable the button
      } else {
        toggleAuditBtn(); // Call toggleAuditBtn() without argument to enable the button
      }
    });
  });
// Disable the button initially if no categories are selected
toggleAuditBtn();

auditBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/api/audit', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        });
        const body = await response.json();
        console.log(body);
    } catch (error) {
        console.error(error);
    }
});

function formatDate(tmstp) {
    const timestamp = tmstp;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const customFormattedDate = `${day}/${month}/${year} <br> ${hours}:${minutes}`;
    return customFormattedDate;
    // :${seconds}
}

// script.js close dugme vidi server za vise detalja

const btnCloseElements = document.querySelectorAll('.btn-close');

btnCloseElements.forEach((btnClose) => {
  btnClose.addEventListener('click', (e) => {
    const mapId = e.target.dataset.mapId;
    fetch('/update-map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapId: mapId }),
    }).then(res => {
      return res;
    }).then(async (data) => {
      const maps = await getMap();
      displayMapList(maps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      window.location.reload();
    });
  });
});