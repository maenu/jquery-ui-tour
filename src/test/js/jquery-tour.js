/*global
	$: true,
	describe: true,
	it: true,
	expect: true,
	beforeEach: true,
	afterEach: true,
	spyOn: true,
	waits: true,
	waitsFor: true,
	runs: true
*/
/**
 * Tests the tour model.
 *
 * @author
 *     Manuel Leuenberger
 */

describe('jquery.maenulabs.tour', function () {
	/*jshint maxlen: 200, maxstatements: 100*/
	
	it('should set the namespaces', function () {
		expect($.tour).toBeDefined();
		expect($.tour.manipulation).toBeDefined();
	});
	
	describe('$.tour', function () {
		
		describe('$.tour.Step', function () {
			
			var step;
			var $element;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				var manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
				manipulationBuilder.expose($element).highlight($element);
				step = new $.tour.Step(manipulationBuilder.manipulations);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should deploy and revert all manipulations', function () {
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				step.deploy();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeTruthy();
				step.revert();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
			});
			
		});
		
		describe('$.tour.Tour', function () {
			
			var tour;
			var $element;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				var manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
				manipulationBuilder.expose($element);
				var step1 = new $.tour.Step(manipulationBuilder.manipulations);
				manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
				manipulationBuilder.highlight($element);
				var step2 = new $.tour.Step(manipulationBuilder.manipulations);
				tour = new $.tour.Tour([step1, step2]);
			});
			
			afterEach(function () {
				$element.remove();
				tour.revertCurrentStep();
			});
			
			it('should revert the current step', function () {
				tour.forward();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				tour.revertCurrentStep();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
			});
			
			it('should be possible to forward and backward', function () {
				expect(tour.steps.length).toEqual(2);
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				expect(tour.canForward()).toBeTruthy();
				expect(tour.canBackward()).toBeFalsy();
				tour.forward();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				expect(tour.canForward()).toBeTruthy();
				expect(tour.canBackward()).toBeFalsy();
				tour.forward();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeTruthy();
				expect(tour.canForward()).toBeFalsy();
				expect(tour.canBackward()).toBeTruthy();
				tour.backward();
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				expect(tour.canForward()).toBeTruthy();
				expect(tour.canBackward()).toBeFalsy();
			});
			
			it('should update observers', function () {
				var observer = {
					updateObservable: function () {
						
					}
				};
				spyOn(observer, 'updateObservable');
				tour.addObserver(observer);
				tour.forward();
				expect(observer.updateObservable).toHaveBeenCalledWith(tour, 'forward');
				observer.updateObservable.reset();
				tour.forward();
				expect(observer.updateObservable).toHaveBeenCalledWith(tour, 'forward');
				observer.updateObservable.reset();
				tour.backward();
				expect(observer.updateObservable).toHaveBeenCalledWith(tour, 'backward');
				observer.updateObservable.reset();
				tour.removeObserver(observer);
				tour.forward();
				expect(observer.updateObservable).not.toHaveBeenCalled();
			});
			
		});
		
		describe('$.tour.AutomaticTour', function () {
			
			var tour;
			var $element;
			var observer;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				var manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
				manipulationBuilder.expose($element);
				var step1 = new $.tour.Step(manipulationBuilder.manipulations);
				manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
				manipulationBuilder.highlight($element);
				var step2 = new $.tour.Step(manipulationBuilder.manipulations);
				tour = new $.tour.AutomaticTour([step1, step2], 50);
			});
			
			afterEach(function () {
				$element.remove();
				tour.stop();
			});
			
			it('should not be playing on start up', function () {
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
				expect(tour.isPlaying()).toBeFalsy();
			});
			
			it('should update observers', function () {
				runs(function () {
					observer = {
						updateObservable: function () {
							
						}
					};
					spyOn(observer, 'updateObservable');
					tour.addObserver(observer);
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					tour.play();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES);
				}, 'step 1 to take place', 40);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					expect(observer.updateObservable.callCount).toEqual(2);
					expect(observer.updateObservable.argsForCall[0][0]).toEqual(tour);
					expect(observer.updateObservable.argsForCall[0][1]).toEqual('forward');
					expect(observer.updateObservable.argsForCall[1][0]).toEqual(tour);
					expect(observer.updateObservable.argsForCall[1][1]).toEqual('play');
					observer.updateObservable.reset();
					tour.pause();
				});
				waits(100);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					expect(observer.updateObservable.callCount).toEqual(1);
					expect(observer.updateObservable).toHaveBeenCalledWith(tour, 'pause');
					observer.updateObservable.reset();
					tour.play();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES);
				}, 'step 2 to take place', 40);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect(observer.updateObservable.callCount).toEqual(2);
					expect(observer.updateObservable.argsForCall[0][0]).toEqual(tour);
					expect(observer.updateObservable.argsForCall[0][1]).toEqual('forward');
					expect(observer.updateObservable.argsForCall[1][0]).toEqual(tour);
					expect(observer.updateObservable.argsForCall[1][1]).toEqual('play');
					observer.updateObservable.reset();
				});
				waits(100);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					expect(observer.updateObservable.callCount).toEqual(1);
					expect(observer.updateObservable).toHaveBeenCalledWith(tour, 'stop');
				});
			});
			
			it('should be able to play, pause and stop', function () {
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					tour.play();
					expect(tour.isPlaying()).toBeTruthy();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES);
				}, 'step 1 to take place', 40);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					tour.pause();
					expect(tour.isPlaying()).toBeFalsy();
				});
				waits(100);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					tour.play();
					expect(tour.isPlaying()).toBeTruthy();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES);
				}, 'step 2 to take place', 40);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
				});
				waits(100);
				runs(function () {
					expect(tour.isPlaying()).toBeFalsy();
					tour.play();
					expect(tour.isPlaying()).toBeTruthy();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES);
				}, 'step 1 to take place', 40);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					expect(tour.isPlaying()).toBeTruthy();
				});
				waitsFor(function () {
					return $element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES);
				}, 'step 2 to take place', 75);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect(tour.isPlaying()).toBeTruthy();
				});
				waits(55);
				runs(function () {
					expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
					expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
					expect(tour.isPlaying()).toBeFalsy();
				});
			});
			
		});
		
	});
	
	describe('$.tour.manipulation', function () {
		
		describe('$.tour.manipulation.Manipulation', function () {
			
			var manipulation;
			
			beforeEach(function () {
				manipulation = new $.tour.manipulation.Manipulation();
			});
			
			it('should have deploy and revert functions defined', function () {
				expect(manipulation.deploy).toBeDefined();
				expect(manipulation.revert).toBeDefined();
			});
			
		});
		
		describe('$.tour.manipulation.JQueryManipulation', function () {
			
			var manipulation;
			var $element;
			
			beforeEach(function () {
				$element = $('body');
				manipulation = new $.tour.manipulation.JQueryManipulation($element);
			});
			
			it('should have an $element property', function () {
				expect(manipulation.$element).toBeDefined();
			});
			
		});
		
		describe('$.tour.manipulation.ScrollToManipulation', function () {
			
			var manipulation;
			var $element;
			
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('position', 'absolute');
				$element.css('top', '3000px');
				$element.css('left', '4000px');
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				manipulation = new $.tour.manipulation.ScrollToManipulation($element);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should scroll into viewport after display', function () {
				runs(function () {
					expect($element.offset().top).toBeGreaterThan($(document).scrollTop() + $(window).height());
					expect($element.offset().left).toBeGreaterThan($(document).scrollLeft() + $(window).width());
					manipulation.deploy();
				});
				waits(1000);
				runs(function () {
					expect($element.offset().top).toBeGreaterThan($(document).scrollTop() - 1);
					expect($element.offset().left).toBeGreaterThan($(document).scrollLeft() - 1);
					expect($element.offset().top + $element.height()).toBeLessThan($(document).scrollTop() + $(window).height() + 1);
					expect($element.offset().left + $element.width()).toBeLessThan($(document).scrollLeft() + $(window).width() + 1);
				});
			});
			
		});
		
		describe('$.tour.manipulation.ExposeManipulation', function () {
			
			var manipulation;
			var $element;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				manipulation = new $.tour.manipulation.ExposeManipulation($element);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should cover the body and expose the element on deploy', function () {
				manipulation.deploy();
				var $cover = $('.' + $.tour.manipulation.ExposeManipulation.COVER_CLASSES);
				expect($cover.size()).toEqual(1);
				expect($cover.offset().top).toEqual(0);
				expect($cover.offset().left).toEqual(0);
				expect($cover.height()).toEqual($(document).height());
				expect($cover.width()).toEqual($(document).width());
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeTruthy();
				expect(parseInt($element.css('z-index'), 10)).toBeGreaterThan(parseInt($cover.css('z-index'), 10));
				manipulation.revert();
				$cover = $('.' + $.tour.manipulation.ExposeManipulation.COVER_CLASSES);
				expect($cover.size()).toEqual(0);
				expect($element.hasClass($.tour.manipulation.ExposeManipulation.CLASSES)).toBeFalsy();
			});
			
		});
		
		describe('$.tour.manipulation.HighlightManipulation', function () {
			
			var manipulation;
			var $element;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				manipulation = new $.tour.manipulation.HighlightManipulation($element);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should highlight the element on deploy', function () {
				manipulation.deploy();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeTruthy();
				manipulation.revert();
				expect($element.hasClass($.tour.manipulation.HighlightManipulation.CLASSES)).toBeFalsy();
			});
			
		});
		
		describe('$.tour.manipulation.MarkManipulation', function () {
			
			var manipulation;
			var $element;
			var text;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				text = 'hello world';
				manipulation = new $.tour.manipulation.MarkManipulation($element, text);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should mark the element on deploy', function () {
				var $mark = $('.tour-manipulation-mark');
				expect($mark.size()).toEqual(0);
				manipulation.deploy();
				$mark = $('.tour-manipulation-mark');
				expect($mark.size()).toEqual(1);
				expect($mark.text()).toEqual(text);
				manipulation.revert();
				$mark = $('.tour-manipulation-mark');
				expect($mark.size()).toEqual(0);
			});
			
		});
		
		describe('$.tour.manipulation.HintManipulation', function () {
			
			var manipulation;
			var $element;
			var content;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				content = 'hello world';
				manipulation = new $.tour.manipulation.HintManipulation($element, content);
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should hint the element on deploy', function () {
				var $hint = $('.tour-manipulation-hint');
				expect($hint.size()).toEqual(0);
				manipulation.deploy();
				$hint = $('.tour-manipulation-hint');
				expect($hint.size()).toEqual(1);
				expect($hint.html()).toEqual(content.toString());
				manipulation.revert();
				$hint = $('.tour-manipulation-hint');
				expect($hint.size()).toEqual(0);
			});
			
		});
		
		describe('$.tour.manipulation.ManipulationBuilder', function () {
			
			var manipulationBuilder;
			var $element;
						
			beforeEach(function () {
				$element = $('<div>').appendTo($('body'));
				$element.css('width', '30px');
				$element.css('height', '40px');
				$element.css('background-color', '#FF0000');
				manipulationBuilder = new $.tour.manipulation.ManipulationBuilder();
			});
			
			afterEach(function () {
				$element.remove();
			});
			
			it('should add manipulations', function () {
				manipulationBuilder.expose($element).highlight($element).scrollTo($element).mark($element).hint($element, 'hello');
				expect(manipulationBuilder.manipulations.length).toEqual(5);
				expect(manipulationBuilder.manipulations[0] instanceof $.tour.manipulation.ExposeManipulation).toBeTruthy();
				expect(manipulationBuilder.manipulations[1] instanceof $.tour.manipulation.HighlightManipulation).toBeTruthy();
				expect(manipulationBuilder.manipulations[2] instanceof $.tour.manipulation.ScrollToManipulation).toBeTruthy();
				expect(manipulationBuilder.manipulations[3] instanceof $.tour.manipulation.MarkManipulation).toBeTruthy();
				expect(manipulationBuilder.manipulations[4] instanceof $.tour.manipulation.HintManipulation).toBeTruthy();
				expect(manipulationBuilder.manipulations[0].$element).toBe($element);
				expect(manipulationBuilder.manipulations[1].$element).toBe($element);
				expect(manipulationBuilder.manipulations[2].$element).toBe($element);
				expect(manipulationBuilder.manipulations[3].$element).toBe($element);
				expect(manipulationBuilder.manipulations[4].$element).toBe($element);
				expect(manipulationBuilder.manipulations[4].$hint.html()).toEqual('hello');
			});
			
		});
		
	});
	
});