/**
 * Available for use under the MIT License (http://en.wikipedia.org/wiki/MIT_License)
 * 
 * Copyright (c) 2017 by Adam Banaszkiewicz
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @version 0.0.1
 * @date    2017.09.13
 * @author  Adam Banaszkiewicz
 */

(function ($, w) {
    var FixedDropdown = function (element, options) {
        this.element = element;
        this.options = options;
        this.dropdown;

        this.init = function () {
            this.options = $.extend({}, FixedDropdown.Defaults, this.options);

            this.dropdown = this.findDropdown();
            this.dropdown.appendTo('body');

            this.bindEvents();
            this.hide();
        };

        this.bindEvents = function () {
            var self = this;

            this.element.click(function (e) {
                var that = this;

                e.stopPropagation();

                $('body').trigger('fixeddropdown:closeall', {
                    target: $(that)
                });

                if(self.dropdown.hasClass(self.options.classShowed))
                    self.hide();
                else
                    self.show();
            });

            this.dropdown.click(function(e) {
                e.stopPropagation();
            });

            $('body').on('fixeddropdown:closeall', function (e, p) {
                self.hide();
            });
        };

        this.findDropdown = function () {
            var attrSelector = this.element.attr('data-dropdown');

            if(attrSelector)
                return $(attrSelector);

            return this.element.parent().find('> .dropdown-menu');
        };

        this.show = function () {
            this.dropdown
                .css({
                    left:0,
                    top:0
                })
                .removeClass(this.options.classHidden)
                .addClass(this.options.classShowed);

            this.updateDropdownPosition();

            return this;
        };

        this.hide = function () {
            this.dropdown
                .removeClass(this.options.classShowed)
                .addClass(this.options.classHidden);

            return this;
        };

        this.updateDropdownPosition = function () {
            var ep = this.getElementDetails();
            var position = {
                left: ep.offsetLeft,
                top:  ep.offsetTop + this.element.outerHeight(),
            };

            if(position.left + this.dropdown.outerWidth() > $(window).outerWidth())
                position.left = ep.offsetLeft - this.dropdown.outerWidth() + ep.width;

            this.dropdown.css(position);
        };

        this.getElementDetails = function () {
            return {
                height:     this.element.outerHeight(),
                width:      this.element.outerWidth(),
                offsetTop:  this.element.offset().top,
                offsetLeft: this.element.offset().left
            };
        };
    };

    FixedDropdown.Defaults = {
        classHidden: 'fixeddropdown-hidden',
        classShowed: 'fixeddropdown-showed'
    };

    $('body').click(function () {
        $(this).trigger('fixeddropdown:closeall', {
            target: $(this)
        });
    });

    w.FixedDropdown = FixedDropdown;

    $.fn.fixedDropdown = function(options) {
        this.each(function () {
            (new FixedDropdown($(this), options)).init();
        });

        return this;
    };
})(jQuery, window);
