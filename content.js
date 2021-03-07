var offMarketKeywords = [
	'sous option', 'onder optie', 'in optie', 'under option',
	'sous offre', 'onder aanbod', 'under offer',
	'offre acceptee',
	'offre acceptée',
	'sous compromis',
	'fin des visites', 'einde van de bezoeken', 'stop bezoek',
	'visites indisponibles', 'geen bezoek',
	'vendu', 'verkocht',
];

function defineVisibility(property)
{
	let isOffMarket = (hasOffMarketDescription(property) || hasOffMarketTag(property));
	chrome.storage.local.get('filterMode', function (fetched)
	{
		if (fetched.filterMode == 'highlight')
			property.style.backgroundColor = (isOffMarket ? '#FDD5C1' : '#CBF8CB');
		else if (fetched.filterMode == 'hide')
		{
			if (isOffMarket)
				property.style.display = 'none';
			else
				property.style = '';
		}
	});
}

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

function hasOffMarketTag(property)
{
	let tagNodes = property.querySelectorAll('.flag-list__text');
	let tagArray = [].slice.call(tagNodes);
	let tags = tagArray.map(function (tag) { return tag.innerText.toLowerCase().trim(); });
	if (tags.includes('sous option') || tags.includes('onder optie'))
		return true;
	return false;
}

if (location.href.match(/(\/fr\/recherche\/.*\/a-vendre)|(\/nl\/zoeken\/.*\/te-koop\/)/g))
{
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	let observer = new MutationObserver(function(mutations)
	{
		mutations.forEach(function(mutation)
		{
			if (mutation.type === 'attributes' && mutation.attributeName == 'id')
			{
				if (mutation.target.id.startsWith('classified_'))
					defineVisibility(mutation.target);
				// else if (mutation.target.id.startsWith('lazy-loading-observer-wrapper'))
				// 	defineVisibility(mutation.target.parentNode);
			}
			else if (mutation.type === 'childList' && mutation.target.className == 'search-results__item')
			{
				if ((property = mutation.target.querySelector('article[id^="classified_"]')) != null)
					defineVisibility(property);
			}
		});
	});
	
	let resultsList = document.querySelector('ul#main-content');
	
	defineVisibility(resultsList.firstChild.firstChild);
	
	observer.observe(resultsList, { attributes: true, attributeFilter: [ 'id' ], childList: true, subtree: true });
}