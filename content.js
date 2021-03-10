var resultsList = document.querySelector('ul#main-content');
var displayMode;
var offMarketKeywords = [
	'sous option', 'onder optie', 'in optie', 'under option',
	'sous offre', 'onder aanbod', 'under offer',
	'offre acceptee', 'offre acceptée', 'offer accepted',
	'sous compromis',
	'fin des visites', 'einde van de bezoeken', 'end of visits',
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
	let tags = tagArray.map(function (tag) { return tag.innerText.toLowerCase().trim(); });
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

// Waits a second before looping over the loaded properties and adjusting their display.
function triggerVisibilityUpdate()
{
	setTimeout(function()
	{
		resultsList.querySelectorAll('[id^="classified_"]').forEach(property => {
			defineVisibility(property);
		});
	}, 1500);
}

// MAIN
if (location.href.match(/(\/fr\/recherche\/.*\/a-vendre)|(\/nl\/zoeken\/.*\/te-koop)|(\/en\/search\/.*\/for-sale)/g))
{
	// Gets the displayMode selected in the popup.
	chrome.storage.local.get('displayMode', function (fetched)
	{
		displayMode = fetched.displayMode;

		triggerVisibilityUpdate();

		// Updates a property's display every time it's modified by Immoweb's scripts.
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		let observer = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				if (mutation.target.style.opacity === '1')
					triggerVisibilityUpdate();
			});
		});	
		observer.observe(resultsList, { attributes: true });	
	});
}