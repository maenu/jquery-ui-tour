/**
 * Widgets for a tour.
 *
 * @author Manuel Leuenberger
 * @module jQuery
 */

(function ($, undefined) {
	
	var tourClasses = 'ui-widget ui-tour';
	
	/**
	 * Controls a Tour. Observers the tour, so it is save to control the tour
	 * programmatically too.
	 *
	 * @class jQuery.tour
	 */
	$.widget('ui.tour', $.Widget, {
		options: {
			/**
			 * Required, the Tour to control.
			 *
			 * @property tour
			 * @type {Tour}
			 */
			tour: null
		},
		/**
		 * Creates a tour.
		 *
		 * @method tour
		 * @constructor
		 *
		 * @param {Object} [options] The options, must contain a "tour" property
		 */
		_create: function () {
			$.Widget.prototype._create.apply(this);
			
			this.options.tour.addObserver(this);
			
			this.$backward = $('<button type="button">').appendTo(this.element);
			this.$forward = $('<button type="button">').appendTo(this.element);
			
			this.$backward.button({
				icons: {
					primary: 'ui-icon-seek-prev'
				},
				text: false
			});
			this.$backward.bind('click.' + this.widgetName,
					$.proxy(function () {
						this.options.tour.backward();
					}, this));
			this.$backward.button('option', 'disabled',
					!this.options.tour.canBackward());
			this.$forward.button({
				icons: {
					primary: 'ui-icon-seek-next'
				},
				text: false
			});
			this.$forward.bind('click.' + this.widgetName,
					$.proxy(function () {
						this.options.tour.forward();
					}, this));
			this.$forward.button('option', 'disabled',
					!this.options.tour.canForward());
			this.element.addClass(tourClasses);
		},
		destroy: function () {
			this.options.tour.removeObserver(this);
			this.$backward.remove();
			this.$forward.remove();
			this.element.removeClass(tourClasses);
			
			$.Widget.prototype.destroy.apply(this, arguments);
		},
		_setOption: function (key, value) {
			if (key == 'tour') {
				this.options.tour.removeObserver(this);
			}
			
			$.Widget.prototype._setOption.apply(this, [key, value]);
			
			if (key == 'tour') {
				this.options.tour.addObserver(this);
				this.$backward.button('option', 'disabled',
						!this.options.tour.canBackward());
				this.$forward.button('option', 'disabled',
						!this.options.tour.canForward());
			}
		},
		updateObservable: function () {
			this.$backward.button('option', 'disabled',
					!this.options.tour.canBackward());
			this.$forward.button('option', 'disabled',
					!this.options.tour.canForward());
			if (!this.options.tour.canBackward()) {
				this.$backward.removeClass('ui-state-hover');
			}
			if (!this.options.tour.canForward()) {
				this.$forward.removeClass('ui-state-hover');
			}
		}
		
	});
	
	var automatictourClasses = 'ui-automatictour';
	
	/**
	 * Controls an AutomaticTour.
	 *
	 * @class jQuery.automatictour
	 * @extends jQuery.tour
	 */
	$.widget('ui.automatictour', $.ui.tour, {
		/**
		 * Creates an automatictour.
		 *
		 * @method automatictour
		 * @constructor
		 *
		 * @param {Object} [options] The options, must contain a "tour" property
		 */
		_create: function () {
			$.ui.tour.prototype._create.apply(this);
			
			this.$play = $('<button type="button">').insertBefore(
					this.$backward);
			this.$pause = $('<button type="button">').insertBefore(
					this.$backward);
			this.$stop = $('<button type="button">').insertBefore(
					this.$backward);
			
			this.$play.button({
				icons: {
					primary: 'ui-icon-play'
				},
				text: false
			});
			this.$play.bind('click.' + this.widgetName,
					$.proxy(function () {
						this.options.tour.play();
					}, this));
			this.$play.button('option', 'disabled',
					this.options.tour.isPlaying());
			this.$pause.button({
				icons: {
					primary: 'ui-icon-pause'
				},
				text: false
			});
			this.$pause.bind('click.' + this.widgetName,
					$.proxy(function () {
						this.options.tour.pause();
					}, this));
			this.$pause.button('option', 'disabled',
					!this.options.tour.isPlaying());
			this.$stop.button({
				icons: {
					primary: 'ui-icon-stop'
				},
				text: false
			});
			this.$stop.bind('click.' + this.widgetName,
					$.proxy(function () {
						this.options.tour.stop();
					}, this));
			this.element.addClass(automatictourClasses);
		},
		destroy: function () {
			this.options.tour.stop();
			this.$play.remove();
			this.$pause.remove();
			this.$stop.remove();
			this.element.removeClass(automatictourClasses);
			
			$.ui.tour.prototype.destroy.apply(this, arguments);
		},
		_setOption: function (key, value) {
			$.ui.tour.prototype._setOption.apply(this, [key, value]);
			
			if (key == 'tour') {
				this.$play.button('option', 'disabled',
						this.options.tour.isPlaying());
				this.$pause.button('option', 'disabled',
						!this.options.tour.isPlaying());
			}
		},
		updateObservable: function (observable, args) {
			$.ui.tour.prototype.updateObservable.apply(this,
					[observable, args]);
			
			this.$play.button('option', 'disabled',
					this.options.tour.isPlaying());
			this.$pause.button('option', 'disabled',
					!this.options.tour.isPlaying());
			if (this.options.tour.isPlaying()) {
				this.$play.removeClass('ui-state-hover');
			} else {
				this.$pause.removeClass('ui-state-hover');
			}
		}
		
	});
	
})(jQuery);