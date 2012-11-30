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
		var $element;
		
		beforeEach(function() {
			$element = $('<div>').appendTo($("body"));
			$element.css("width", "30px");
			$element.css("height", "40px");
			$element.css("background-color", "#FF0000");
			var manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
			manipulationBuilder.expose($element);
			var step1 = new $.tour.Step(manipulationBuilder.manipulations);
			manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
			manipulationBuilder.highlight($element);
			var step2 = new $.tour.Step(manipulationBuilder.manipulations);
			tour = new $.tour.Tour([step1, step2]);
			$tour = $(tourMarkup).appendTo($("body")).tour({
				tour: tour
			});
		});
		
		afterEach(function() {
			tour.revertCurrentStep();
			$tour.remove();
			$element.remove();
		});
		
		describe("buttons", function() {
			
			it("should enable and disable", function() {
				expect($tour.find("button").eq(0).is(":disabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":enabled")).toBeTruthy();
				tour.forward();
				expect($tour.find("button").eq(0).is(":disabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":enabled")).toBeTruthy();
				tour.forward();
				expect($tour.find("button").eq(0).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":disabled")).toBeTruthy();
				tour.backward();
				expect($tour.find("button").eq(0).is(":disabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":enabled")).toBeTruthy();
			});
			
			it("should control the tour model", function() {
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(1), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return !simulation.isRunning();
				}, "going forward", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(1), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return !simulation.isRunning();
				}, "going forward", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeTruthy();
					simulation = new $.simula.Simulation($tour.find("button").eq(0), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return !simulation.isRunning();
				}, "going backward", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				});
			});
			
		});
		
		describe("options", function() {
			
			it("should have initial options", function() {
				expect($tour.tour("option", "tour")).toBe(tour);
			});
			
			it("should set options", function() {
				var tour = new $.tour.Tour([]);
				$tour.tour("option", "tour", tour);
				expect($tour.tour("option", "tour")).toBe(tour);
			});
			
		});
		
		describe("destroy", function() {
			
			it("should be the same markup after destroy", function() {
				$tour.tour("destroy");
				var tourHtml = $('<div>').append($tour).html();
				expect(tourHtml).toEqual(tourMarkup);
			});
			
		});
		
	});
	
	describe("ui.automatictour", function() {
		
		var tour;
		var tourMarkup = '<div class=""></div>';
		var $tour;
		var $element;
		
		beforeEach(function() {
			$element = $('<div>').appendTo($("body"));
			$element.css("width", "30px");
			$element.css("height", "40px");
			$element.css("background-color", "#FF0000");
			var manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
			manipulationBuilder.expose($element);
			var step1 = new $.tour.Step(manipulationBuilder.manipulations);
			manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
			manipulationBuilder.highlight($element);
			var step2 = new $.tour.Step(manipulationBuilder.manipulations);
			tour = new $.tour.AutomaticTour([step1, step2], 50);
			$tour = $(tourMarkup).appendTo($("body")).automatictour({
				tour: tour
			});
		});
		
		afterEach(function() {
			$tour.remove();
			$element.remove();
		});
		
		describe("buttons", function() {
			
			it("should enable and disable", function() {
				expect($tour.find("button").eq(2).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(0).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":disabled")).toBeTruthy();
				tour.play();
				expect($tour.find("button").eq(2).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(0).is(":disabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":enabled")).toBeTruthy();
				tour.pause();
				expect($tour.find("button").eq(2).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(0).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":disabled")).toBeTruthy();
				tour.stop();
				expect($tour.find("button").eq(2).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(0).is(":enabled")).toBeTruthy();
				expect($tour.find("button").eq(1).is(":disabled")).toBeTruthy();
			});
			
			it("should control the tour model", function() {
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(0), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return $element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES);
				}, "step 1 to deploy", 50);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				});
				waitsFor(function() {
					return $element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES);
				}, "step 2 to deploy", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				});
				waitsFor(function() {
					return !$element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES);
				}, "tour to stop", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(0), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return $element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES);
				}, "step 1 to deploy", 50);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(1), [0, 0]);
					simulation.click().execute();
				});
				waits(500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					simulation = new $.simula.Simulation($tour.find("button").eq(2), [0, 0]);
					simulation.click().execute();
				});
				waitsFor(function() {
					return !simulation.isRunning();
				}, "tour to stop", 500);
				runs(function() {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				});
			});
			
		});
		
		describe("options", function() {
			
			it("should have initial options", function() {
				expect($tour.automatictour("option", "tour")).toBe(tour);
			});
			
			it("should set options", function() {
				var tour = new $.tour.AutomaticTour([], 1);
				$tour.automatictour("option", "tour", tour);
				expect($tour.automatictour("option", "tour")).toBe(tour);
			});
			
		});
		
		describe("destroy", function() {
			
			it("should be the same markup after destroy", function() {
				$tour.automatictour("destroy");
				var tourHtml = $('<div>').append($tour).html();
				expect(tourHtml).toEqual(tourMarkup);
			});
			
		});
		
	});
	
});