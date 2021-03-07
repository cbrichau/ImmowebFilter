document.addEventListener('DOMContentLoaded', function ()
{
	// Initialises the checked radio button based on the last option used, or 'highlight' by default.
	chrome.storage.local.get('displayMode', function (fetched)
	{
		if (['highlight', 'hide', 'original'].includes(fetched.displayMode))
			document.getElementById(fetched.displayMode).checked = true;
		else
		{
			document.getElementById('highlight').checked = true;
			chrome.storage.local.set({ displayMode: 'highlight' });
		}
	});

	// On button click, updates the default option + reloads the page to run the appropriate script.
	document.querySelectorAll('input[type="radio"]').forEach(btn => {
		btn.addEventListener('click', event => {
			chrome.storage.local.set({ displayMode: event.target.id }, function ()
			{
				chrome.tabs.reload();
			});
		})
	});
});