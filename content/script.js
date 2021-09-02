// Gets the list of search results to modify.
var resultsList = document.querySelector('ul#main-content');

// Injects the extension's CSS.
// var immowebPlusCss = document.createElement('link');
// immowebPlusCss.rel = 'stylesheet';
// immowebPlusCss.type = 'text/css';
// immowebPlusCss.href = chrome.extension.getURL('content/style.css');
// (document.head || document.documentElement).appendChild(immowebPlusCss);

/* ************************************************************************************ *\
	Mark the properties' availability using colours or diplay.
\* ************************************************************************************ */

var displayMode;

var offMarketKeywords = [
	'sous option', 'onder optie', 'in optie', 'under option', 'option',
	'sous offre', 'onder aanbod', 'under offer',
	'offre acceptee', 'offre acceptée', 'offer accepted',
	'sous compromis', 'compromis',
	'fin des visites', 'visites suspendues', 'einde van de bezoeken', 'end of visits',
	'visites indisponibles', 'geen bezoek',
	'stop bezoek', 'stop visit',
	'vendu', 'verkocht', 'sold',
];

// Reads the property's description and checks if it contains terms from offMarketKeywords.
function hasOffMarketDescription(property)
{
	let description = property.querySelector('.card__description.card--result__description');
	if (description != null)
	{
		description = description.innerText.toLowerCase();
		for (let keyword of offMarketKeywords)
			if (description.includes(keyword))
				return true;
	}
	return false;
}

// Reads the property's tags and checks if "under option" is among them.
function hasOffMarketTag(property)
{
	let tagNodes = property.querySelectorAll('.flag-list__text');
	let tagArray = [].slice.call(tagNodes);
	let tags = tagArray.map(function(tag)
	{
		return tag.innerText.toLowerCase().trim();
	});
	if (tags.includes('sous option') ||
		tags.includes('onder optie') ||
		tags.includes('under option'))
		return true;
	return false;
}

// Calls the previous functions to check the property's availability then
// changes its display based on the displayMode selected in the popup.
function defineVisibility(property)
{
	let isOffMarket = (hasOffMarketDescription(property) || hasOffMarketTag(property));

	if (displayMode == 'highlight')
		property.style.backgroundColor = (isOffMarket ? '#FDD5C1' : '#CBF8CB');
	else if (displayMode == 'hide')
	{
		if (isOffMarket)
			property.style.display = 'none';
		else
			property.style = '';
	}
}

/* ************************************************************************************ *\
	Add action buttons.
\* ************************************************************************************ */

/*
hover
	background:linear-gradient(to bottom, #0061a7 5%, #007dc1 100%);
	background-color:#0061a7;
*/

/*
hover
	background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
	background-color:#bc3315;
*/

function addButtons(property)
{
	// // Removes agency logo to make space.
	// var logo = property.querySelector('.card__logo-container.card--result__logo-container');
	// if (logo)
	// 	logo.style.display = 'none';

	// Adds a box to hold the buttons in one space.
	var buttonsBox = document.createElement('div');
	buttonsBox.style.zIndex = '9001';
	buttonsBox.style.position = 'absolute';
	buttonsBox.style.top = '.5rem';
	buttonsBox.style.right = '.5rem';
	buttonsBox.style.width = '10rem';
	buttonsBox.style.height = '2rem';
	buttonsBox.style.textAlign = 'right';
	property.appendChild(buttonsBox);

	// Adds a button to open a Post-it.
	var notesButton = document.createElement('button');
	notesButton.id = 'notes_' + property.id.replace('classified_', '');
	notesButton.innerHTML = 'Annoter';
	notesButton.style.border = '1px solid #124D77';
	notesButton.style.borderRadius = '5px';
	notesButton.style.background = 'linear-gradient(to bottom, #007dc1 5%, #0061a7 100%)';
	notesButton.style.backgroundColor = '#007DC1';
	notesButton.style.color = '#FFFFFF';
	notesButton.style.cursor = 'pointer';
	notesButton.style.marginRight = '5px';
	buttonsBox.appendChild(notesButton);

	// Adds a button to hide the property.
	var hideButton = document.createElement('button');
	hideButton.id = 'hide_' + property.id.replace('classified_', '');
	hideButton.classList.add('immowebPlusAction');
	hideButton.innerHTML = 'Exclure';

	hideButton.style.background = 'linear-gradient(to bottom, #D0451B 5%, #BC3315 100%)';
	hideButton.style.backgroundColor = '#D0451B';

	buttonsBox.appendChild(hideButton);
}

/* ************************************************************************************ *\
	Allow users to manually change a property's visibility.
\* ************************************************************************************ */



/* ************************************************************************************ *\
	Enable Post-it notes.
\* ************************************************************************************ */






function addPostIt(property)
{
	var postIt = document.createElement('div');
	postIt.style.position = 'absolute';
	postIt.style.zIndex = '9002';
	postIt.style.top = '0rem';
	postIt.style.right = '0rem';
	postIt.style.width = '25rem';
	postIt.style.height = '12rem';
	postIt.style.padding = '1rem';
	postIt.style.backgroundColor = '#FFFC7F';
	postIt.style.boxShadow = '5px 5px 7px rgba(33, 33, 33, 0.7)';
	property.appendChild(postIt);

	var postItEditArea = document.createElement('div');
	postItEditArea.contentEditable = true;
	postItEditArea.style.cursor = 'text';
	postItEditArea.style.zIndex = '9003';
	postItEditArea.style.height = '100%';
	postIt.appendChild(postItEditArea);

	var closeX = document.createElement('div');
	closeX.style.cursor = 'pointer';
	closeX.style.zIndex = '9004';
	closeX.style.position = 'absolute';
	closeX.style.top = '0.3rem';
	closeX.style.right = '0.5rem';
	closeX.style.width = '2rem';
	closeX.style.height = '2rem';
	closeX.style.textAlign = 'right';
	closeX.style.fontWeight = 'bold';
	closeX.innerHTML = 'X';
	postIt.appendChild(closeX);
}

// Waits a second before looping over the loaded properties and adjusting their display.
function triggerPageElementsUpdate()
{
	setTimeout(function()
	{
		resultsList.querySelectorAll('[id^="classified_"]').forEach(property =>
		{
			defineVisibility(property);
			addButtons(property);
			addPostIt(property);
		});
	}, 1500);
}

// MAIN
if (location.href.match(/(\/fr\/recherche\/.*\/a-vendre)|(\/nl\/zoeken\/.*\/te-koop)|(\/en\/search\/.*\/for-sale)/g))
{
	// Gets the displayMode selected in the popup.
	chrome.storage.local.get('displayMode', function(fetched)
	{
		displayMode = fetched.displayMode;

		triggerPageElementsUpdate();

		// Updates a property's display every time it's modified by Immoweb's scripts.
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		let observer = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				if (mutation.target.style.opacity === '1')
					triggerPageElementsUpdate();
			});
		});
		observer.observe(resultsList,
		{
			attributes: true
		});
	});
}