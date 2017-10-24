(function () {
    'use strict';

    /**
     * Tabs Controller
     * Created by: Rahul Yadav (SIPL)
     * Created On: 28-03-2017
     */
    angular
        .module('borgcivil')
        //.controller('JobBookingCtrl', JobBookingCtrl);
        .controller('TabCtrl', TabCtrl)
        .controller('StartDatepickerCtrl', StartDatepickerCtrl)
        .controller('EndDatepickerCtrl', EndDatepickerCtrl)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl)
        .controller('DateTimePickerCtrl', DateTimePickerCtrl)
        .controller('HeaderCtrl', HeaderCtrl);

    //Inject required stuff as parameters to factories controller function
    //LoginCtrl.$inject = ['$scope', 'UtilsFactory', '$location'];
    TabCtrl.$inject = ['$scope', '$window'];

    /**
     * Tab function
     */
    function TabCtrl($scope, $window) {
        $scope.model = {
            name: 'Tabs'
        };
    }

    //StartDatepickerCtrl
    function StartDatepickerCtrl($scope) {


        $scope.open = function () {

        }

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        //$scope.open = function ($event) {
        //    $event.preventDefault();
        //    $event.stopPropagation();

        //    $scope.opened = true;
        //};

        $scope.startDate = function () {
            $scope.popup1.opened = true;
        };

        $scope.endDate = function () {
            $scope.popup2.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };
        $scope.date = new Date(new Date().setFullYear(new Date().getFullYear() + 2));
        $scope.day = ('0' + $scope.date.getDate()).slice(-2);
        $scope.month = ('0' + ($scope.date.getMonth() + 1)).slice(-2);
        $scope.maxDate = $scope.date.getUTCFullYear() + "-" + $scope.month + "-" + $scope.day;
    }

    //EndDatepickerCtrl
    function EndDatepickerCtrl($scope) {
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

    }

    //DateTimePickerCtrl
    function DateTimePickerCtrl($scope) {
        // openCalendar Function 
        $scope.openCalendar = function () {
            $('#dateTime').focus();
        };
    }

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
    // ModalInstanceCtrl for close popup
    function ModalInstanceCtrl($scope, $uibModalInstance) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.ok = function () {
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };

    HeaderCtrl.$inject = ['$scope', '$rootScope', 'BCAFactory', 'BookingCalendarFactory', '$state', '$location', 'CONST', '$filter'];

    // HeaderCtrl for dropdown list
    function HeaderCtrl($scope, $rootScope, BCAFactory, BookingCalendarFactory, $state, $location, CONST, $filter) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.calendarDate = [];
        vm.bookingDateArray = [];
        vm.bookingCalendarList
        vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');

        //method    	
        vm.getAvailablePlantDDL = getAvailablePlantDDL;
        vm.getAvailableFleetRegistrationDDL = getAvailableFleetRegistrationDDL;
        vm.getAvailableDriverDDL = getAvailableDriverDDL;
        vm.getAllBookingByFleetBookingDate = getAllBookingByFleetBookingDate;

        /**
        * @name getAvailablePlantDDL
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAvailablePlantDDL(date) {

            //Call booking factory get all factories data
            BCAFactory
                .getAvailablePlantDDL(date)
                .then(function () {
                    vm.plantRecords = BCAFactory.availableFleetList.DataList;
                });

        }

        //calling the method on load
        vm.getAvailablePlantDDL(vm.date);

        /**
       * @name getAvailablePlantDDL
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function getAvailableFleetRegistrationDDL(date) {

            //Call booking factory get all factories data
            BCAFactory
                .getAvailableFleetRegistrationDDL(date)
                .then(function () {
                    vm.fleetRecords = BCAFactory.availableFleetRegistrationList.DataList;
                });
        }

        //calling the method on load
        vm.getAvailableFleetRegistrationDDL(vm.date);

        /**
        * @name getAvailablePlantDDL
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAvailableDriverDDL(date) {
            var Date = sessionStorage.selectedDate;
            //Call booking factory get all factories data
            BCAFactory
                .getAvailableDriverDDL(date)
                .then(function () {
                    vm.driverRecords = BCAFactory.availableDriverList.DataList;
                });
        }

        //calling the method on load
        vm.getAvailableDriverDDL(vm.date);

        /**
        * @name getAvailablePlantDDL
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAllBookingByFleetBookingDate() {

            //Call booking factory get all factories data
            BookingCalendarFactory
                .getAllDatesHaveBooking()
                .then(function () {
                    vm.bookingCalendarList = BookingCalendarFactory.bookingCalendarList.DataList;
                    vm.count = 0;
                    if (typeof vm.bookingCalendarList != 'undefined' && vm.bookingCalendarList.length > 0) {

                        for (var i = 0; i < vm.bookingCalendarList.length; i++) {

                            vm.bookingCalendarList[i];

                            //Set temporary min-max date
                            vm.min = (new Date(vm.bookingCalendarList[i].StartDate));
                            vm.maxDate = (new Date(vm.bookingCalendarList[i].EndDate));
                            vm.dateExist = false;
                            for (vm.min; vm.min <= vm.maxDate; vm.min.setDate(vm.min.getDate() + 1)) {

                                vm.count++;
                                var bookingDate = JSON.parse(JSON.stringify(vm.min));
                                for (var j = 0; j < vm.bookingDateArray.length; j++) {

                                    var filterStartDate = $filter('date')(vm.bookingDateArray[j].start, 'yyyy-MM-dd');
                                    if (filterStartDate === $filter('date')(bookingDate, 'yyyy-MM-dd')) {
                                        vm.dateExist = true;
                                        //break;
                                    }
                                }
                                if (!vm.dateExist) {
                                    var splitDate = bookingDate.split("T");
                                    var urlDate = splitDate[0];
                                    vm.bookingDateArray.push({
                                        id: vm.count,
                                        title: 'Booking',
                                        start: bookingDate,
                                        overlap: true,
                                        allDay: false,
                                        url: CONST.CONFIG.BASE_URL + '#/booking/BookingList/' + urlDate
                                    });
                                }
                            }
                        }
                    }

                    sessionStorage.bookingDateArray = JSON.stringify(vm.bookingDateArray);

                });
        }

        // select date method calling on click of global datepicker
        vm.selectDate = function () {
            var date = sessionStorage.selectedDate;
            sessionStorage.pickerDate = date;
            //console.log(date);
            vm.getAvailablePlantDDL(date)
            vm.getAvailableFleetRegistrationDDL(date);
            vm.getAvailableDriverDDL(date);
            $rootScope.$on('$stateChangeSuccess',
              function (event, toState, toParams, fromState, fromParams) {
                  $state.current = toState;
              }
            )
            if ($state.current.name === 'booking.BookingDashboard') {
                //console.log(date, $state.current.name);
                $state.go('booking.BookingDashboard', { 'CalendarDate': date });
            }
        }

        //calling the method on load
        vm.getAllBookingByFleetBookingDate();
    };
})();

