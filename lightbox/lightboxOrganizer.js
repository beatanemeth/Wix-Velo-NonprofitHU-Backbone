// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixWindow from 'wix-window';

$w.onReady(function () {
	const context = wixWindow.lightbox.getContext();

	console.log('Context', context);

	// Basic safety check
	if (!context || typeof context !== 'object') {
		console.error('Invalid or missing lightbox context data.');
		return;
	}

	$w('#name').text = context.name || '';
	$w('#profileImage').src = context.profileImage || '';
	$w('#profileImage').alt = context.name || '';
	$w('#profileImage').tooltip = ''; // Clear default tooltip
	$w('#expertise').text = context.expertise || '';
	$w('#introduction').text = context.introduction || '';

	if (context.recommendation) {
		$w('#recommendation').text = context.recommendation;
		$w('#recommendationBox').show();
	} else {
		$w('#recommendationBox').collapse();
	}

	// Handle group data (assumed to be an array of { group: 'Group Name' })
	if (Array.isArray(context.groups) && context.groups.length > 0) {
		// IMPORTANT: Use the exact column key of your table column here!
		const tableData = context.groups.map((g) => ({ groups: g.group }));

		$w('#groups').rows = tableData;
		$w('#groups').show();
	} else {
		$w('#groups').collapse();
	}
});
