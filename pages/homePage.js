/**
 * This code runs on: https://www.kiutarakbol.hu/
 */

// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import wixData from 'wix-data';

const TESTIMONIALS_COLLECTION_ID = 'yourTestimonialCollectionID'; // Replace with your actual collection ID
const PROGRAMS_COLLECTION_ID = 'yourProgramsCollectionID'; // Replace with your actual collection ID
const PROGRAMS_COLLECTION_REFERENCE_FIELD_KEY =
	'yourProgramsCollectionReferenceFieldKey'; // Replace with your actual reference field key

$w.onReady(function () {
	/******************************************************
	 * Load testimonials from CMS and display on slides
	 ******************************************************/
	/**
	 * Creates slide selector objects for testimonial slides
	 */
	const numberOfSlides = 6;

	//Dynamically generates slide selector objects for testimonial slides
	//based on the total number of slides defined by `numberOfSlides`.
	const slideIndexes = Array.from({ length: numberOfSlides }, (_, i) => i + 1);

	const slides = slideIndexes.map((i) => {
		const slideNumber = i;
		return {
			clientName: `#clientSlide${slideNumber}`,
			testimonialText: `#testimonialSlide${slideNumber}`,
			programName: `#programSlide${slideNumber}`,
		};
	});

	/**
	 * Query the Testimonials collection (CMS) and sort by creation date
	 */
	wixData
		.query(TESTIMONIALS_COLLECTION_ID)
		.ascending('_createdDate')
		.find()
		.then((results) => {
			console.log(`Found ${results.items.length} testimonials.`);
			const testimonials = results.items;

			// Loop over the testimonials and populate each slide
			slides.forEach((slide, index) => {
				if (testimonials[index]) {
					console.log(
						`Populating slide ${index + 1} with testimonial titled: "${
							testimonials[index].title
						}"`
					);
					populateSlideWithTestimonial(testimonials[index], slide);
				} else {
					console.warn(`No testimonial for slide ${index + 1}`);
				}
			});
		})
		.catch((error) => {
			console.error('Error loading testimonials:', error);
		});
});

/**
 * Helper function that populates one testimonial slide with the client name, testimonial text,
 * and the title of the related program.
 */
function populateSlideWithTestimonial(
	item,
	{ clientName, testimonialText, programName }
) {
	console.log('Populating fields for testimonial:', item.title);

	// Set the client's name directly
	$w(clientName).text = item.name;

	// Strip HTML from the rich text testimonial field for display
	$w(testimonialText).text = convertHtmlToPlainText(item.testimonial);

	// Load the related program title using the multi-reference field "testimonials"
	// from the Programs collection (reverse lookup)
	wixData
		.query(PROGRAMS_COLLECTION_ID)
		.hasSome(PROGRAMS_COLLECTION_REFERENCE_FIELD_KEY, [item._id])
		.find()
		.then((programResults) => {
			const programTitles = programResults.items.map(
				(program) => program.title
			);
			console.log(`Related program titles: ${programTitles}`);
			$w(programName).text = (programTitles[0] || 'N/A').toUpperCase();
		})
		.catch((error) => {
			console.error('Error loading program title:', error);
			$w(programName).text = 'N/A';
		});
}

/**
 * Utility function to convert rich text (HTML) to plain text.
 *
 * The "testimonial" field in the Wix CMS is stored as Rich Text,
 * which includes HTML tags such as <p>, <strong>, etc.
 * To cleanly display this content in plain text elements on the page,
 * this function strips out all HTML tags and formats paragraphs as line breaks.
 *
 * @param {string} htmlText - The raw HTML string from the CMS.
 * @returns {string} - Cleaned, readable plain text for UI display.
 */
function convertHtmlToPlainText(htmlText) {
	return htmlText
		.replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
		.replace(/<\/p>/gi, '\n') // Replace closing </p> tags with line breaks
		.replace(/<[^>]*>/g, '') // Remove all other HTML tags
		.replace(/\s+/g, ' ') // Collapse extra whitespace
		.trim(); // Trim leading/trailing spaces
}
