// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindow from 'wix-window';

$w.onReady(function () {
	const context = wixWindow.lightbox.getContext();

	console.log('context', context);

	$w('#name').text = context.name;
	$w('#expertise').text = context.expertise;
	$w('#fonudationDuty').text = context.foundationDuty;
	$w('#introduction').text = context.introduction;
	$w('#profileImage').src = context.profileImage;
	$w('#profileImage').alt = context.name;
	$w('#profileImage').tooltip = null;
	$w('#email').text = context.email;
	$w('#contactMe').text = context.contactMe;

	if (context.urlLinkedIn) {
		$w('#urlLinkedIn').link = context.urlLinkedIn;
		$w('#urlLinkedIn').expand(); // make sure the button is visible
	} else {
		$w('#urlLinkedIn').collapse(); // hide it if no URL
	}

	if (context.urlWebsite) {
		$w('#externalUrlButton').link = context.urlWebsite;
		$w('#externalUrlButton').expand(); // make sure the button is visible
	} else {
		$w('#externalUrlButton').collapse(); // hide it if no URL
	}
});
