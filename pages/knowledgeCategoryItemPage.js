/**
 * This code runs on: https://www.kiutarakbol.hu/tudastar/megkuzdes-es-kapcsolatok
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixLocation from 'wix-location';
import wixData from 'wix-data';

const YOUR_COLLECTION_ID = 'yourCollectionID'; // Replace with your actual collection ID

/******************************************************
 * Purpose: Filter out specific CMS categories from display, depending on the current page.
 ******************************************************/

// Define categories hidden *only* on specific pages
const hiddenCategoriesPerPage = {
	'/orvosi-hatter-es-kezelesek': ['Orvosi háttér és kezelések'],
	'/megkuzdes-es-kapcsolatok': ['Megküzdés és kapcsolatok'],
	'/psziche-es-lelek': ['Psziché és lélek'],
	'/taplalkozas': ['Táplálkozás'],
};

// Define categories always hidden, regardless of page
const alwaysHiddenCategories = [
	'Letölthető segédanyagok',
	'Ajánlott gyakorlatok',
	'Képzelet és belső munka',
	'Test és mozgás',
];

$w.onReady(async function () {
	// Construct current path
	const path = '/' + wixLocation.path.join('/');
	const pageSpecificHidden = hiddenCategoriesPerPage[path] || [];
	const allHidden = [...pageSpecificHidden, ...alwaysHiddenCategories];

	console.log('Page path:', path);
	console.log('Categories to hide:', allHidden);

	try {
		/**
		 * https://dev.wix.com/docs/velo/apis/wix-data/query
		 */
		let query = wixData.query(YOUR_COLLECTION_ID);

		// Dynamically exclude all hidden titles
		allHidden.forEach((title) => {
			query = query.ne('title', title);
		});

		const results = await query.find();
		const filteredItems = results.items;

		console.log('Filtered categories count:', filteredItems.length);
		console.log('Example item:', filteredItems[0]);

		// Set data and bind each repeater item
		$w('#categoryRepeater').data = filteredItems;

		$w('#categoryRepeater').onItemReady(($item, itemData) => {
			$item('#categoryButton').label = itemData.title;
			$item('#categoryButton').link = itemData.categoryUrl;
		});
	} catch (error) {
		console.error('Error loading filtered categories:', error);
	}
});
