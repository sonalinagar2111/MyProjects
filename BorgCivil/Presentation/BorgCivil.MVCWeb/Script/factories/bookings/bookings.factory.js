(function () {
    'use strict';

    /**
     * Associate booking factory, booking  info factory with BCA module
     */
    angular
		.module('borgcivil')
		.factory('WorkAllocationFactory', WorkAllocationFactory)
        .factory('BookingListFactory', BookingListFactory)
        .factory('ManageJobBookingFactory', ManageJobBookingFactory)
        .factory('ManageBookingSiteFactory', ManageBookingSiteFactory)
        .factory('ManageDocketFactory', ManageDocketFactory)
        .factory('BookingDashboardFactory', BookingDashboardFactory)
        .factory('BookingCalendarFactory', BookingCalendarFactory)

    //Inject required modules to factory method
    WorkAllocationFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name WorkAllocationFactory
     * @desc WorkAllocation data
     * @returns {{waStatus: Array, bookingInfo: object}}
     * @constructor
     */
    function WorkAllocationFactory($http, $q, CONST, NotificationFactory) {

        var waObj = {

            bookings: [],
            waStatus: [],
            bookingInfo: [],
            bookingDetail: [],

            /**
             * @name getListing
             * @desc Retrieve bookings listing from db
             * @returns {*}
             */
            getListing: function () {
                //return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllWorkAllocationByTitle/' + 2)
                //    .then(function(response) {
                //        if (response.status == 200 && typeof response.data === 'object') {
                //        	waObj.bookings = response.data; 
                //        }else {
                //            NotificationFactory.error(response.data);
                //        }

                //    }, function(response) {
                //        return $q.reject(response.data);
                //        NotificationFactory.error(false);
                //    });

                return waObj.bookings = [
                {
                    number: "43802",
                    fleet_booking_date_time: "22/02/2017 08:00 AM",
                    fleet_number_description: "Fleet Number: AF18JL Description: HILU05C",
                    customer_name: "2010 Debtors",
                    driver_name: "Paul Cavanagh",
                    site_details: "Austral, Australia",
                    dockets: "3",
                    start_date_time: "11/02/2017 12:00 PM",
                    end_date: "16/02/2017"
                },
                {
                    number: "43812",
                    fleet_booking_date_time: "19/02/2017 08:00AM",
                    fleet_number_description: "Fleet Number: 8ORG Description: T90499A",
                    customer_name: "Absolute Civil Australia Pty Ltd",
                    driver_name: "Marcus Maumber",
                    site_details: "MT Druitt, Australia	",
                    dockets: "3",
                    start_date_time: "13/02/2017 12:00 PM",
                    end_date: "19/02/2017"
                },
                {
                    number: "43701",
                    fleet_booking_date_time: "20/02/2017 08:00AM",
                    fleet_number_description: "Fleet Number: 8RGCVL Description: CMHR",
                    customer_name: "Ages Build Pty Ltd",
                    driver_name: "Phil Hilton",
                    site_details: "Active Earthworks	",
                    dockets: "2",
                    start_date_time: "20/02/2017 11:00 AM",
                    end_date: "25/02/2017"
                }
                ];
            },

            /**
           * @name getListingByStatus
           * @desc Retrieve WA listing from db
           * @returns {*}
           */
            getListingByStatus: function (status, fromDate, toDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllWorkAllocationByStatus/' + status + '/' + fromDate + '/' + toDate)
                    .then(function (response) {

                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response))
                            waObj.waStatus = response;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });


            },

            getBookingInfo: function () {
                /*return $http.get(CONST.CONFIG.API_URL + 'customers')
                    .then(function(response) {
                        if (response.status == 200 && typeof response.data === 'object') {
                            waObj.bookingInfo = response.data[0]; 
                        }else {
                            NotificationFactory.error(response.data);
                        }

                    }, function(response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });*/

                return waObj.bookingInfo = {
                    department: "TCEB",
                    name: 'tesco Boys Europe',
                    contact_person: "Mike",
                    designation: 'Director',
                    email: 'tesco@hotmail.com',
                    contact_no: '+44 20 8962 1234'
                }
            },

            getWorkAllocationByBookingId: function (BookingId, status, fromDate, toDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetWorkAllocationByBookingId/' + BookingId + '/' + status + '/' + fromDate + '/' + toDate)
                   .then(function (response) {
                       if (response.status == 200) {
                           //console.log("asdasdg" + JSON.stringify(response))
                           waObj.bookingDetail = response.data;
                       } else {
                           NotificationFactory.error(response.data);
                       }
                   }, function (response) {
                       return $q.reject(response.data);
                       NotificationFactory.error(false);
                   });
            }


        }

        return waObj;
    }

    //BookingsListDetailsFactory
    //Inject required modules to factory method
    BookingListFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name BookingListFactory
     * @desc Booking data
     * @returns {{}}
     * @constructor
     */
    function BookingListFactory($http, $q, CONST, NotificationFactory) {

        var blObj = {

            bookingList: [],

            /**
         * @name GetAllBookingByDateRange
         * @desc Retrieve Booking list from db
         * @returns {*}
         */
            getAllBookingByDateRange: function (fromDate, toDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllBookingByDateRange/' + fromDate + '/' + toDate)
                    .then(function (response) {

                        if (response.status == 200) {
                            blObj.bookingList = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
            * @name DeleteBooking by bookingId
            * @desc deleting booking record from db
            * @returns {*}
            */
            deleteBooking: function (bookingId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/DeleteBooking/' + bookingId)
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_DELETED);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
        * @name updateBookingStatus by bookingId
        * @desc updating booking status listing from db
        * @returns {*}
        */
            updateBookingStatus: function (statusData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/UpdateBookingStatus', statusData)
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_UPDATED);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
            * @name sendAttachment
            * @desc updating booking status listing from db
            * @returns {*}
            */
            sendAttachment: function (data) {
                return $http.post(CONST.CONFIG.BASE_URL + 'EmailAttachment/SendAttachment', data)
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_UPDATED);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
        }

        return blObj;
    }

    //Inject required modules to factory method
    ManageJobBookingFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name ManageJobBookingFactory
     * @desc JobBooking data
     * @returns {{}}
     * @constructor
     */
    function ManageJobBookingFactory($http, $q, CONST, NotificationFactory) {

        var mjbObj = {

            bookingDetail: [],
            bookingFleetDetail: [],
            getSupervisorGateDetail: [],
            fleetRegistrationDetail:[],

            /**
        * @name getBookingDetail
        * @desc Retrieve Booking detail from db
        * @returns {*}
        */
            getBookingDetail: function (bookingId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetBookingDetail/' + bookingId)
                    .then(function (response) {

                        if (response.status == 200) {
                            mjbObj.bookingDetail = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
           * @name getBookingFleetDetail
           * @desc Retrieve Booking detail from db
           * @returns {*}
           */
            getBookingFleetDetail: function (bookingFleetId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetBookingFleetDetail/' + bookingFleetId)
                    .then(function (response) {

                        if (response.status == 200) {
                            mjbObj.bookingFleetDetail = response.data;
                            //console.log("From Factory Response", response);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
               * @name getSupervisorGateDetailBySiteId
               * @desc Retrieve Supervisor and Gate Detail By SiteId from db
               * @returns {*}
               */
            getSupervisorGateDetailBySiteId: function (siteId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetSupervisorGateDetailBySiteId/' + siteId)
                    .then(function (response) {
                        if (response.status == 200) {
                            mjbObj.getSupervisorGateDetail = response.data;
                            //console.log("From Factory Response", response);
                        } else {
                            NotificationFactory.error(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
            /**
              * @name getFleetRegistrationsByFleetTypeId
              * @desc Retrieve Supervisor and Gate Detail By SiteId from db
              * @returns {*}
              */
            getFleetRegistrationsByFleetTypeId: function (fleetData) {
                //return $http.get(CONST.CONFIG.API_URL + 'Fleet/GetFleetRegistrationsByFleetTypeId/' + FleetTypeId + '/' + FromDate + '/' + ToDate)
                return $http.post(CONST.CONFIG.API_URL + 'Fleet/GetFleetRegistrationsByFleetTypeId', fleetData, {})                
                    .then(function (response) {
                        if (response.status == 200) {
                            mjbObj.fleetRegistrationDetail = response.data;
                            //console.log("From Factory Response", response);
                        } else {
                            NotificationFactory.error(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
            ///**
            //* @name addBooking
            //* @desc add booking from db
            //* @returns {response message}
            //*/
            addBooking: function (bookingData) {
                console.log("bookingData",bookingData);
                return $http.post(CONST.CONFIG.API_URL + 'Booking/AddBooking', bookingData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            ///**
            //* @name editBooking
            //* @desc add booking from db
            //* @returns {response message}
            //*/
            editBooking: function (bookingData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/EditBooking', bookingData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            ///**
            //* @name addBookingFleet
            //* @desc add booking fleet data to db
            //* @returns {response message}
            //*/
            addBookingFleet: function (bookingFleetData) {

                return $http.post(CONST.CONFIG.API_URL + 'Booking/AddBookingFleet', bookingFleetData, {
                })
                    .then(function (response) {
                        console.log("rj", response)
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            ///**
            //* @name updateBookingFleet
            //* @desc add booking from db
            //* @returns {response message}
            //*/
            updateBookingFleet: function (bookingData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/UpdateBookingFleet', bookingData, {
                })
                    .then(function (response) {

                        if (response.status == 200) {                            
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            /**
             * @name deleteBookingFleet
             * @desc Retrieve Booking detail from db
             * @returns {*}
             */
            deleteBookingFleet: function (bookingFleetId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/DeleteBookingFleet/' + bookingFleetId)
                    .then(function (response) {

                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_DELETED);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

        }

        return mjbObj;
    }

    //Inject required modules to factory method
    ManageBookingSiteFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name ManageBookingSiteFactory
     * @desc Site Booking data 
     * @returns {{siteDetail: object, contactDetail: object}}
     * @constructor
     */
    function ManageBookingSiteFactory($http, $q, CONST, NotificationFactory) {

        var mbsObj = {

            siteDetail: [],
            contactDetail: [],

            /**
          * @name getBookingSiteDetail
          * @desc Retrieve WA listing from db
          * @returns {*}
          */
            getBookingSiteDetail: function (bookingId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetBookingSiteDetail/' + bookingId)
                    .then(function (response) {

                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            mbsObj.siteDetail = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
            * @name addBookingSiteDetail
            * @desc add booking from db
            * @returns {response message}
            */
            addBookingSiteDetail: function (bookingSiteData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/AddBookingSiteDetail', bookingSiteData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            /**
              * @name getContactPersons
              * @desc Retrieve WA listing from db
              * @returns {*}
              */
            getContactPersons: function (gateId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetContactPersons/' + gateId)
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data));
                            mbsObj.contactDetail = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
            * @name AddGateContactPerson
            * @desc add Contact from db
            * @returns {response message}
            */
            addGateContactPerson: function (contactData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/AddGateContactPerson', contactData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            /**
            * @name AddGateContactPerson
            * @desc add Contact from db
            * @returns {response message}
            */
            updateGateContactPerson: function (contactData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/UpdateGateContactPerson', contactData, {
                })
                .then(function (response) {
                    if (response.status == 200) {
                        NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                    } else {
                        NotificationFactory.error(response.data.Message);
                    }

                }, function (response) {
                    //return $q.reject(response.data);
                    NotificationFactory.error("Error: " + response.statusText);
                });
            }
        }
        return mbsObj;
    }

    //Inject required modules to factory method
    ManageDocketFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name ManageDocketFactory
     * @desc Docket data
     * @returns {{waStatus: Array, bookingInfo: object}}
     * @constructor
     */
    function ManageDocketFactory($http, $q, CONST, NotificationFactory) {
        var mdfObj = {

            docketDetail: [],
            docketList: [],
            docketCheckList: [],

            /**
              * @name getBookedFleetRegistration
              * @desc Retrieve Fleet Registration Numbers from db
              * @returns {*}
              */
            getBookedFleetRegistration: function () {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetBookedFleetRegistration/')
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            mdfObj.docketDetail = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
            /**
             * @name addDocket
             * @desc Add new Docket into db
             * @returns {*}
             */
            addDocket: function (docketData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/AddDocket', docketData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },
            /**
            * @name updateDocket
            * @desc Add new Docket into db
            * @returns {*}
            */
            updateDocket: function (docketData) {
                return $http.post(CONST.CONFIG.API_URL + 'Booking/UpdateDocket', docketData, {
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            NotificationFactory.success(CONST.MSG.SUCCESS_RECORD_ADDED);
                        } else {
                            NotificationFactory.error(response.data.Message);
                        }

                    }, function (response) {
                        //return $q.reject(response.data);
                        NotificationFactory.error("Error: " + response.statusText);
                    });
            },

            /**
             * @name GetAllDocketByBookingFleetId
             * @desc Retrieve Fleet Registration Numbers from db
             * @returns {*}
             */
            GetAllDocketByBookingFleetId: function (BookingFleetId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllDocketByBookingFleetId/' + BookingFleetId)
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            mdfObj.docketList = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
              * @name getDocketDetail
              * @desc Retrieve Fleet Registration Numbers from db
              * @returns {*}
              */
            getDocketDetail: function (DocketId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetDocketDetail/' + DocketId)
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            mdfObj.docketDetail = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
              * @name getAllDocketCheckboxList
              * @desc Retrieve Fleet Registration Numbers from db
              * @returns {*}
              */
            getAllDocketCheckboxList: function () {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllDocketCheckboxList/')
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            mdfObj.docketCheckList = response.data;
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
        }

        return mdfObj;
    }

    //Inject required modules to factory method
    BookingDashboardFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name BookingDashboardFactory
     * @desc Customer booking data for dashboard
     * @returns {{bookingList: Array, bookingDetail: object}}
     * @constructor
     */
    function BookingDashboardFactory($http, $q, CONST, NotificationFactory) {
        var bdfObj = {

            bookingDetail: [],
            bookingList: [],
            customerFleetByStatusList: [],
            customerFleetList: [],
            fleetRegLists: [],
            currentCustomerFleetLists: [],
            customerSiteList: [],

            /**
              * @name getBookingDashboardCustomerList
              * @desc Retrieve Fleet Registration Numbers from db
              * @returns {*}
              */
            getBookingDashboardCustomerList: function (currentDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/BookingDashboardCustomerList/' + currentDate)
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            bdfObj.bookingList = response.data;
                            //console.log(bdfObj.bookingList);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
             * @name getFleetList
             * @desc Retrieve current fleets from db
             * @returns {*}
             */
            getFleetList: function (requestDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetFleetList/' + requestDate)
                .then(function (response) {
                    if (response.status == 200) {
                        //console.log("asdasdg" + JSON.stringify(response.data))
                        bdfObj.customerFleetList = response.data;
                        //console.log(bdfObj.customerFleetList);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
             * @name getCurrentCustomerFleetByStatus
             * @desc Retrieve Current Customer Fleet By Status from db
             * @returns {*}
             */
            getCurrentCustomerFleetByStatus: function (customerId, fleetTypeId, statusValue, fromDate, toDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetCurrentCustomerFleetByStatus/' + customerId + '/' + fleetTypeId + '/' + statusValue + '/' + fromDate + '/' + toDate)
                .then(function (response) {
                    if (response.status == 200) {
                        //console.log("asdasdg" + JSON.stringify(response.data))
                        bdfObj.customerFleetByStatusList = response.data;
                        //console.log(bdfObj.bookingList);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
            * @name getFleetRegistrationsListByFleetTypeId
            * @desc Retrieve Current Fleets By fleettype id from db
            * @returns {*}
            */
            getFleetRegistrationsListByFleetTypeId: function (fleetTypeId, date) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetFleetRegistrationsListByFleetTypeId/' + fleetTypeId + '/' + date)
                .then(function (response) {
                    if (response.status == 200) {
                        //console.log("asdasdg" + JSON.stringify(response.data))
                        bdfObj.fleetRegLists = response.data;
                        //console.log(bdfObj.fleetRegLists);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
            * @name getAvailableFleetsByFleetTypeId
            * @desc Retrieve Current Fleets By fleettype id from db
            * @returns {*}
            */
            getAvailableFleetsByFleetTypeId: function (fleetTypeId, date) {
                return $http.get(CONST.CONFIG.API_URL + 'Fleet/GetAvailableFleetsByFleetTypeId/' + fleetTypeId)
                 .then(function (response) {
                     if (response.status == 200) {
                         bdfObj.fleetRegistrationList = response.data;
                         //console.log(bdfObj.currentCustomerFleetLists);
                     } else {
                         NotificationFactory.error(response.data);
                     }

                 }, function (response) {
                     return $q.reject(response.data);
                     NotificationFactory.error(false);
                 });
            },

            /**
            * @name getCurrentCustomerBooking
            * @desc Retrieve Current Fleets By customer id from db
            * @returns {*}
            */
            getCurrentCustomerBooking: function (customerId, statusValue, fromDate, toDate) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetCurrentCustomerBooking/' + customerId + '/' + statusValue + '/' + fromDate + '/' + toDate)
                .then(function (response) {
                    if (response.status == 200) {
                        //console.log("asdasdg" + JSON.stringify(response.data))
                        bdfObj.currentCustomerFleetLists = response.data;
                        //console.log(bdfObj.currentCustomerFleetLists);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
           * @name getFleetRegistrationListByFleetId
           * @desc Retrieve fleetRegistration by fleetId
           * @returns {*}
           */
            getFleetRegistrationListByFleetId: function (fleetId) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetFleetRegistrationsListByFleetTypeId/' + fleetId)
                .then(function (response) {
                    if (response.status == 200) {
                        bdfObj.fleetRegistrationList = response.data;
                        //console.log(bdfObj.currentCustomerFleetLists);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
              * @name searchFleetByFleetName
              * @desc Retrieve fleets by search string
              * @returns {*}
              */
            searchFleetByFleetName: function (fleetName, date) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/SearchFleet/' + fleetName + '/' + date)
                .then(function (response) {
                    if (response.status == 200) {
                        bdfObj.customerFleetList = response.data;
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
           * @name getCustomerSiteDetailByCustomerId
           * @desc Retrieve customer site detail by customerId
           * @returns {*}
           */
            getCustomerSiteDetailByCustomerId: function (customerId, date) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetCustomerSiteDetailByCustomerId/' + customerId + '/' + date)
                .then(function (response) {
                    if (response.status == 200) {
                        bdfObj.customerSiteList = response.data.DataObject;
                        //console.log(bdfObj.customerSiteList);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },

            /**
           * @name getSitesByCustomerIdAndSiteId
           * @desc Retrieve customer site detail by customerId
           * @returns {*}
           */
            getSitesByCustomerIdAndSiteId: function (customerId, siteId, fromDate, toDate, status) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetSitesByCustomerIdAndSiteId/' + customerId + '/' + siteId + '/' + fromDate + '/' + toDate + '/' + status)
                .then(function (response) {
                    if (response.status == 200) {
                        bdfObj.customerSiteFleetList = response.data.DataObject;
                        //console.log(bdfObj.customerSiteFleetList);
                    } else {
                        NotificationFactory.error(response.data);
                    }

                }, function (response) {
                    return $q.reject(response.data);
                    NotificationFactory.error(false);
                });
            },



        }
        return bdfObj;
    }

    //Inject required modules to factory method
    BookingCalendarFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name BookingCalendarFactory
     * @desc booking data according to date
     * @returns {{bookingCalendarList: Array, bookingCalendarDetail: object}}
     * @constructor
     */
    function BookingCalendarFactory($http, $q, CONST, NotificationFactory) {
        var bcfObj = {

            bookingCalendarDetail: {},
            bookingCalendarList: [],
            bookingListByDate: [],

            /**
              * @name getAllDatesHaveBooking
              * @desc Retrieve Booking from db
              * @returns {*}
              */
            getAllDatesHaveBooking: function () {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllDatesHaveBooking')
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            bcfObj.bookingCalendarList = response.data;
                            //console.log(bcfObj.bookingCalendarList);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },

            /**
            * @name getAllBookingByFleetBookingDateTime
            * @desc Retrieve Booking from db
            * @returns {*}
            */
            getAllBookingByFleetBookingDate: function (date) {
                return $http.get(CONST.CONFIG.API_URL + 'Booking/GetAllBookingByFleetBookingDate/' + date)
                    .then(function (response) {
                        if (response.status == 200) {
                            //console.log("asdasdg" + JSON.stringify(response.data))
                            bcfObj.bookingListByDate = response.data;
                            //console.log(bcfObj.bookingListByDate);
                        } else {
                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {
                        return $q.reject(response.data);
                        NotificationFactory.error(false);
                    });
            },
        }
        return bcfObj;
    }

})();