/**
 * This code runs on: https://www.kiutarakbol.hu/tudastar/megkuzdes-es-kapcsolatok
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixLocation from 'wix-location';
import wixData from 'wix-data';

const KNOWLEDGE_COLLECTION_ID = 'yourCollectionDatasetID'; // Replace with your actual dataset ID
const KNOWLEDGE_COLLECTION_FIELD_KEY = 'yourCollectionFieldKey'; // Replace with your actual field key
const PAGE_URL = 'yourUrlPath'; // Replace with your actual page URL path

$w.onReady(async function () {
	// Current page path, e.g. '/megkuzdes-es-kapcsolatok'
	const currentPath = wixLocation.path[0];

	try {
		const results = await wixData
			.query(KNOWLEDGE_COLLECTION_ID)
			.include(KNOWLEDGE_COLLECTION_FIELD_KEY)
			.find();

		if (results.items.length > 0) {
			// Extract category objects from items
			const allCategories = results.items.map((item) => item.category);

			// Remove duplicates by _id
			const uniqueCategories = Array.from(
				new Map(allCategories.map((cat) => [cat._id, cat])).values()
			);

			// Build hiddenCategoriesPerPage object
			const hiddenCategoriesPerPage = {};
			uniqueCategories.forEach((cat) => {
				hiddenCategoriesPerPage[cat.title] = slugify(cat.title);
			});

			// Filter out current page path
			const categoriesToShow = Object.entries(hiddenCategoriesPerPage)
				.filter(([title, slug]) => slug !== currentPath)
				.map(([title, slug]) => ({
					_id: slug,
					title,
					url: PAGE_URL + slug,
				}));

			/** DEBUG start **/
			console.log('CURRENT PATH: ', currentPath);
			console.log('RESULTS: ', results);
			console.log('ALL CATEGORIES: ', allCategories);
			console.log('HIDDEN CATEGORIES PER PAGE: ', hiddenCategoriesPerPage);
			console.log('UNIQUES CATEGORIES: ', uniqueCategories);
			console.log('CATEGORIES TO SHOW: ', categoriesToShow);
			/** DEBUG end **/

			if (categoriesToShow.length > 0) {
				$w('#categoryRepeater').data = categoriesToShow;

				$w('#categoryRepeater').onItemReady(($item, itemData) => {
					$item('#categoryButton').label = itemData.title;
					$item('#categoryButton').link = itemData.url;
				});
			} else {
				$w('#categoryRepeater').collapse();
			}
		} else {
			$w('#categoryRepeater').collapse();
		}
	} catch (err) {
		console.error(err);
		$w('#categoryRepeater').collapse();
	}

	function slugify(text) {
		return text
			.normalize('NFD') // separate accents
			.replace(/[\u0300-\u036f]/g, '') // remove accents
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with hyphens
			.replace(/^-+|-+$/g, ''); // trim starting/ending hyphens
	}
});
