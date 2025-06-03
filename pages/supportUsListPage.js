/**
 * This code runs on: https://www.kiutarakbol.hu/segits-te-is
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
	/*************************************************************
	 * Shows a button if `url` exists, and an email icon if `email` exists.
	 *************************************************************/
	$w('#repeater').onItemReady(($item, itemData) => {
		if (itemData.url) {
			$item('#button').link = itemData.url;
			$item('#button').show();
		} else {
			$item('#button').collapse();
		}

		if (itemData.email) {
			$item('#vectorImage').link = itemData.email;
			$item('#vectorImage').show();
		} else {
			$item('#vectorImage').collapse();
		}
	});
});
