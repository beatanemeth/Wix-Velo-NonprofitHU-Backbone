/**
 * This code runs on: https://www.kiutarakbol.hu/programok/eroforras-nap
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { queryEvents } from 'backend/events.web';

const TESTIMONIAL_DATASET_ID = 'yourTestimonialDatasetID'; // Replace with your actual dataset ID
const TEAM_COLLECTION_ID = 'yourTeamCollectionID'; // Replace with your actual collection ID
const TEAM_COLLECTION_FIELD_KEY = 'yourTeamCollectionFieldKey'; // Replace with your actual field key
const PROGRAMS_COLLECTION_ID = 'yourProgramsCollectionID'; // Replace with your actual collection ID
const PROGRAMS_COLLECTION_REFERENCE_FIELD_KEY =
	'yourProgramsCollectionReferenceFieldKey'; // Replace with your actual reference field key
const MANUAL_SORT_FIELD = 'yourManualSortFieldKey'; // Replace with your actual manual sort field key

const prefix = '/programok';
// Map page URLs to specific event category identifiers
const categoriesPerPage = {
	[`${prefix}/osszehangolva-a-simonton-modszerrel`]: ['simontonösszehangolva'],
	[`${prefix}/eroforras-nap`]: ['erőforrásnap'],
	[`${prefix}/simonton-klub`]: ['simontonklub'],
	[`${prefix}/van-kiut-a-szorongasbol`]: ['vankiútaszorongásból'],
	[`${prefix}/jol-neveld-a-sarkanyodat`]: ['jólneveldasárkányod'],
	[`${prefix}/meditacio-mint-gyogyito-ero`]: ['meditációgyógyítóerő'],
	[`${prefix}/eroforras-tabor`]: ['erőforrástábor'],
	[`${prefix}/irodalomterapia-simonton-alapokon`]: ['irodalomterápia'],
	[`${prefix}/meseterapia-utkeresoknek`]: ['meseterápia'],
};

/**
 * Main logic that runs when the page is ready.
 */
$w.onReady(async () => {
	/******************************************************
	 * If there is an event in the given category, display it, otherwise, render the fallback text.
	 ******************************************************/

	// Hide both strips initially to avoid layout flash
	$w('#categoryEventStrip').collapse();
	$w('#categoryEventFallbackStrip').collapse();

	// Construct current path
	const path = prefix + '/' + wixLocation.path.join('/');
	const pageSpecificCategory = categoriesPerPage[path] || [];

	console.log('Page path:', path);
	console.log('Matching category:', pageSpecificCategory);

	// If no match, show fallback UI
	if (!pageSpecificCategory) {
		$w('#categoryEventFallbackStrip').expand();
		return;
	}

	try {
		// Query backend for event data
		const options = {
			fields: ['DETAILS', 'CATEGORIES', 'URLS'],
		};
		const eventData = await queryEvents(options);

		console.log('Returned events:', eventData);

		// Filter events by category
		const filteredEvents =
			eventData?._items?.filter((event) =>
				event.categories?.categories?.some((cat) =>
					pageSpecificCategory.includes(cat.name)
				)
			) || [];

		console.log('Filtered events:', filteredEvents);

		// If matching events are found, render them
		if (filteredEvents.length > 0) {
			$w('#categoryEventRepeater').data = filteredEvents;
			$w('#categoryEventRepeater').onItemReady(($item, itemData) => {
				$item('#categoryEventTitle').text = itemData.title || '';
				$item('#categoryEventDate').text =
					itemData.dateAndTimeSettings?.formatted?.dateAndTime || '';
				$item('#categoryEventLocation').text = itemData.location?.name || '';
				$item('#categoryEventButton').link = `/event-details/${itemData.slug}`;
				/**
				 * Wix stores image data using a special internal format like:
				 * mainImage: "wix:image://v1/..."
				 * However, this format is not directly usable as an image src in the browser.
				 * To display the image correctly, we need to convert it into a public URL format:
				 * https://static.wixstatic.com/media/...
				 * This replacement below makes the image accessible and renders properly in the UI.
				 */
				$item('#categoryEventImage').src = itemData.mainImage.replace(
					/^wix:image:\/\/v1\//,
					'https://static.wixstatic.com/media/'
				);
			});

			$w('#categoryEventStrip').expand();
		} else {
			$w('#categoryEventFallbackStrip').expand();
		}
	} catch (error) {
		console.error('Error loading events:', error);
		$w('#categoryEventFallbackStrip').expand();
	}

	/******************************************************
	 * If testimonials exist, show them; otherwise, show a fallback quote.
	 ******************************************************/
	$w(`#${TESTIMONIAL_DATASET_ID}`).onReady(() => {
		$w(`#${TESTIMONIAL_DATASET_ID}`)
			.getItems(0, 100)
			.then((result) => {
				const count = result.items.length;
				console.log('Testimonials found:', count);

				if (count === 0) {
					console.log('No testimonials → showing quote');
					$w('#testimonialColumnStrip').collapse();
					$w('#quoteColumnStrip').expand();
				} else {
					console.log('Testimonials exist → showing testimonials');
					$w('#testimonialColumnStrip').expand();
					$w('#quoteColumnStrip').collapse();
				}
			})
			.catch((error) => {
				console.error('Error fetching testimonials:', error);
				$w('#testimonialColumnStrip').collapse();
				$w('#quoteColumnStrip').expand();
			});
	});

	/******************************************************
	 * Show lightbox with team member details when clicked
	 ******************************************************/
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

	/***************************************************************
	 * Display other related programs (excluding the current one)
	 ***************************************************************/
	// Get the current dynamic item's ID
	$w('#dynamicDataset').onReady(() => {
		const currentItem = $w('#dynamicDataset').getCurrentItem();
		const currentItemId = currentItem._id;

		console.log('Current item ID:', currentItemId);

		/**
		 * https://dev.wix.com/docs/velo/apis/wix-data/query
		 */
		wixData
			.query(PROGRAMS_COLLECTION_ID)
			// Include data from the referenced field (e.g., connected items from another collection).
			// Without `.include()`, the reference field will return only IDs, not full objects.
			.include(PROGRAMS_COLLECTION_REFERENCE_FIELD_KEY)
			.find()
			.then((results) => {
				// Filter out the current item
				const filteredItems = results.items.filter(
					(item) => item._id !== currentItemId
				);

				// Sort the items
				const sortedItems = filteredItems.sort((a, b) => {
					const aSort = a[MANUAL_SORT_FIELD] || '';
					const bSort = b[MANUAL_SORT_FIELD] || '';

					// ASCENDING order: a → z
					return aSort.localeCompare(bSort);

					// DESCENDING order: z → a
					// return bSort.localeCompare(aSort);
				});

				// Assign sorted items to the repeater
				$w('#eventsRepeater').data = sortedItems;

				// Fill the repeater
				$w('#eventsRepeater').onItemReady(($item, itemData) => {
					$item('#eventTitleText').text = itemData.title;
					$item('#eventImage').src = itemData.image;
					$item('#eventImage').alt = itemData.title;
					$item('#eventImage').tooltip = null;
					$item('#eventExistenceText').text =
						itemData.existence?.existence || 'No status';

					const url = `${prefix}/${itemData.titleSlug}`;
					// Make container clickable
					$item('#eventContainer').onClick(() => {
						wixLocation.to(url);
					});
				});
			})
			.catch((error) => {
				console.error('Error loading related programs:', error);
			});
	});
});
