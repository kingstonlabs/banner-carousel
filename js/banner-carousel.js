$(document).ready(function() {
    var BannerCarouselFactory = function(container) {
        /*
            Factory for creating banner carousels for a given container
        */
        var bannerCarousel = {

            container: null,
            itemSelector: '.banner-item',
            slides: null,
            currentSlide: null,
            interval: 4000,    
            transitionDuration: 2000,
            transitionFunction: null,
            animationTimer: null,
            nextButtons: null,
            previousButtons: null,

            init: function(container) {
                this.container = $(container);
                this.slides = this.container.find(this.itemSelector);
                this.currentSlide = this.slides.first();

                this.interval = this.getInterval();
                this.transitionDuration = this.getTransitionDuration();
                this.transitionFunction = this.getTransitionFunction();

                this.nextButtons = this.container.find('.banner-next');
                this.nextButtons.on('click', $.proxy(this.goToNextSlide, this));
                this.previousButtons = this.container.find('.banner-previous');
                this.previousButtons.on('click', $.proxy(this.goToPreviousSlide, this));

                // expose useful options on root object
                this.animate = bannerCarousel.animate;
                this.goToNextSlide = bannerCarousel.goToNextSlide;
                this.goToPreviousSlide = bannerCarousel.goToPreviousSlide;

                this.animate();     // start animation

                return this;
            },

            getInterval: function() {
                var interval = this.container.data('interval');
                if (interval == undefined) {
                    return this.interval;
                }
                return interval;
            },

            getTransitionDuration: function() {
                var transitionDuration = this.container.data('transitionDuration');
                if (transitionDuration == undefined) {
                    return this.transitionDuration;
                }
                return transitionDuration;
            },

            getTransitionFunction: function() {
                var transition = this.container.data('transitionFunction');
                if (transition == undefined) {
                    transition = 'slideHorizontal'
                }
                return this.transitions[transition];
            },

            animate: function() {
                // Don't run animations if there is only one slide
                if (this.slides.length > 1) {
                    this.resetAnimationTimer();                    
                }
            },

            resetAnimationTimer: function() {
                // clear the timer first
                if (this.animationTimer !== null) {
                    clearTimeout(this.animationTimer);
                }
                // proxy maintains this as context
                this.animationTimer = setTimeout($.proxy(this.goToNextSlide, this), this.interval + this.transitionDuration);
            },

            goToNextSlide: function() {
                var newSlide = this.getNextSlide(); 
                this.transitionInToSlide(newSlide);   
            },

            getNextSlide: function() {        
                nextSlide = this.currentSlide.next();
                if (nextSlide.length == 0) {
                    nextSlide = this.slides.first();
                }
                return nextSlide;
            },

            goToPreviousSlide: function() {    
                var newSlide = this.getPreviousSlide();        
                this.transitionInToSlide(newSlide, -1);        
            },

            getPreviousSlide: function() {
                previousSlide = this.currentSlide.prev();
                if (previousSlide.length == 0) {
                    previousSlide = this.slides.last();
                }
                return previousSlide;
            },

            transitionInToSlide: function(slide, direction) {
                // only go to slide if we are not going to the same slide and animation isn't already running
                if (!slide.is(this.currentSlide) && !this.currentSlide.is(':animated')) {
                    this.resetAnimationTimer();          
                    this.currentSlide = this.transitionFunction(this.currentSlide, slide, direction);
                }
            },

            transitions: {                
                slideHorizontal: function(startSlide, endSlide, direction) {
                    direction = (typeof direction === "undefined") ? 1 : direction;
                    startSlide
                        .stop()
                        .css({left: 0})
                        .animate({left: direction * -100 + '%'}, {duration: this.transitionDuration});            

                    endSlide
                        .stop()
                        .css({left: direction * 100 + '%'})
                        .animate({left: 0}, {duration: this.transitionDuration});

                    return endSlide;
                },    
                slideVertical: function(startSlide, endSlide, direction) {
                    direction = (typeof direction === "undefined") ? 1 : direction;
                    startSlide
                        .stop()
                        .css({top: 0, left: 0})
                        .animate({top: -direction * this.container.height()}, {duration: this.transitionDuration});            

                    endSlide
                        .stop()
                        .css({top: direction * this.container.height(), left: 0})
                        .animate({top: 0}, {duration: this.transitionDuration});

                    return endSlide;
                },
                fadeIn: function(startSlide, endSlide) {
                    this.slides.css({'z-index': -1});       // move all other slides behind the two in transition 

                    startSlide
                        .stop()
                        .css({left: 0, 'z-index': 0});            

                    endSlide
                        .stop()
                        .fadeOut({duration: 0})
                        .css({left: 0, 'z-index': 1})
                        .fadeIn({duration: this.transitionDuration});

                    return endSlide;
                }
            }
        }

        bannerCarousel.init(container);
        return bannerCarousel;
    }

    // create a banner carousel object for each element with data-banner=carousel
    var bannerCarousels = $('*').filter(function(){return $(this).data('banner') == 'carousel';});
    bannerCarousels.each(function(index){
        BannerCarouselFactory(this);
    })

    // extend jquery so that an element can be made into a carousel
    // eg: $('#banner').bannerCarousel();
    jQuery.fn.extend({
        bannerCarousel: function (options) {
            return BannerCarouselFactory(this);
        }
    });

});