var StarRating = function(element, options) {
    options = options || {};
    this.element = element;
    this.options = options;
    this.active = this.element.querySelector('.active');
    this.rating = this.options.initialRating ? this.options.initialRating : 0;
    this.starClass = this.options.starClass ? this.options.starClass : 'star';
    this.message = '';
    if (this.options.messageHelperSelector) {
        this.messageHelper = this.element.querySelector(this.options.messageHelperSelector);
    }
    if (this.messageHelper) {
        this.message = this.getData(this.messageHelper, 'text');
    }
    this.init();
};
StarRating.prototype = {
    init: function() {
        this.setRating(this.rating);
        this.setUpListeners();
    },
    setUpListeners: function() {
        var t = this;
        function remove(e) {
            if (t.active) {
                t.active.classList.remove('active');
            }
            t.updateMessage(t.getData(e.target, 'text'));
        }
        function add(e) {
            if (t.active) {
                t.active.classList.add('active');
            }
            t.updateMessage(t.message);
        }
        this.element.querySelectorAll("." + this.starClass).forEach(function(element) {
            element.addEventListener('mouseenter', remove);
            element.addEventListener('mouseleave', add);
        });
        this.element.addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.classList.contains("star")) {
                t.setActive(e.target)
            }
        })
    },
    setActive: function(element) {
        if (this.active) {
            this.active.classList.remove('active');
        }
        element.classList.add('active');
        this.active = element;
        this.setMessage(this.getData(this.active, 'text'));
        this.updateRating(Number(this.getData(this.active, 'value')));
        this.saveRating();
    },
    updateRating: function(value) {
        this.rating = value
    },
    setRating: function(value) {
        var t = this;
        if (value > 0) {
            this.element.querySelectorAll("." + this.starClass).forEach(function(element) {
                if (parseInt(t.getData(element, 'value')) === value) {
                    t.setActive(element)
                }
            });
            this.setMessage(this.getData(this.active, "text"));
        }else {
            this.updateRating(value);
            this.saveRating();
        }
    },
    saveRating: function(target) {
        var input;
        if (target) {
            input = document.querySelector(target);
        }
        else {
            input = this.element.querySelector('input');
        }
        if (input) {
            input.value = this.rating.toString();
            this.rating > 0 ? input.checked = true : input.checked = false
        }
    },
    setMessage: function(message) {
        this.message = message;
        this.updateMessage(this.message);
    },
    updateMessage: function(message) {
        if (this.messageHelper) {
            this.messageHelper.innerHTML = message;
        }
    },
    reset: function(resetTo){
        resetTo = (resetTo || 0);
        if (this.active) {
            this.active.classList.remove('active');
            this.active = null;
        }
        if (this.messageHelper) {
            this.setMessage(this.getData(this.messageHelper, "text"));
        }

        this.setRating(resetTo);
    },
    getData: function(element, name) {
        return element.dataset ? element.dataset[name] : element.getAttribute('data-' + name)
    },
    setData: function(element, name, value) {
        element.dataset ? element.dataset[name] = value : element.setAttribute('data-' + name, value)
    }
};


+function($) {
    "use strict";
    function Plugin($option) {
        return this.each(function() {
            var self = $(this);
            var data = self.data("starRating");
            var options = $.extend({}, self.data(), typeof $option == "object" && $option);
            if (!data) {
                self.data("starRating", (data = new StarRating(this,options)));
            }
        });
    }
    var old = $.fn.starRating;
    $.fn.starRating = Plugin;
    $.fn.starRating.Constructor = StarRating;
    $.fn.starRating.noConflict = function() {
        $.fn.starRating = old;
        return this;
    }
    ;
    $(window).on('load.starRating.data-api', function() {
        $('[data-rating-component]').each(function() {
            var rating = $(this);
            Plugin.call(rating, rating.data())
        })
    })
}(jQuery);
