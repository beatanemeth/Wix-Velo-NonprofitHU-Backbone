/**
 * This code runs on: https://www.kiutarakbol.hu/rolunk/
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixWindow from 'wix-window';

/**
 * Use wixWindow.openLightbox() and pass an object with the team member’s data.
 */
$w.onReady(async function () {
	// For each item in the repeater
	$w('#aboutUsRepeater').onItemReady(($item, itemData, index) => {
		console.log('itemData', itemData);
		console.log(index);

		if (itemData.urlLinkedIn) {
			$item('#linkedInButton').link = itemData.urlLinkedIn;
			$item('#linkedInButton').expand(); // make sure the button is visible
		} else {
			$item('#linkedInButton').collapse(); // hide it if no URL
		}

		if (itemData.urlWebsite) {
			$item('#externalUrlButton').link = itemData.urlWebsite;
			$item('#externalUrlButton').expand(); // make sure the button is visible
		} else {
			$item('#externalUrlButton').collapse(); // hide it if no URL
		}

		$item('#aboutMeButton').onClick(() => {
			const lightboxData = {
				name: itemData.title,
				expertise: itemData.expertise,
				foundationDuty: itemData.foundationDuty,
				introduction: itemData.introduction,
				profileImage: itemData.profileImage,
				email: itemData.email,
				contactMe: itemData.contactMe,
			};

			// Only pass the LinkedIn URL to the Light Box, if it exists.
			if (itemData.urlLinkedIn) {
				lightboxData.urlLinkedIn = itemData.urlLinkedIn;
			}

			// Only pass the website URL to the Light Box, if it exists.
			if (itemData.urlWebsite) {
				lightboxData.urlWebsite = itemData.urlWebsite;
			}

			wixWindow.openLightbox('TeamMemberLightbox', lightboxData);
		});
	});
});
