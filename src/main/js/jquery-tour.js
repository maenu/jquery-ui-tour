/**
 * Utils to make a multi-step, multi-page tour. Must set variable tour before.
 * Manipulations must have deploy and revert methods.
 *
 * @author Manuel Leuenberger
 * @module jQuery.tour
 */

(function ($, undefined) {
	
	/**
	 * Creates an Observer.
	 *
	 * @private
	 * @class Observer
	 * @constructor
	 */
	function Observer() {}
	/**
	 * Called whenever an Observable updates its Observers.
	 *
	 * @method updateObservable
	 *
	 * @param {Observable} observable The Observable
	 * @param {Object} args The arguments passed by the observable
	 */
	Observer.prototype.updateObservable = function () {};
	
	/**
	 * Creates an Observable.
	 *
	 * @private
	 * @class Observable
	 * @constructor
	 */
	function Observable() {
		/**
		 * The Observers.
		 *
		 * @private
		 * @property observers
		 * @type {Array}
		 * @default []
		 */
		this.observers = [];
	}
	/**
	 * Updates all Observers this the specified arguments.
	 *
	 * @method updateObservable
	 *
	 * @param {Object} args The arguments to pass to the Observers
	 */
	Observable.prototype.updateObservers = function (args) {
		for (var i = 0; i < this.observers.length; i++) {
			this.observers[i].updateObservable(this, args);
		}
	};
	/**
	 * Adds an Observer. If it is already registered, it will not be added
	 * again.
	 *
	 * @method addObserver
	 *
	 * @param {Observer} observer The observer to add
	 */
	Observable.prototype.addObserver = function (observer) {
		for (var i = 0; i < this.observers.length; i++) {
			var registered = this.observers[i];
			if (registered == observer) {
				return;
			}
		}
		this.observers.push(observer);
	};
	/**
	 * Removes an Observer. If it is not already registered, it will not have no
	 * effect.
	 *
	 * @method removeObserver
	 *
	 * @param {Observer} observer The observer to remove
	 */
	Observable.prototype.removeObserver = function (observer) {
		for (var i = 0; i < this.observers.length; i++) {
			var registered = this.observers[i];
			if (registered == observer) {
				this.observers.splice(i, 1);
				return;
			}
		}
	};
	
	/**
	 * Creates a Tour with the specified steps.
	 *
	 * @class jQuery.tour.Tour
	 * @extends Observable
	 * @constructor
	 *
	 * @param {Array} steps An array of steps
	 */
	function Tour(steps) {
		Observable.apply(this);
		/**
		 * The Steps.
		 *
		 * @property steps
		 * @type {Array}
		 */
		this.steps = steps;
		/**
		 * The index of the current step.
		 *
		 * @property currentStepIndex
		 * @type {Number}
		 * @default -1
		 */
		this.currentStepIndex = -1;
	}
	Tour.prototype = new Observable();
	Tour.prototype.constructor = Tour;
	/**
	 * Reverts the current step.
	 *
	 * @method revertCurrentStep
	 */
	Tour.prototype.revertCurrentStep = function () {
		if (this.currentStepIndex >= 0
				&& this.currentStepIndex < this.steps.length) {
			this.steps[this.currentStepIndex].revert();
		}
	};
	/**
	 * Goes one step forward.
	 *
	 * @method forward
	 */
	Tour.prototype.forward = function () {
		if (this.currentStepIndex >= 0) {
			this.steps[this.currentStepIndex].revert();
		}
		this.steps[++this.currentStepIndex].deploy();
		this.updateObservers('forward');
	};
	/**
	 * Goes one step backward.
	 *
	 * @method backward
	 */
	Tour.prototype.backward = function () {
		if (this.currentStepIndex < this.steps.length) {
			this.steps[this.currentStepIndex].revert();
		}
		this.steps[--this.currentStepIndex].deploy();
		this.updateObservers('backward');
	};
	/**
	 * Checks if it can go one step forward.
	 *
	 * @method canForward
	 *
	 * @return {Boolean} true if it can, false otherwise
	 */
	Tour.prototype.canForward = function () {
		return this.currentStepIndex < this.steps.length - 1;
	};
	/**
	 * Checks if it can go one step backward.
	 *
	 * @method canBackward
	 *
	 * @return {Boolean} true if it can, false otherwise
	 */
	Tour.prototype.canBackward = function () {
		return this.currentStepIndex > 0;
	};
	
	/**
	 * Creates an AutomaticTour with the specified steps.
	 *
	 * @class jQuery.tour.AutomaticTour
	 * @extends jQuery.tour.Tour
	 * @constructor
	 *
	 * @param {Array} steps An array of steps
	 * @param {Number} interval The interval between the steps in milliseconds
	 */
	function AutomaticTour(steps, interval) {
		Tour.apply(this, [steps]);
		/**
		 * The interval duration in milliseconds.
		 *
		 * @property interval
		 * @type {Number}
		 */
		this.interval = interval;
		/**
		 * The interval id.
		 *
		 * @private
		 * @property intervalId
		 * @type {Number}
		 * @default null
		 */
		this.intervalId = null;
	}
	AutomaticTour.prototype = new Tour();
	AutomaticTour.prototype.constructor = AutomaticTour;
	/**
	 * Plays it from the point where it was stopped last.
	 *
	 * @method play
	 */
	AutomaticTour.prototype.play = function () {
		this.forward();
		this.intervalId = setInterval($.proxy(function () {
				if (this.canForward()) {
					this.forward();
				} else {
					this.stop();
				}
			}, this), this.interval);
		this.updateObservers('play');
	};
	/**
	 * Pauses it.
	 *
	 * @method pause
	 */
	AutomaticTour.prototype.pause = function () {
		clearInterval(this.intervalId);
		this.intervalId = null;
		this.updateObservers('pause');
	};
	/**
	 * Stops it.
	 *
	 * @method stop
	 */
	AutomaticTour.prototype.stop = function () {
		if (this.isPlaying()) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.revertCurrentStep();
		this.currentStepIndex = -1;
		this.updateObservers('stop');
	};
	/**
	 * Checks if it is playing.
	 *
	 * @method isPlaying
	 *
	 * @return {Boolean} true if it is, false otherwise
	 */
	AutomaticTour.prototype.isPlaying = function () {
		return this.intervalId != null;
	};
	
	/**
	 * Creates a Manipulation.
	 *
	 * @class jQuery.tour.Manipulation
	 * @constructor
	 */
	function Manipulation() {
		
	}
	/**
	 * Deploys it.
	 *
	 * @method deploy
	 */
	Manipulation.prototype.deploy = function () {
		
	};
	/**
	 * Reverts it.
	 *
	 * @method revert
	 */
	Manipulation.prototype.revert = function () {
		
	};
	
	/**
	 * Creates a Step with the specified manipulations.
	 *
	 * @class jQuery.tour.Step
	 * @extends jQuery.tour.Manipulation
	 * @constructor
	 *
	 * @param {Array} manipulations The Manipulations
	 */
	function Step(manipulations) {
		Manipulation.apply(this);
		/**
		 * The Manipulations.
		 *
		 * @property manipulations
		 * @type {Array}
		 */
		this.manipulations = manipulations;
	}
	Step.prototype = new Manipulation();
	Step.prototype.constructor = Step;
	Step.prototype.deploy = function () {
		for (var i = 0; i < this.manipulations.length; i++) {
			this.manipulations[i].deploy();
		}
	};
	Step.prototype.revert = function () {
		for (var i = 0; i < this.manipulations.length; i++) {
			this.manipulations[i].revert();
		}
	};
	
	/**
	 * Creates a JQueryManipulation on the specified element.
	 *
	 * @class jQuery.tour.JQueryManipulation
	 * @extends jQuery.tour.Manipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 */
	function JQueryManipulation($element) {
		Manipulation.apply(this);
		/**
		 * The element to manipulate.
		 *
		 * @property $element
		 * @type {jQuery}
		 */
		this.$element = $element;
	}
	JQueryManipulation.prototype = new Manipulation();
	JQueryManipulation.prototype.constructor = JQueryManipulation;
	
	/**
	 * Creates a ScrollToManipulation. Centers on the specified element.
	 *
	 * @class jQuery.tour.ScrollToManipulation
	 * @extends jQuery.tour.JQueryManipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 */
	function ScrollToManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
	}
	ScrollToManipulation.prototype = new JQueryManipulation();
	ScrollToManipulation.prototype.constructor = ScrollToManipulation;
	ScrollToManipulation.prototype.deploy = function () {
		var viewportSize = {
			width: $(window).width(),
			height: $(window).height()
		};
		var elementSize = {
			width: this.$element.width(),
			height: this.$element.height()
		};
		var elementOffset = this.$element.offset();
		$('html,body').animate({
			scrollLeft: elementOffset.left
				+ (elementSize.width - viewportSize.width) / 2,
			scrollTop: elementOffset.top
				+ (elementSize.height - viewportSize.height) / 2
		}, {
			duration: 500
		});
	};
	
	/**
	 * Creates an ExposeManipulation.
	 *
	 * @class jQuery.tour.ExposeManipulation
	 * @extends jQuery.tour.JQueryManipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 */
	function ExposeManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The cover for the body.
		 */
		this.$cover = null;
	}
	ExposeManipulation.prototype = new JQueryManipulation();
	ExposeManipulation.prototype.constructor = ScrollToManipulation;
	/**
	 * The CSS classes that will be applied to the cover element.
	 *
	 * @static
	 * @property COVER_CLASSES
	 * @type {STRING}
	 * @default "tour-manipulation-expose-cover"
	 */
	ExposeManipulation.COVER_CLASSES = 'tour-manipulation-expose-cover';
	/**
	 * The CSS classes that will be applied to the exposed element.
	 *
	 * @static
	 * @property CLASSES
	 * @type {STRING}
	 * @default "tour-manipulation-expose"
	 */
	ExposeManipulation.CLASSES = 'tour-manipulation-expose';
	ExposeManipulation.prototype.deploy = function () {
		this.$element.addClass(ExposeManipulation.CLASSES);
		this.$cover = $('<div>').appendTo($('body')).addClass(
				ExposeManipulation.COVER_CLASSES);
	};
	ExposeManipulation.prototype.revert = function () {
		this.$element.removeClass(ExposeManipulation.CLASSES);
		this.$cover.remove();
	};
	
	/**
	 * Creates a HighlightManipulation.
	 *
	 * @class jQuery.tour.HighlightManipulation
	 * @extends jQuery.tour.JQueryManipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 */
	function HighlightManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
	}
	HighlightManipulation.prototype = new JQueryManipulation();
	HighlightManipulation.prototype.constructor = HighlightManipulation;
	/**
	 * The CSS classes that will be applied to the highlighted element.
	 *
	 * @static
	 * @property CLASSES
	 * @type {STRING}
	 * @default "tour-manipulation-highlight"
	 */
	HighlightManipulation.CLASSES = 'tour-manipulation-highlight';
	HighlightManipulation.prototype.deploy = function () {
		this.$element.addClass(HighlightManipulation.CLASSES);
	};
	HighlightManipulation.prototype.revert = function () {
		this.$element.removeClass(HighlightManipulation.CLASSES);
	};
	
	/**
	 * Creates a MarkManipulation.
	 *
	 * @class jQuery.tour.MarkManipulation
	 * @extends jQuery.tour.JQueryManipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 * @param {String} [text] A short string
	 */
	function MarkManipulation($element, text) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The mark.
		 *
		 * @private
		 * @property $mark
		 * @type {jQuery}
		 * @default $("<span>")
		 */
		this.$mark = $('<span>');
		if (text != null) {
			this.$mark.text(text);
		}
		this.$mark.addClass(MarkManipulation.CLASSES);
	}
	MarkManipulation.prototype = new JQueryManipulation();
	MarkManipulation.prototype.constructor = MarkManipulation;
	/**
	 * The CSS classes that will be applied to the marked element.
	 *
	 * @static
	 * @property CLASSES
	 * @type {STRING}
	 * @default "tour-manipulation-mark"
	 */
	MarkManipulation.CLASSES = 'tour-manipulation-mark';
	MarkManipulation.prototype.deploy = function () {
		this.$mark.appendTo($('body'));
		this.$mark.offset({
			top: this.$element.offset().top
					+ parseFloat(this.$mark.css('margin-top')),
			left: this.$element.offset().left
					+ parseFloat(this.$mark.css('margin-left'))
		});
	};
	MarkManipulation.prototype.revert = function () {
		this.$mark.remove();
	};
	
	/**
	 * Creates a HintManipulation.
	 *
	 * @class jQuery.tour.HintManipulation
	 * @extends jQuery.tour.JQueryManipulation
	 * @constructor
	 *
	 * @param {jQuery} $element A jQuery object
	 * @param {String|jQuery} content The hint text, HTML markup or a jQuery
	 *     object
	 */
	function HintManipulation($element, content) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The hint.
		 *
		 * @private
		 * @property $hint
		 * @type {jQuery}
		 * @default $("<div>")
		 */
		this.$hint = $('<div>');
		this.$hint.append(content);
		this.$hint.addClass(HintManipulation.CLASSES);
	}
	HintManipulation.prototype = new JQueryManipulation();
	HintManipulation.prototype.constructor = HintManipulation;
	/**
	 * The CSS classes that will be applied to the marked element.
	 *
	 * @static
	 * @property CLASSES
	 * @type {STRING}
	 * @default "tour-manipulation-hint"
	 */
	HintManipulation.CLASSES = 'tour-manipulation-hint';
	HintManipulation.prototype.deploy = function () {
		this.$hint.appendTo($('body'));
		this.$hint.offset({
			top: this.$element.offset().top
					+ parseFloat(this.$hint.css('margin-top'))
					+ this.$element.outerHeight(),
			left: this.$element.offset().left
		});
	};
	HintManipulation.prototype.revert = function () {
		this.$hint.remove();
	};
	
	/**
	 * Creates a ManipulationBuilder.
	 *
	 * @class jQuery.tour.ManipulationBuilder
	 * @constructor
	 */
	function ManipulationBuilder() {
		/**
		 * The collected Manipulations.
		 *
		 * @property manipulations
		 * @type {Array}
		 * @default []
		 */
		this.manipulations = [];
	}
	/**
	 * Scrolls to the specified element.
	 *
	 * @method scrollTo
	 *
	 * @param {jQuery} $element A jQuery object to scroll to
	 *
	 * @return {ManipulationBuilder} The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.scrollTo = function ($element) {
		this.manipulations.push(new ScrollToManipulation($element));
		return this;
	};
	/**
	 * Exposes the specified element.
	 *
	 * @method expose
	 *
	 * @param {jQuery} $element A jQuery object to expose
	 *
	 * @return {ManipulationBuilder} The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.expose = function ($element) {
		this.manipulations.push(new ExposeManipulation($element));
		return this;
	};
	/**
	 * Highlights the specified element.
	 *
	 * @method highlight
	 *
	 * @param {jQuery} $element A jQuery object to highlight
	 *
	 * @return {ManipulationBuilder} The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.highlight = function ($element) {
		this.manipulations.push(new HighlightManipulation($element));
		return this;
	};
	/**
	 * Marks the specified element.
	 *
	 * @method mark
	 *
	 * @param {jQuery} $element A jQuery object to mark
	 * @param {String} [text] A short string
	 *
	 * @return {ManipulationBuilder} The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.mark = function ($element, text) {
		this.manipulations.push(new MarkManipulation($element, text));
		return this;
	};
	/**
	 * Makes a hint for the specified element.
	 *
	 * @method hint
	 *
	 * @param {jQuery} $element A jQuery object to show a hint for
	 * @param {String|jQuery} content The hint text, HTML markup or a jQuery
	 *     object
	 *
	 * @return {ManipulationBuilder} The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.hint = function ($element, content) {
		this.manipulations.push(new HintManipulation($element, content));
		return this;
	};
	
	$.tour = {};
	$.tour.Tour = Tour;
	$.tour.AutomaticTour = AutomaticTour;
	$.tour.Step = Step;
	$.tour.manipulation = {};
	$.tour.manipulation.Manipulation = Manipulation;
	$.tour.manipulation.JQueryManipulation = JQueryManipulation;
	$.tour.manipulation.ScrollToManipulation = ScrollToManipulation;
	$.tour.manipulation.ExposeManipulation = ExposeManipulation;
	$.tour.manipulation.HighlightManipulation = HighlightManipulation;
	$.tour.manipulation.MarkManipulation = MarkManipulation;
	$.tour.manipulation.HintManipulation = HintManipulation;
	$.tour.manipulation.ManipulationBuilder = ManipulationBuilder;
	
}(jQuery));