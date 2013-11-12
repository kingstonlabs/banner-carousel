var BannerCarousel = function(container) {
    this.itemSelector = '.banner-item';

    this.container = $(container);
    this.slides = this.container.find(this.itemSelector);
    this.currentSlide = this.slides.first();

    this.interval = this.utilities.getInterval();
    this.transitionDuration = this.utilities.getTransitionDuration();
    this.transitionFunction = this.utilities.getTransitionFunction();  

    this.animate = this.utilities.animate();

    transitions = {                
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

    utilities = {
        getInterval: function() {
            var interval = this.container.data('interval');
            if (interval == undefined) {
                return 4000;
            }
            return interval;
        },

        getTransitionDuration: function() {
            var transitionDuration = this.container.data('transitionDuration');
            if (transitionDuration == undefined) {
                return 2000;
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
                // proxy maintains this as context
                window.setInterval($.proxy(this.utilities.goToNextSlide, this), this.interval + this.transitionDuration);
            }
        },

        goToNextSlide: function() {    
            var newSlide = this.getNextSlide();        
            this.utilities.transitionInToSlide(newSlide);        
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
            this.utilities.transitionInToSlide(newSlide, -1);        
        },

        getPreviousSlide: function() {
            previousSlide = this.currentSlide.prev();
            if (previousSlide.length == 0) {
                previousSlide = this.slides.last();
            }
            return previousSlide;
        },

        transitionInToSlide: function(slide, direction) {
            // only go to slide if animation isn't already running
            if (!slide.is(':animated')) {            
                this.currentSlide = this.transitionFunction(this.currentSlide, slide, direction);
            }
        }
    }
}

banners = []

$('.banner').each(function(index){
    banners[index] = new BannerCarousel(this);
})

//bannerCarousel.init()
