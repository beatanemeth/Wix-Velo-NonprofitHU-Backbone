// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixLocation from 'wix-location';

$w.onReady(function () {
	/******************************************************
	 * Collapse hero section on blog category or tag pages, including after in-page navigation
	 ******************************************************/
	function handleBlogPageSection() {
		const currentUrl = wixLocation.url;
		if (
			currentUrl.includes('/blog/categories/') ||
			currentUrl.includes('/blog/tags/')
		) {
			$w('#heroSection').collapse();
		} else {
			$w('#heroSection').expand(); // Optionally expand on other pages
		}
	}

	// Initial check on page load or reload
	handleBlogPageSection();

	/**
	 * Listens for Wix Location Change Events
	 * The event listener is triggered whenever the URL of the page changes, without a full page reload.
	 * This includes when a user clicks on a different category or tag link within your blog.
	 * This ensures that every time the URL changes, we re-check if it's a category or tag page and collapse the first section accordingly.
	 */
	wixLocation.onChange(() => {
		handleBlogPageSection();
	});
});
