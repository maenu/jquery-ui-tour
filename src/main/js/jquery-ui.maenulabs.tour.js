/**
 * Widgets for a tour.
 *
 * @author
 *     Manuel Leuenberger
 */

(function($, undefined){
	
	var tourClasses = "ui-widget ui-tour";
	
	/**
	 * Controls a Tour.
	 */
	$.widget("ui.tour", $.ui.basewidget, {
		
		// default options
		options: {
			/**
			 * Required, the Tour to control.
			 */
			tour: null
		},
		
		// overrides
		
		_create: function() {
			$.ui.basewidget.prototype._create.apply(this);
			
			this.$backward = $('<button type="button">'
					+ $.globalization.localize("ui.tour.backward")
					+ '</button>').appendTo(this.element);
			this.$forward = $('<button type="button">'
					+ $.globalization.localize("ui.tour.forward")
					+ '</button>').appendTo(this.element);
			
			this.$backward.button({
				icons: {
					primary: "ui-icon-seek-prev"
				},
				text: false
			});
			this.$backward.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.tour.backward();
						if (!this.options.tour.canBackward()) {
							this.$backward.button("disable");
							this.$backward.removeClass("ui-state-hover");
						}
						if (!this.options.tour.canForward()) {
							this.$forward.button("disable");
							this.$forward.removeClass("ui-state-hover");
						} else {
							this.$forward.button("enable");
						}
					}, this));
			this.$forward.button({
				icons: {
					primary: "ui-icon-seek-next"
				},
				text: false
			});
			this.$forward.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.forward();
						if (!this.options.tour.canForward()) {
							this.$forward.button("disable");
							this.$forward.removeClass("ui-state-hover");
						}
						if (!this.options.tour.canBackward()) {
							this.$backward.button("disable");
							this.$backward.removeClass("ui-state-hover");
						} else {
							this.$backward.button("enable");
						}
					}, this));
			this.element.addClass(tourClasses);
			
			this._setOption("tour", this.options.tour);
		},
		
		destroy: function() {
			this.$backward.remove();
			this.$forward.remove();
			this.element.removeClass(tourClasses);
			
			$.ui.basewidget.prototype.destroy.apply(this, arguments);
		},
	
		_setOption: function(key, value) {
			$.ui.basewidget.prototype._setOption.apply(this, arguments);
			
			if (key == "tour") {
				this.$backward.button("option", "disabled",
						!this.options.tour.canBackward());
				this.$forward.button("option", "disabled",
						!this.options.tour.canForward());
			}
		}
		
	});
	
	var automatictourClasses = "ui-widget ui-automatictour";
	
	/**
	 * Controls an AutomaticTour.
	 */
	$.widget("ui.automatictour", $.ui.basewidget, {
		
		// default options
		options: {
			/**
			 * Required, the AutomaticTour to control.
			 */
			automaticTour: null
		},
		
		// overrides
		
		_create: function() {
			$.ui.basewidget.prototype._create.apply(this);
			
			this.$play = $('<button type="button">'
					+ $.globalization.localize("ui.automatictour.play")
					+ '</button>').appendTo(this.element);
			this.$pause = $('<button type="button">'
					+ $.globalization.localize("ui.automatictour.pause")
					+ '</button>').appendTo(this.element);
			this.$stop = $('<button type="button">'
					+ $.globalization.localize("ui.automatictour.stop")
					+ '</button>').appendTo(this.element);
			this.$backward = $('<button type="button">'
					+ $.globalization.localize("ui.tour.backward")
					+ '</button>').appendTo(this.element);
			this.$forward = $('<button type="button">'
					+ $.globalization.localize("ui.tour.forward")
					+ '</button>').appendTo(this.element);
			
			this.$play.button({
				icons: {
					primary: "ui-icon-play"
				},
				text: false
			});
			this.$play.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.play();
						this.$play.removeClass("ui-state-hover");
						this.$play.button("disable");
						this.$pause.button("enable");
						this.$stop.button("enable");
						this.$backward.button("disable");
						this.$forward.button("disable");
					}, this));
			this.$pause.button({
				icons: {
					primary: "ui-icon-pause"
				},
				text: false
			});
			this.$pause.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.pause();
						this.$pause.removeClass("ui-state-hover");
						this.$play.button("enable");
						this.$pause.button("disable");
						this.$stop.button("enable");
						this.$backward.button("enable");
						this.$forward.button("enable");
					}, this));
			this.$stop.button({
				icons: {
					primary: "ui-icon-stop"
				},
				text: false
			});
			this.$stop.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.stop();
						this.$stop.removeClass("ui-state-hover");
						this.$play.button("enable");
						this.$pause.button("disable");
						this.$stop.button("disable");
						this.$backward.button("enable");
						this.$forward.button("enable");
					}, this));
			this.$backward.button({
				icons: {
					primary: "ui-icon-seek-prev"
				},
				text: false
			});
			this.$backward.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.backward();
						if (!this.options.automatictour.canBackward()) {
							this.$backward.button("disable");
							this.$backward.removeClass("ui-state-hover");
						}
						if (!this.options.automatictour.canForward()) {
							this.$forward.button("disable");
							this.$forward.removeClass("ui-state-hover");
						} else {
							this.$forward.button("enable");
						}
					}, this));
			this.$forward.button({
				icons: {
					primary: "ui-icon-seek-next"
				},
				text: false
			});
			this.$forward.bind("click." + this.widgetName + this.uniqueId,
					$.proxy(function() {
						this.options.automatictour.forward();
						if (!this.options.automatictour.canForward()) {
							this.$forward.button("disable");
							this.$forward.removeClass("ui-state-hover");
						}
						if (!this.options.automatictour.canBackward()) {
							this.$backward.button("disable");
							this.$backward.removeClass("ui-state-hover");
						} else {
							this.$backward.button("enable");
						}
					}, this));
			this.element.addClass(automatictourClasses);
			
			this._setOption("automatictour", this.options.automatictour);
		},
		
		destroy: function() {
			this.$play.remove();
			this.$pause.remove();
			this.$stop.remove();
			this.$backward.remove();
			this.$forward.remove();
			this.element.removeClass(automatictourClasses);
			
			$.ui.basewidget.prototype.destroy.apply(this, arguments);
		},
	
		_setOption: function(key, value) {
			$.ui.basewidget.prototype._setOption.apply(this, arguments);
			
			if (key == "automatictour") {
				if (this.options.automatictour.isPlaying()) {
					this.$play.button("disable");
					this.$pause.button("enable");
					this.$stop.button("enable");
					this.$backward.button("disable");
					this.$forward.button("disable");
				} else {
					this.$play.button("enable");
					this.$pause.button("disable");
					this.$stop.button("disable");
					this.$backward.button("option", "disabled",
							!this.options.automatictour.canBackward());
					this.$forward.button("option", "disabled",
							!this.options.automatictour.canForward());
				}
			}
		}
		
	});
	
})(jQuery)