/**
 * This code runs on: https://www.kiutarakbol.hu/programok/
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixWindow from 'wix-window';
import wixData from 'wix-data';

const TEAM_COLLECTION_ID = 'yourTeamCollectionID'; // Replace with your actual collection ID
const TEAM_COLLECTION_FIELD_KEY = 'yourTeamCollectionFieldKey'; // Replace with your actual field key

/******************************************************
 * Show lightbox with team member details when clicked
 ******************************************************/
$w.onReady(async function () {
	$w('#teamRepeater').onItemReady(($item, itemData) => {
		$item('#aboutMeContainer').onClick(async () => {
			const lightboxData = {
				name: itemData.title,
				profileImage: itemData.profileImage,
				expertise: itemData.expertise,
				introduction: itemData.introduction,
				recommendation: itemData.recommendation,
			};

			/**
			 * Use `queryReferenced` to retrieve related items from a reference field.
			 * In this example, each team member might be linked to one or more 'groups' via the CMS.
			 * We query that connection to display those groups in the lightbox.
			 */
			try {
				/**
				 * https://dev.wix.com/docs/velo/apis/wix-data/query-referenced
				 */
				const groupsResult = await wixData.queryReferenced(
					TEAM_COLLECTION_ID,
					itemData._id,
					TEAM_COLLECTION_FIELD_KEY
				);

				if (groupsResult.items.length > 0) {
					lightboxData.groups = groupsResult.items.map((group) => ({
						group: group.title,
					}));
				}
			} catch (error) {
				console.error('Error fetching referenced groups:', error);
			}

			wixWindow.openLightbox('OrganizerLightbox', lightboxData);
		});
	});
});
