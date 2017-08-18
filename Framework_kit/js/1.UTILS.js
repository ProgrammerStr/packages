var UTILS = (function (window, document, Private, Public) {

    'use strict';

    return {
        configuration : {
            NAME   : 'UTILS',
            ENGAGE : true
        },
        maxLimit    : function (config) {

            /*
            ** VALIDANDO LIMITE MAXIMO
            *******/

            var field           = this,
                event           = window.event,
                fieldKeyCode    = (event ? (event.keyCode || event.which) : 0),
                fieldValue      = (config.value || null),
                fieldMax        = (config.max || null),
                fieldLength     = 0;

            fieldValue  = !field.value  ? fieldValue    : field.value;
            fieldMax    = !field.max    ? parseInt(fieldMax, 10)      : parseInt(field.max, 10);

            if (!config.hasOwnProperty('value')) {

                if (event.type === 'paste') {

                    field       = event.clipboardData || window.clipboardData;
                    fieldValue  = field.getData('Text');
                }

                if (event.target.selectionStart < event.target.selectionEnd && event.target.selectionEnd > 0) {

                    if (event.type === 'keypress') {

                        fieldValue = event.target.value.substring(0, event.target.selectionStart) +
                                        String.fromCharCode(fieldKeyCode) +
                                            event.target.value.substring(event.target.selectionEnd, fieldMax);
                    } else if (event.type === 'paste') {

                        fieldValue = event.target.value.substring(0, event.target.selectionStart) +
                                        fieldValue +
                                            event.target.value.substring(event.target.selectionEnd, fieldMax);
                    }
                }
            }

            if (fieldKeyCode !== 8) {

                fieldLength = fieldValue ? fieldValue.length : 0;

                if (!config.hasOwnProperty('value')) {

                    if (fieldLength >= fieldMax) {

                        field       = event.target;
                        field.value = fieldValue.substring(0, fieldMax);

                        return event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    }
                } else {

                    if (fieldLength > fieldMax) {

                        return true;
                    }

                    return false;
                }
            }
        },
        minLimit    : function (config) {

            /*
            ** VALIDANDO LIMITE MINIMO
            *******/

            var fieldValue  = (config.value || null),
                fieldMin    = (parseInt(config.min, 10) || null),
                fieldLength = (fieldValue ? fieldValue.length : 0);

            if (fieldLength < fieldMin) {

                return true;
            }

            return false;
        },
        numericType : function (config) {

            /*
            ** VALIDANDO NUMERICOS
            *******/

            var field           = this,
                event           = window.event,
                fieldKeyCode    = (event ? (event.keyCode || event.which) : 0),
                fieldValue      = (config.value || null),
                pattern         = /([\d|.|,|\)|\(|\-|\/]+)+/;

            fieldValue  = !field.value ? fieldValue : field.value;

            if (!config.hasOwnProperty('value')) {

                if (event.type === 'paste') {

                    field       = event.clipboardData || window.clipboardData;
                    fieldValue  = field.getData('Text');
                }

                fieldValue = String.fromCharCode(fieldKeyCode);
            }

            if (fieldKeyCode !== 8) {

                if (!config.hasOwnProperty('value')) {

                    if (!pattern.test(fieldValue)) {

                        return event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    }
                } else {

                    if (!pattern.test(fieldValue)) {

                        return false;
                    }

                    return true;
                }
            }
        },
        emailType   : function (config) {

            /*
            ** VALIDANDO EMAIL
            *******/

            var fieldValue  = (config.value || null),
                pattern     = /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

            return pattern.test(fieldValue)
        },
        dateType    : function (config) {

            /*
            ** VALIDANDO DATA
            *******/

            var fieldValue  = (config.value || null),
                pattern     = /^((?:0?[0-9])|(?:[1-2][0-9])|(?:3[01]))\/((?:0?[0-9])|(?:1[0-2]))\/([0-9]{4})?$/i;

            return pattern.test(fieldValue)
        },
        cpfType     : function (config) {

            /*
            ** VALIDANDO CPF
            *******/

            var value   = (config.value || null),
                cpf     = value.replace(/[.|\-]/g, ''),
                numbers,
                digits,
                sum,
                i,
                result,
                digits_equals = 1;

            if (cpf.length < 11) {

                return false;
            }

            for (i = 0; i < cpf.length - 1; i = i + 1) {

                if (cpf.charAt(i) !== cpf.charAt(i + 1)) {

                    digits_equals = 0;

                    break;
                }
            }

            if (!digits_equals) {

                numbers = cpf.substring(0, 9);
                digits  = cpf.substring(9);
                sum     = 0;

                for (i = 10; i > 1; i = i - 1) {

                    sum += numbers.charAt(10 - i) * i;
                }

                result = sum % 11 < 2 ? 0 : 11 - sum % 11;

                if (parseInt(result, 10) !== parseInt(digits.charAt(0), 10)) {

                    return false;
                }

                numbers = cpf.substring(0, 10);
                sum = 0;

                for (i = 11; i > 1; i = i - 1) {
                    sum += numbers.charAt(11 - i) * i;
                }

                result = sum % 11 < 2 ? 0 : 11 - sum % 11;

                if (parseInt(result, 10) !== parseInt(digits.charAt(1), 10)) {

                    return false;
                }

                return true;
            }

            return false;
        },
        serialize   : function (config) {

            /*
            ** SERIALIZE DE FORMULARIO
            ******/

            var form        = (config.form        || null),
                json        = (config.json        || null),
                stringify   = (config.stringify   || null),

                formFields  = [],

                fieldName   = null,
                fieldValue  = null,

                dataObject  = {},
                dataString  = '';

            return {
                init : function () {

                    form = document.getElementById(form);

                    if (!form || form.nodeName !== "FORM") {

                        return;
                    }

                    formFields = form.elements;

                    for(var index = 0; index <= formFields.length; index++) {

                        if (formFields[index]) {

                            if (formFields[index].name) {

                                if (formFields[index].nodeName === 'INPUT' || formFields[index].nodeName === 'TEXTAREA' || formFields[index].nodeName === 'SELECT') {

                                    if (formFields[index].type !== 'submit' && formFields[index].type !== 'reset' && formFields[index].type !== 'button') {

                                        if (formFields[index].type === 'checkbox' || formFields[index].type === 'radio') {

                                            if (!formFields[index].checked) {

                                                continue;
                                            }
                                        }

                                        fieldName  = formFields[index].name;
                                        fieldValue = json ? formFields[index].value : encodeURIComponent(formFields[index].value);

                                        if (json) {

                                            dataObject[fieldName] = fieldValue;
                                        } else {

                                            dataString += fieldName + '=' + fieldValue;

                                            if (index < (formFields.length - 1)) {

                                                dataString += '&';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (json) {

                        if (stringify) {

                            return JSON.stringify(dataObject);
                        }

                        return dataObject;
                    } else {

                        return dataString;
                    }
                }
            }.init();
        },
        testRealFormat : function () {

            console.log('(\d{1,3}(\,|\.)\d{1,3})+$');
        },
        toDecimal   : function (value) {

            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        },
        navigator   : function () {

            var browser = null,
                ie      = false;

            if (navigator.appName === 'Netscape') {

                if (navigator.appVersion.indexOf('Edge/') > -1) {

                    browser = 'edge';
                    ie      = true;
                } else if (navigator.appVersion.indexOf('Chrome/') > -1) {

                    browser = 'chrome';
                } else if (navigator.appVersion.indexOf('rv:11.') > -1) {

                    browser = 'ie_11';
                    ie      = true;
                } else {

                    browser = 'firefox';
                }
            } else {

                if (navigator.appVersion.indexOf('MSIE 10.') > -1) {

                    browser = 'ie_10';
                    ie      = true;
                } else if (navigator.appVersion.indexOf('MSIE 9.') > -1) {

                    browser = 'ie_9';
                    ie      = true;
                } else if (navigator.appVersion.indexOf('MSIE 8.') > -1) {

                    browser = 'ie_8';
                    ie      = true;
                } else if (navigator.appVersion.indexOf('MSIE 7.') > -1) {

                    browser = 'ie_7';
                    ie      = true;
                } else {

                    browser = 'outer';
                    ie      = true;
                }
            }

            return {
                ie      : ie,
                browser : browser
            };
        },
        forcePlaceholder : function () {

            var forms           = document.forms,
                fields          = null,
                placeholder     = null,
                keyCode         = null,
                range           = null,
                length          = null,
                arrType         = [
                    'tel',
                    'text',
                    'email',
                    'search'
                ],
                fieldsReference = [],
                navigator       = this.navigator(),
                self            = null;

            if (navigator.ie) {

                if (navigator.browser === 'ie_9' || navigator.browser === 'ie_8' || navigator.browser === 'ie_7') {

                    return {

                        init        : function () {

                            self = this;

                            if (forms) {

                                self.instance();
                                self.events();
                            }
                        },
                        instance    : function () {

                            for (var count = 0; count < forms.length; count++) {

                                fields = forms[count].getElementsByTagName('input');

                                for (var index in fields) {

                                    if (fields[index].nodeType === 1) {

                                        if (fields[index].nodeName === 'INPUT') {

                                            if (arrType.indexOf(fields[index].type) > 0) {

                                                placeholder = fields[index].getAttribute('placeholder');

                                                if (placeholder) {

                                                    fields[index].value = placeholder;

                                                    fieldsReference[index] = fields[index];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        events      : function () {

                            if (fieldsReference) {

                                for (var index in fieldsReference) {

                                    if (typeof fieldsReference[index] === 'object') {

                                        fieldsReference[index].addEventListener('keydown', self.keydown, false);
                                        fieldsReference[index].addEventListener('focus', self.focus, false);
                                    }
                                }
                            }
                        },
                        keydown : function (event) {

                            event   = event || window.event;

                            keyCode = event.which || event.keyCode;

                            event   = event.target || event.srcElement;

                            length  = event.value.length;
                            length  = keyCode === 8 ? (length - 1) : (length + 1);

                            placeholder = event.getAttribute('placeholder');

                            if (event.value === placeholder && (keyCode !== 8 && keyCode !== 17)) {

                                event.value = '';
                            } else if (length <= 0) {

                                event.value = placeholder;

                                self.setCursorPosition(event, 0, 0);

                                return event.preventDefault ? event.preventDefault() : event.returnValue = false;
                            }
                        },
                        focus   : function (event) {

                            event = event.target || event.srcElement;

                            placeholder = event.getAttribute('placeholder');

                            if (event.value === placeholder) {

                                self.setCursorPosition(event, 0, 0);
                            }
                        },
                        setCursorPosition : function (element, start, end) {

                            if (element.setSelectionRange) {

                                element.focus();
                                element.setSelectionRange(start, end);
                            } else if (element.createTextRange) {

                                range = element.createTextRange();

                                range.collapse(true);
                                range.moveEnd('character', end);
                                range.moveStart('character', start);
                                range.select();
                            }
                        }
                    }.init();
                }
            }
        },
        countDown   : function () {

            /*
            ** CONTADOR REGRESSIVO
            *******/

            var finalDate       = arguments[0].finalDate || null,
                result          = {},

                arrWeekDay      = [
                    'Domingo',
                    'Segunda',
                    'Terça',
                    'Quarta',
                    'Quinta',
                    'Sexta',
                    'Sábado'
                ],
                patternDate     = /^([\d]{2})\/([\d]{2})\/([\d]{4})[\s]?(.*)$/,
                date            = null,
                weekDay         = null,

                week            = null,
                day             = null,
                month           = null,
                year            = null,

                timestamp       = null,

                time            = null,
                days            = null,
                hours           = null,
                minutes         = null,
                seconds         = null,
                milliseconds    = null,

                actualDate      = null,
                actualHour      = null,

                newDate         = null;

            return {

                init : function () {

                    this.date();

                    return result;
                },
                date : function () {

                    /*
                    ** CALCULANDO DIAS RESTANTES
                    *******/
                    if (patternDate.test(finalDate)) {

                        finalDate = finalDate.replace(patternDate, '$3/$2/$1 $4');
                    }

                    actualDate      = new Date();
                    finalDate       = new Date(finalDate);

                    newDate         = (finalDate.getTime() - actualDate.getTime()) / 1000;

                    week            = Math.floor(newDate / 604800);
                    days            = Math.floor(newDate / 86400);
                    hours           = Math.floor(newDate / 3600) % 24;
                    minutes         = Math.floor(newDate / 60) % 60;
                    seconds         = Math.floor(newDate) % 60;
                    milliseconds    = newDate.toFixed(2).replace(/([^\.]*\.)/, '');
                    milliseconds    = parseInt(milliseconds, 10);

                    weekDay         = arrWeekDay[finalDate.getDay()];
                    weekDay         = (days <= 0 && actualDate.getDay() === finalDate.getDay()) ? 'Hoje' : weekDay;

                    finalDate.setHours(finalDate.getHours() + Math.round(finalDate.getMinutes() / 60));
                    finalDate.setMinutes(0);

                    if (week > 0 || days > 0 || hours > 0 || minutes > 0 || seconds > 0) {

                        result = {
                            weekDay         : weekDay,
                            lastHours       : finalDate.getHours(),
                            week            : {
                                string : (week < 10 ? '0' + week : week).toString(),
                                int    : (week > 0  ? week       : 0)
                            },
                            days            : {
                                string : (days < 10 ? '0' + days : days).toString(),
                                int    : (days > 0  ? days       : 0)
                            },
                            hours           : {
                                string : (hours < 10 ? '0' + hours : hours).toString(),
                                int    : (hours > 0  ? hours       : 0)
                            },
                            minutes         : {
                                string : (minutes < 10 ? '0' + minutes : minutes).toString(),
                                int    : (minutes > 0  ? minutes       : 0)
                            },
                            seconds         : {
                                string : (seconds < 10 ? '0' + seconds : seconds).toString(),
                                int    : (seconds > 0  ? seconds       : 0)
                            },
                            milliseconds    : {
                                string : (milliseconds < 10 ? '0' + milliseconds : milliseconds).toString(),
                                int    : (milliseconds > 0  ? milliseconds       : 0)
                            }
                        };
                    } else {

                        result = false;
                    }

                    return this;
                }
            }.init();
        }
    };

    /*
    ** MASCARA SEM JQUERY
    *******/
    // Public.mask                 = function () {

    //     return {

    //         pattern1     : /[\d]+/g,
    //         pattern2     : /[\W]+/g,
    //         pattern3     : /(\W|\d+)/g,

    //         arrPattern   : [],
    //         arrReplace   : [],

    //         newPattern   : '',
    //         newReplace   : '',

    //         params         : event ? event.target.params : arguments[0],

    //         fieldMask      : null,
    //         maskLength     : null,

    //         characters     : null,
    //         charsLength    : 0,

    //         selectionStart : null,
    //         selectionEnd   : null,

    //         countReplace   : 1,
    //         field          : null,
    //         fieldKeyCode   : null,
    //         fieldValue     : null,
    //         regex          : null,

    //         init       : function () {

    //             /*
    //             ** RECUPERANDO DADOS DA MASCARA
    //             *******/
    //             this.fieldMask  = this.params.mask;
    //             this.maskLength = this.fieldMask.length;
    //             this.characters = this.fieldMask.match(this.pattern3);

    //             /*
    //             ** IDENTIFICANDO ELEMENTO
    //             *******/
    //             this.field = document.getElementById(this.params.id) || document.getElementsByClassName(this.params.id)[0];

    //             /*
    //             ** ADICIONANDO EVENTO AO CAMPO
    //             *******/
    //             this.field.addEventListener('keypress', this.keypress, false);
    //             this.field.addEventListener('paste', this.paste, false);
    //             this.field.self = this;

    //             return this;
    //         },
    //         mask       : function () {

    //             /*
    //             ** GERANDO NOVO REGEXP
    //             *******/
    //             for(var chars in this.characters) {

    //                 this.regex = new RegExp(this.pattern1);

    //                 if (this.regex.test(this.characters[chars])) {

    //                     this.charsLength = this.characters[chars].length;

    //                     this.arrPattern[chars] = (chars <= 0 ? '^' : '') + '([\\d]{' + this.charsLength  + '})';

    //                     this.arrReplace[chars] = '$' + this.countReplace;

    //                     this.countReplace++;
    //                 }

    //                 this.regex = new RegExp(this.pattern2);

    //                 if (this.regex.test(this.characters[chars])) {

    //                     this.arrPattern[chars] = (chars <= 0 ? '^' : '') + '\\' + this.characters[chars].toString().replace(/\s/, '\s') + '?';
    //                     this.arrReplace[chars] = this.characters[chars];
    //                 }
    //             }

    //             /*
    //             ** VALIDANDO DADOS DO CAMPO
    //             *******/
    //             for(var pattern in this.arrPattern) {

    //                 if (!isNaN(pattern)) {

    //                     this.newPattern += this.arrPattern[pattern];
    //                     this.newReplace += this.arrReplace[pattern];

    //                     this.regex = new RegExp(this.newPattern, 'gi');

    //                     if (this.regex.test(this.fieldValue)) {

    //                         this.field.value = this.fieldValue.replace(this.regex, this.newReplace);
    //                     }
    //                 }
    //             }

    //             this.newPattern   = '';
    //             this.newReplace   = '';
    //             this.countReplace = 1;

    //             return this;
    //         },
    //         keypress   : function () {

    //             var self  = this.self,
    //                 start = this.selectionStart,
    //                 end   = this.selectionEnd;

    //             self.fieldValue   = this.value.replace(this.pattern2, '');
    //             self.fieldKeyCode = event.keyCode ? event.keyCode : event.which;

    //             if (self.fieldKeyCode === 8 || event.ctrlKey) {

    //                 return false;
    //             }

    //             if (self.fieldValue.length >= self.maskLength) {

    //                 return event.preventDefault ? event.preventDefault() : event.returnValue = false;
    //             }

    //             if (this.selectionStart < self.fieldValue.length) {

    //                 self.fieldValue = self.fieldValue.substring(0, end) +
    //                                     String.fromCharCode(self.fieldKeyCode) +
    //                                         self.fieldValue.substring(start, self.fieldValue.length);

    //                 return event.preventDefault ? event.preventDefault() : event.returnValue = false;

    //                 //this.setSelectionRange(self.selectionStart, self.selectionEnd);
    //             }

    //             self.mask();

    //             return this;
    //         },
    //         paste      : function () {

    //             var fieldSelf = this,
    //                 self      = this.self;

    //             setTimeout(function () {

    //                 self.fieldValue = fieldSelf.value.substr(0, self.fieldMask.replace(/[\W]/g, '').length);

    //                 self.mask();

    //             }, 100);

    //             return this;
    //         }
    //     }.init();
    // };

    /*
    ** RECUPERANDO PARAMETROS DA URL
    *******/
    // Public.getParam             = function (config) {

    //     var paramters       = window.location.search.substring(1),
    //         paramtersArray  = paramters.split('&'),
    //         param           = config ? config.param : null,
    //         type            = config ? config.type : null,
    //         keys            = null,
    //         values          = null,
    //         response        = config ? {} : paramters;

    //     if (config) {

    //         for (var index in paramtersArray) {

    //             values  = paramtersArray[index].split('=');

    //             if (response.hasOwnProperty(values[0])) {

    //                 response[values[0]] = typeof response[values[0]] === 'object' ? response[values[0]] : [response[values[0]]];
    //                 response[values[0]].push(values[1]);
    //             } else {

    //                 response[values[0]] = values[1];
    //             }
    //         }

    //         if (param !== '' && param !== null && param !== undefined) {

    //             return response[param] || false;
    //         }

    //         if (type === 'string') {

    //             return paramters || false;
    //         }
    //     }

    //     return response;
    // };

}(window, document, {}, {}));