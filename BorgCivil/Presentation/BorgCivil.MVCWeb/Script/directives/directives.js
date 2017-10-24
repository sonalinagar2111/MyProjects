/**
 * 
 * Copyright 2015 Webapplayers.com
 *
 */

angular
    .module('borgcivil')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('minimalizaMenu', minimalizaMenu)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('panelTools', panelTools)
    .directive('panelToolsFullscreen', panelToolsFullscreen)
    .directive('smallHeader', smallHeader)
    .directive('animatePanel', animatePanel)
    .directive('landingScrollspy', landingScrollspy)
    .directive('clockPicker', clockPicker)
    .directive('dateTimePicker', dateTimePicker)
    .directive('confirmEndTime', confirmEndTime)
    .directive('checkRoute', checkRoute)
    .directive('disallowSpaces', disallowSpaces);


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'Borg Civil | AngularJS Responsive WebApp';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Borg Civil | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            element.metisMenu();

            // Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function () {

                if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                }
            });


        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaMenu($rootScope) {
    return {
        restrict: 'EA',
        template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
        controller: function ($scope, $element) {

            $scope.minimalize = function () {
                if ($(window).width() < 769) {
                    $("body").toggleClass("show-sidebar");
                } else {
                    $("body").toggleClass("hide-sidebar");
                }
            }
        }
    };
};


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function () {
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function (newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}


/**
 * panelTools - Directive for panel tools elements in right corner of panel
 */
function panelTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            },

            // Function for close ibox
            $scope.closebox = function () {
                var hpanel = $element.closest('div.hpanel');
                hpanel.remove();
            }

        }
    };
};

/**
 * panelToolsFullscreen - Directive for panel tools elements in right corner of panel with fullscreen option
 */
function panelToolsFullscreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/panel_tools_fullscreen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                var body = hpanel.find('div.panel-body');
                var footer = hpanel.find('div.panel-footer');
                body.slideToggle(300);
                footer.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                hpanel.toggleClass('').toggleClass('panel-collapse');
                $timeout(function () {
                    hpanel.resize();
                    hpanel.find('[id^=map-]').resize();
                }, 50);
            };

            // Function for close ibox
            $scope.closebox = function () {
                var hpanel = $element.closest('div.hpanel');
                hpanel.remove();
                if ($('body').hasClass('fullscreen-panel-mode')) { $('body').removeClass('fullscreen-panel-mode'); }
            };

            // Function for fullscreen
            $scope.fullscreen = function () {
                var hpanel = $element.closest('div.hpanel');
                var icon = $element.find('i:first');
                $('body').toggleClass('fullscreen-panel-mode');
                icon.toggleClass('fa-expand').toggleClass('fa-compress');
                hpanel.toggleClass('fullscreen');
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 100);
            }

        }
    };
};

/**
 * smallHeader - Directive for page title panel
 */
function smallHeader() {
    return {
        restrict: 'A',
        scope: true,
        controller: function ($scope, $element) {
            $scope.small = function () {
                var icon = $element.find('i:first');
                var breadcrumb = $element.find('#hbreadcrumb');
                $element.toggleClass('small-header');
                breadcrumb.toggleClass('m-t-lg');
                icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
            }
        }
    }
}

function animatePanel($timeout, $state) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            //Set defaul values for start animation and delay
            var startAnimation = 0;
            var delay = 0.06;   // secunds
            var start = Math.abs(delay) + startAnimation;

            // Store current state where directive was start
            var currentState = $state.current.name;

            // Set default values for attrs
            if (!attrs.effect) { attrs.effect = 'zoomIn' };
            if (attrs.delay) { delay = attrs.delay / 10 } else { delay = 0.06 };
            if (!attrs.child) { attrs.child = '.row > div' } else { attrs.child = "." + attrs.child };

            // Get all visible element and set opactiy to 0
            var panel = element.find(attrs.child);
            panel.addClass('opacity-0');

            // Count render time
            var renderTime = panel.length * delay * 1000 + 700;

            // Wrap to $timeout to execute after ng-repeat
            $timeout(function () {

                // Get all elements and add effect class
                panel = element.find(attrs.child);
                panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

                var panelsCount = panel.length + 10;
                var animateTime = (panelsCount * delay * 10000) / 10;

                // Add delay for each child elements
                panel.each(function (i, elm) {
                    start += delay;
                    var rounded = Math.round(start * 10) / 10;
                    $(elm).css('animation-delay', rounded + 's');
                    // Remove opacity 0 after finish
                    $(elm).removeClass('opacity-0');
                });

                // Clear animation after finish
                $timeout(function () {
                    $('.stagger').css('animation', '');
                    $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
                    panel.resize();
                }, animateTime)

            });



        }
    }
}

function landingScrollspy() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.clockpicker();
        }
    };
};

function dateTimePicker($window) {

    var default_options = { locale: 'en' };
    return {
        require: "?ngModel",
        restrict: "AE",
        scope: {
            datetimepickerOptions: "@"
        },
        link: function ($scope, $element, $attrs, ngModelCtrl) {
            var passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
            var options = jQuery.extend({}, default_options, passed_in_options);
            $element.on("dp.change", function (e) {
                if (ngModelCtrl) {
                    var d = e.target.value;
                    if (d.indexOf('T') > -1) {
                        var gformat = 'dd-MM-yyyy';
                        ngModelCtrl.$setViewValue(moment(e.target.value).format(gformat.toUpperCase() + ' hh:mm A'))
                    } else {
                        ngModelCtrl.$setViewValue(e.target.value)
                    }
                    $element.trigger('blur');
                }
            }).datetimepicker(options);

            $element.on("blur", function (e) {
                if (ngModelCtrl) {
                    ngModelCtrl.$setViewValue(e.target.value)
                }
            });

            function setPickerValue() {
                var date = options.defaultDate || null;
                if (ngModelCtrl && ngModelCtrl.$viewValue) {
                    date = ngModelCtrl.$viewValue
                }
                //ngModelCtrl.$setViewValue(date)
                $element.data("DateTimePicker").date(date)
            }
            if (ngModelCtrl) {
                ngModelCtrl.$render = function () {
                    setPickerValue()
                }
            }
            setPickerValue()
        }
    }
}

function confirmEndTime(defaultErrorMessageResolver) {
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['confirmEndTime'] = 'End time should be greater than to StartTime.';
    });

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            confirmEndTime: '=confirmEndTime'
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.confirmEndTime = function (modelValue) {
                return modelValue < attributes.confirmEndTime;
            };

            scope.$watch('confirmEndTime', function () {
                ngModel.$validate();
            });
        }
    };
}
confirmEndTime.$inject = [
      'defaultErrorMessageResolver'
];

//function dateTimePicker(){
//    return {
//        require: '?ngModel',
//        restrict: 'AE',
//        scope: {
//            pick12HourFormat: '@',
//            language: '@',
//            useCurrent: '@',
//            location: '@'
//        },
//        link: function (scope, elem, attrs) {
//            elem.datetimepicker({
//                pick12HourFormat: scope.pick12HourFormat,
//                language: scope.language,
//                useCurrent: scope.useCurrent
//            })

//            //Local event change
//            elem.on('blur', function () {

//                // For test
//                //console.info('this', this);
//                //console.info('scope', scope);
//                //console.info('attrs', attrs);


//                /*// returns moments.js format object
//                 scope.dateTime = new Date(elem.data("DateTimePicker").getDate().format());
//                 // Global change propagation
//                 $rootScope.$broadcast("emit:dateTimePicker", {
//                 location: scope.location,
//                 action: 'changed',
//                 dateTime: scope.dateTime,
//                 example: scope.useCurrent
//                 });
//                 scope.$apply();*/
//            })
//        }
//    };
//}

/**
 * checkRoute - Directive for check local storage value
 */
function checkRoute($rootScope, $location) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                /*
                 * @def of toState:= {url : '', templateUrl : '', data : {}, name : '' }
                 */
                if (toState.url === "/Login" && typeof localStorage["ACCESS_TOKEN"] !== 'undefined') {

                    $location.path("booking/BookingDashboard");
                } else if (toState.url === "/Login") {

                    delete localStorage["ACCESS_TOKEN"];
                    window.localStorage.clear();
                    localStorage.removeItem('ACCESS_TOKEN');
                }
                else if (toState.url === "/change-password/:Id") {

                }
                else {//plese don't disturb that condition.
                    if (typeof localStorage["ACCESS_TOKEN"] === 'undefined') {
                        $location.path('admin/Login')
                    }
                }
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
}

/**
 * disallowSpaces - Space not alllow on input box
 */
function disallowSpaces() {
    return {
        restrict: 'A',

        link: function ($scope, $element) {
            $element.bind('input', function () {
                $(this).val($(this).val().replace(/ /g, ''));
            });
        }
    };
}