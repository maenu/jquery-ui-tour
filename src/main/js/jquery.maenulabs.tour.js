/**
 * Utils to make a multi-step, multi-page tour. Must set variable tour before.
 * Manipulations must have deploy and revert methods.
 *
 * @author
 *     Manuel Leuenberger
 */

(function($, undefined) {
	
	/**
	 * Creates a Tour with the specified steps.
	 *
	 * @param steps
	 *     An array of steps
	 */
	function Tour(steps) {
		/**
		 * The Steps.
		 */
		this.steps = steps;
		/**
		 * The index of the current step.
		 */
		this.currentStepIndex = -1;
	}
	
	/**
	 * Goes one step forward.
	 */
	Tour.prototype.forward = function() {
		if (this.currentStepIndex >= 0) {
			this.steps[this.currentStepIndex].revert();
		}
		this.steps[++this.currentStepIndex].deploy();
	};
	
	/**
	 * Goes one step backward.
	 */
	Tour.prototype.backward = function() {
		if (this.currentStepIndex < this.steps.length) {
			this.steps[this.currentStepIndex].revert();
		}
		this.steps[--this.currentStepIndex].deploy();
	};
	
	/**
	 * Checks if it can go one step forward.
	 *
	 * @return
	 *     true if it can, false otherwise
	 */
	Tour.prototype.canForward = function() {
		return this.currentStepIndex < this.steps.length - 1;
	};
	
	/**
	 * Checks if it can go one step backward.
	 *
	 * @return
	 *     true if it can, false otherwise
	 */
	Tour.prototype.canBackward = function() {
		return this.currentStepIndex > 0;
	};
	
	/**
	 * Creates a nAutomaticTour with the specified steps.
	 *
	 * @param steps
	 *     An array of steps
	 * @param interval
	 *     The interval between the steps in milliseconds
	 */
	function AutomaticTour(steps, interval) {
		Tour.apply(this, [steps]);
		/**
		 * The interval duration in milliseconds.
		 */
		this.interval = interval;
		/**
		 * The interval id.
		 */
		this.intervalId = null;
	}
	AutomaticTour.prototype = new Tour();
	AutomaticTour.prototype.constructor = AutomaticTour;
	
	/**
	 * Plays it from the point where it was stopped last.
	 */
	AutomaticTour.prototype.play = function() {
		this.forward();
		this.intervalId = setInterval($.proxy(function() {
			if (this.canForward()) {
				this.forward();
			} else {
				this.stop();
			}
		}, this), this.interval);
	};
	
	/**
	 * Stops it.
	 */
	AutomaticTour.prototype.stop = function() {
		if (this.isPlaying()) {
			clearInterval(this.intervalId);
			this.steps[this.currentStepIndex].revert();
		}
		this.currentStepIndex = -1;
	};
	
	/**
	 * Pauses it.
	 */
	AutomaticTour.prototype.pause = function() {
		clearInterval(this.intervalId);
	};
	
	/**
	 * Checks if it is playing.
	 *
	 * @return
	 *     true if it is, false otherwise
	 */
	AutomaticTour.prototype.isPlaying = function() {
		return this.intervalId != null;
	};
	
	/**
	 * Creates a Manipulation.
	 */
	function Manipulation() {
		
	}
	
	/**
	 * Deploys it.
	 */
	Manipulation.prototype.deploy = function() {
		
	};
	
	/**
	 * Reverts it.
	 */
	Manipulation.prototype.revert = function() {
		
	};
	
	/**
	 * Creates a Step with the specified manipulations.
	 *
	 * @param manipulations
	 *     The Manipulations
	 */
	function Step(manipulations) {
		Manipulation.apply(this);
		/**
		 * The Manipulations.
		 */
		this.manipulations = manipulations;
	}
	Step.prototype = new Manipulation();
	Step.prototype.constructor = Step;
	
	Step.prototype.deploy = function() {
		for (var i = 0; i < this.manipulations.length; i++) {
			this.manipulations[i].deploy();
		}
	};
	
	Step.prototype.revert = function() {
		for (var i = 0; i < this.manipulations.length; i++) {
			this.manipulations[i].revert();
		}
	};
	
	/**
	 * Creates a JQueryManipulation on the specified element.
	 *
	 * @param $element
	 *     A jQuery object
	 */
	function JQueryManipulation($element) {
		Manipulation.apply(this);
		/**
		 * The element to scrol to.
		 */
		this.$element = $element;
	}
	JQueryManipulation.prototype = new Manipulation();
	JQueryManipulation.prototype.constructor = JQueryManipulation;
	
	/**
	 * Creates a ScrollToManipulation. Centers on the specified element.
	 *
	 * @param $element
	 *     A jQuery object
	 */
	function ScrollToManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
	}
	ScrollToManipulation.prototype = new JQueryManipulation();
	ScrollToManipulation.prototype.constructor = ScrollToManipulation;
	
	ScrollToManipulation.prototype.deploy = function() {
		var viewportSize = {
			width: $(document).width(),
			height: $(document).height()
		};
		var elementSize = {
			width: this.$element.width(),
			height: this.$element.height()
		};
		var elementOffset = this.$element.offset();
		$("html").animate({
			scrollLeft: elementOffset.left
				+ (elementSize.width - viewportSize.width) / 2,
			scrollTop: elementOffset.top
				+ (elementSize.height - viewportSize.height) / 2
		}, {
			duration: 500
		});
	};
	
	/**
	 * Creates an JQueryManipulation.
	 *
	 * @param $element
	 *     A jQuery object
	 */
	function ExposeManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The old overwritten CSS properties of the element.
		 */
		this.oldProperties = {};
		/**
		 * The cover for the body.
		 */
		this.$cover = null;
	}
	ExposeManipulation.prototype = new JQueryManipulation();
	ExposeManipulation.prototype.constructor = ScrollToManipulation;
	
	ExposeManipulation.prototype.deploy = function() {
		this.oldProperties = {
			"z-index": this.$element.css("z-index"),
			"position": this.$element.css("position")
		};
		this.$element.css({
			"z-index": 100001,
			"position": "relative"
		});
		this.$cover = $('<div>').appendTo($("body"));
		this.$cover.addClass("ui-tour-manipulation-expose-cover");
	};
	
	ExposeManipulation.prototype.revert = function() {
		this.$element.css(this.oldProperties);
		this.$cover.remove();
	};
	
	/**
	 * Creates a HighlightManipulation.
	 *
	 * @param $element
	 *     A jQuery object
	 */
	function HighlightManipulation($element) {
		JQueryManipulation.apply(this, [$element]);
	}
	HighlightManipulation.prototype = new JQueryManipulation();
	HighlightManipulation.prototype.constructor = HighlightManipulation;
	
	HighlightManipulation.prototype.deploy = function() {
		this.$element.addClass("ui-tour-manipulation-highlight");
	};
	
	HighlightManipulation.prototype.revert = function() {
		this.$element.removeClass("ui-tour-manipulation-highlight");
	};
	
	/**
	 * Creates a MarkManipulation.
	 *
	 * @param $element
	 *     A jQuery object
	 * @param text
	 *     Optional, a short string
	 */
	function MarkManipulation($element, text) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The mark.
		 */
		this.$mark = $('<span>');
		
		if (text != null) {
			this.$mark.text(text);
		}
		this.$mark.addClass("ui-tour-manipulation-mark");
	}
	MarkManipulation.prototype = new JQueryManipulation();
	MarkManipulation.prototype.constructor = MarkManipulation;
	
	MarkManipulation.prototype.deploy = function() {
		this.$mark.appendTo($("body"));
		this.$mark.offset({
			top: this.$element.offset().top
					+ parseFloat(this.$mark.css("margin-top")),
			left: this.$element.offset().left
					+ parseFloat(this.$mark.css("margin-left"))
		});
	};
	
	MarkManipulation.prototype.revert = function() {
		this.$mark.remove();
	};
	
	/**
	 * Creates a HintManipulation.
	 *
	 * @param $element
	 *     A jQuery object
	 * @param content
	 *     The hint text, HTML markup or a jQuery object
	 */
	function HintManipulation($element, content) {
		JQueryManipulation.apply(this, [$element]);
		/**
		 * The hint.
		 */
		this.$hint = $('<div>');
		
		this.$hint.append(content);
		this.$hint.addClass("ui-tour-manipulation-hint");
	}
	HintManipulation.prototype = new JQueryManipulation();
	HintManipulation.prototype.constructor = HintManipulation;
	
	HintManipulation.prototype.deploy = function() {
		this.$hint.appendTo($("body"));
		this.$hint.offset({
			top: this.$element.offset().top
					+ parseFloat(this.$hint.css("margin-top"))
					+ this.$element.outerHeight(),
			left: this.$element.offset().left
		});
	};
	
	HintManipulation.prototype.revert = function() {
		this.$hint.remove();
	};
	
	/**
	 * Creates a ManipulationBuilder.
	 */
	function ManipulationBuilder() {
		/**
		 * The collected Manipulations.
		 */
		this.manipulations = [];
	}
	
	/**
	 * Scrolls to the specified element.
	 *
	 * @param $element
	 *     A jQuery object to scroll to
	 *
	 * @return
	 *     The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.scrollTo = function($element) {
		this.manipulations.push(new ScrollToManipulation($element));
		return this;
	};
	
	/**
	 * Exposes the specified element.
	 *
	 * @param $element
	 *     A jQuery object to expose
	 *
	 * @return
	 *     The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.expose = function($element) {
		this.manipulations.push(new ExposeManipulation($element));
		return this;
	};
	
	/**
	 * Highlights the specified element.
	 *
	 * @param $element
	 *     A jQuery object to expose
	 *
	 * @return
	 *     The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.highlight = function($element) {
		this.manipulations.push(new HighlightManipulation($element));
		return this;
	};
	
	/**
	 * Marks the specified element.
	 *
	 * @param $element
	 *     A jQuery object to mark
	 * @param text
	 *     Optional, a short string
	 *
	 * @return
	 *     The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.mark = function($element, text) {
		this.manipulations.push(new MarkManipulation($element, text));
		return this;
	};
	
	/**
	 * Makes a hint for the specified element.
	 *
	 * @param $element
	 *     A jQuery object to mark
	 * @param content
	 *     The hint text, HTML markup or a jQuery object
	 *
	 * @return
	 *     The ManipulationBuilder itself
	 */
	ManipulationBuilder.prototype.hint = function($element, content) {
		this.manipulations.push(new HintManipulation($element, content));
		return this;
	};
	
	$.tour = {};
	$.tour.Tour = Tour;
	$.tour.AutomaticTour = AutomaticTour;
	$.tour.Step = Step
	$.tour.manipulation = {};
	$.tour.manipulation.Manipulation = Manipulation;
	$.tour.manipulation.JQueryManipulation = JQueryManipulation;
	$.tour.manipulation.ScrollToManipulation = ScrollToManipulation;
	$.tour.manipulation.ExposeManipulation = ExposeManipulation;
	$.tour.manipulation.HighlightManipulation = HighlightManipulation;
	$.tour.manipulation.MarkManipulation = MarkManipulation;
	$.tour.manipulation.ManipulationBuilder = ManipulationBuilder;
	
	$(document).ready(function() {
		/*if (tour != null && (location.hash == "#tour"
				|| $.cookies.get(tour) == "true")) {
			tour.start();
		}*/
	});
	
}(jQuery));