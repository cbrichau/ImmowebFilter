document.addEventListener('DOMContentLoaded', function()
{
	/*
	Initialises the popup's content in the right language.
	*/
	document.querySelectorAll('label > span:nth-child(2)').forEach(optionTitle =>
	{
		let translation = chrome.i18n.getMessage(optionTitle.id);
		if (translation)
			optionTitle.innerHTML = translation;
	});

	/*
	Initialises the checked radio button based on the last option used, or 'highlight' by default.
	*/
	chrome.storage.local.get('displayMode', function(fetched)
	{
		if (['highlight', 'hide', 'original'].includes(fetched.displayMode))
			document.getElementById(fetched.displayMode).checked = true;
		else
		{
			document.getElementById('highlight').checked = true;
			chrome.storage.local.set(
			{
				displayMode: 'highlight'
			});
		}
	});

	/*
	On button click, updates the default option then reloads the page to re-run the page modifications.
	*/
	document.querySelectorAll('input[type="radio"]').forEach(btn =>
	{
		btn.addEventListener('click', event =>
		{
			chrome.storage.local.set(
			{
				displayMode: event.target.id
			}, function()
			{
				chrome.tabs.reload();
			});
		})
	});
});