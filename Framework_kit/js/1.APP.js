var APP = (function () {

    'use strict';

    var self = null;

    return {

        Init        : function (config) {

            self = this;

            self.Prototype();

            var id      = null,
                modules = self.Modules;

            for (var module in modules) {

                // try {

                    if (typeof modules[module] === 'object') {

                        if (!modules[module].configuration.ENGAGE) {

                            delete modules[module];

                            continue;
                        }

                        if (typeof modules[module].configuration.ID === 'object') {

                            for (var index in modules[module].configuration.ID) {

                                id = (/^#{1}/).test(modules[module].configuration.ID[index]) ? modules[module].configuration.ID[index].replace('#', '') : modules[module].configuration.ID[index];

                                if (document.body.id === id || id === 'General') {

                                    modules[module].init();
                                }
                            }
                        } else {

                            id = (/^#{1}/).test(modules[module].configuration.ID) ? modules[module].configuration.ID.replace('#', '') : modules[module].configuration.ID;

                            if (document.body.id === id || id === 'General') {

                                modules[module].init();
                            }
                        }
                    }
                // } catch (err) {

                //     console.log(err.stack);
                // }
            }
        },
        Debug       : function (debug) {

            if (!debug) {

                window.console.log = function () {

                    return false;
                };
            }
        },
        Prototype   : function () {

            try {

                if (!window.Element ) {

                    window.Element = function() {};
                };

                if (!Array.prototype.indexOf) {

                    Array.prototype.indexOf = function(obj, start) {

                        for (var i = (start || 0), j = this.length; i < j; i++) {

                            if (this[i] === obj) {

                                return i;
                            }
                        }

                        return -1;
                    };
                }

                if (!Element.prototype.addEventListener) {

                    Element.prototype.addEventListener = function (event, method) {

                        this['on' + event] = method;

                        return this['on' + event];
                    };
                }

                if (!document.getElementsByClassName) {

                    document.getElementsByClassName = function (element) {

                        return this.querySelectorAll('.' + element);
                    };
                }

                if (!Object.assign) {

                    Object.prototype.assign = function (obj1, obj2) {

                        for (var index in obj2) {

                            obj1[index] = obj2[index];
                        }
                    };
                }

                if (!Element.classList) {

                    var regExp = function(name) {
                        return new RegExp('(^| )'+ name +'( |$)');
                    };
                    var forEach = function(list, fn, scope) {
                        for (var i = 0; i < list.length; i++) {
                            fn.call(scope, list[i]);
                        }
                    };

                    var ClassList = function (element) {
                        this.element = element;
                    };

                    ClassList.prototype = {
                        add: function() {
                            forEach(arguments, function(name) {
                                if (!this.contains(name)) {
                                    this.element.className += this.element.className.length > 0 ? ' ' + name : name;
                                }
                            }, this);
                        },
                        remove: function() {
                            forEach(arguments, function(name) {
                                this.element.className =
                                    this.element.className.replace(regExp(name), '');
                            }, this);
                        },
                        toggle: function(name) {
                            return this.contains(name)
                                ? (this.remove(name), false) : (this.add(name), true);
                        },
                        contains: function(name) {
                            return regExp(name).test(this.element.className);
                        },
                        // bonus..
                        replace: function(oldName, newName) {
                            this.remove(oldName), this.add(newName);
                        }
                    };

                    // IE8/9, Safari
                    if (!('classList' in Element.prototype)) {
                        Object.defineProperty(Element.prototype, 'classList', {
                            get: function() {
                                return new ClassList(this);
                            }
                        });
                    }

                    // replace() support for others
                    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
                        DOMTokenList.prototype.replace = ClassList.prototype.replace;
                    }
                }
            } catch (err) {

                console.log(err);
            }

        },
        Modules     : {}
    };

}());