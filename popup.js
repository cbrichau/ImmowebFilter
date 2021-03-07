document.addEventListener('DOMContentLoaded', function ()
{
	let radioButtons = document.querySelectorAll('input[type="radio"]');

	radioButtons.forEach(btn => {
		chrome.storage.local.get('filterMode', function (fetched)
		{
			btn.checked = (btn.id == fetched.filterMode)
		});

		btn.addEventListener('click', event => {
			chrome.storage.local.set({ filterMode: event.target.id }, function ()
			{
				chrome.tabs.reload();
			});
		})
	});
});