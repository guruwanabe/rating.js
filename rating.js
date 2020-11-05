var StarRating = function(element, options) {
    options = options || {};
    this.element = element;
    this.options = options;
    this.active = this.element.querySelector('.active');
    this.messageHelper = this.element.querySelector('[data-rating-helper]');
    this.rating = 0;
    this.message = '';
    this.init();
};
StarRating.prototype = {
    init: function() {
        this.updateRating();
        this.saveRating();
        this.setUpListeners();
        this.setRating(this.options.rating ? this.options.rating : 0);
    },
    setUpListeners: function() {
        var t = this;
        function remove(e) {
            if (t.active) {
                t.active.classList.remove('active');
            }
            t.updateMessage(t.getData(e.target, 'text'));
        }
        function add() {
            if (t.active) {
                t.active.classList.add('active');
            }
            t.updateMessage(t.message);
        }
        this.element.querySelectorAll('.star').forEach(function(element) {
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
        this.updateRating();
        this.saveRating();
    },
    updateRating: function() {
        if (this.active) {
            this.rating = this.getData(this.active, 'value')
        }
    },
    setRating: function(value) {
        var t = this;
        if (value > 0) {
            this.element.querySelectorAll('.star').forEach(function(element) {
                if (parseInt(t.getData(element, 'value')) === value) {
                    t.setActive(element)
                }
            });
            this.rating = value;
            this.setMessage(this.getData(this.active, "text"));
            this.saveRating()
        }
    },
    saveRating: function() {
        this.element.querySelector('input').value = this.rating
    },
    setMessage: function(message) {
        this.message = message;
        this.updateMessage(this.message);
    },
    updateMessage: function(message) {
        this.messageHelper.innerHTML = message
    },
    reset: function(resetTo) {
        resetTo = resetTo || 0,
        this.active && (this.active.classList.remove("active"),
        this.active = null),
        this.setRating(resetTo),
        this.setMessage(this.messageHelper && this.getData(this.messageHelper, "text"))
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
