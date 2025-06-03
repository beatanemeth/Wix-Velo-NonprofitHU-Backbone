/**
 * events.web.js
 * Backend '.web.js' files contain functions that run on the server side and can be called from page code.
 * More info: https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/calling-backend-code-from-the-frontend
 */

import { webMethod, Permissions } from 'wix-web-module';
import { wixEventsV2 } from 'wix-events.v2';

/**
 * Queries upcoming events using wix-events.v2.
 * Docs: https://dev.wix.com/docs/velo/apis/wix-events-v2/wix-events-v2/query-events
 *
 * Used in: programsItemPage.js — to check if an event exists for the current item.
 * If found, the event strip is shown; otherwise, the fallback is displayed.
 */
export const queryEvents = webMethod(Permissions.Anyone, async (options) => {
	try {
		const result = await wixEventsV2
			.queryEvents(options)
			.eq('status', 'UPCOMING')
			.find();

		// Return full list of upcoming event objects (unfiltered)
		return result;
	} catch (error) {
		console.error('Backend queryEvents error:', error);
		throw error;
	}
});
