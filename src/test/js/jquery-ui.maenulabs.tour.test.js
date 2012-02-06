/**
 * Tests the tour UI.
 *
 * @author
 *     Manuel Leuenberger
 */

describe("jquery-ui.maenulabs.tour", function() {
	
	describe("ui.tour", function() {
		
		var tour;
		var tourMarkup = '<div class=""></div>';
		var $tour;
		
		beforeEach(function() {
			tour = new $.tour.Tour();
			$tour = $(tourMarkup).appendTo($("body")).tour({
				tour: tour
			});
		});
		
		afterEach(function() {
			$tour.remove();
		});
		
		describe("globalization", function() {
			
			beforeEach(function() {
				Globalize.addCultureInfo("en", {
					messages: {
						"ui.tour.backward": "Backward",
						"ui.tour.forward": "Forward",
						"ui.automatictour.close": "Close",
						"ui.automatictour.play": "Play",
						"ui.automatictour.pause": "Pause",
						"ui.automatictour.stop": "Stop"
					}
				});
			});
			
		});
		
	});
	
});