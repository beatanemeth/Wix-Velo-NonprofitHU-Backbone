/**
 * masterPage.js
 * The code in this file will load on every page of your site
 */

import wixWindowFrontend from 'wix-window-frontend';

// The amount of pixels after which the backToTopButton should appear.
const offset = 100;

$w.onReady(function () {
	/**
	 * Automatically Update Copyright Year in Wix
	 * https://forum.wixstudio.com/t/automatically-update-copyright-year-in-wix/6940
	 */

	const currentYear = new Date().getFullYear();
	const YOUR_BUSINESS_NAME = 'yourBusinessName'; // Replace with your actual business name

	//Text element
	$w(
		'#copyrightText'
	).text = `copyright © 2019 - ${currentYear} ${YOUR_BUSINESS_NAME}`;

	/**
	 * Make the backToTopButton disappear after scrolled to top.
	 */
	getScrollInfo();
});

/**
 * The function is designed to monitor the user's vertical scroll position on the webpage and control the visibility of a backToTopButton accordingly.
 */
function getScrollInfo(params) {
	/**
	 * Retrieves Scroll Information
	 * It asynchronously gets information about the browser window's dimensions and its current scroll position.
	 */
	wixWindowFrontend.getBoundingRect().then((windowSizeInfo) => {
		let scrollY = windowSizeInfo.scroll.y;

		/**
		 * Controls Button Visibility
		 * Wether the user has scrolled down past a certain point (100 pixels in this case);
		 * or the user is near the top of the page.
		 */
		if (scrollY > offset) {
			$w('#backToTopButton').show();
		} else {
			$w('#backToTopButton').hide();
		}

		/**
		 * Recursive Call with Timeout
		 * The function calls itself again after a delay of 1000 milliseconds (1 second).
		 * This creates a recurring check of the scroll position, ensuring that the visibility of the "back to top" button is dynamically updated as the user scrolls up or down the page.
		 */
		setTimeout(() => {
			getScrollInfo();
		}, 1000);
	});
}
