/**
 * @name configState
 * @desc Set all the routes
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param $compileProvider
 */

function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/booking/BookingDashboard/");
    $stateProvider
         // Login - User Login page
         //Admin
        .state('admin', {
            abstract: true,
            url: "/admin",
            templateUrl: "views/Common/content_empty.html",
            data: {
                pageTitle: 'Admin'
            }
        })
        .state('admin.Login', {
            url: "/Login",
            templateUrl: "views/admin/Login.html",
            data: {
                pageTitle: 'Login',
                specialClass: 'login-page'
            }
        })
        .state('admin.ForgotPassword', {
             url: "/ForgotPassword",
             templateUrl: "views/admin/ForgotPassword.html",
             data: {
                 pageTitle: 'Forgot Password',
                 specialClass: 'login-page'
             }
         })

        // Dashboard - Main page
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: {
                pageTitle: 'Dashboard'
            }
        })

        // Widgets
        .state('widgets', {
            url: "/widgets",
            templateUrl: "views/widgets.html",
            data: {
                pageTitle: 'Widgets'
            }
        })

        // Widgets
        .state('options', {
            url: "/options",
            templateUrl: "views/options.html",
            data: {
                pageTitle: 'Options',
                pageDesc: 'Example small header for demo purpose.'
            }
        })

        //Booking
        .state('booking', {
            abstract: true,
            url: "/booking",
            templateUrl: "views/Common/content.html",
            data: {
                pageTitle: 'Booking'
            }
        })
        .state('booking.JobBooking', {
            url: "/JobBooking/:BookingId",
            templateUrl: "views/booking/JobBooking.html",
            data: {
                pageTitle: 'Job Booking'
            }
        })
        .state('booking.WorkAllocation', {
            url: "/WorkAllocation",
            templateUrl: "views/booking/WorkAllocation.html",
            data: {
                pageTitle: 'Work Allocation'
            }
        })
        .state('booking.BookingWorkAllocation', {
            url: "/BookingWorkAllocation/:BookingId",
            templateUrl: "views/booking/WorkAllocation.html",
            data: {
                pageTitle: 'Booking Work Allocation'
            }
        })
         .state('booking.FleetHistory', {
             url: "/FleetHistory/:BookingFleetId/:BookingId",
             templateUrl: "views/booking/BookingFleetHistory.html",
             data: {
                 pageTitle: 'Fleet History'
             }
         })
        .state('booking.BookingDashboard', {
            url: "/BookingDashboard/:CalendarDate",
            templateUrl: "views/booking/BookingDashboard.html",
            data: {
                pageTitle: ''
            }
        })
        .state('booking.CustomerBookingList', {
            url: "/CustomerBookingList/:CustomerId/:FleetTypeId/:StatusValue/:FromDate/:ToDate",
            templateUrl: "views/booking/CustomerBookingList.html",
            data: {
                pageTitle: 'Customer Booking List'
            }
        })
        .state('booking.CurrentCustomerFleetList', {
             url: "/CurrentCustomerFleetList/:CustomerId/:FromDate/:ToDate",
             templateUrl: "views/booking/CurrentCustomerFleetList.html",
             data: {
                 pageTitle: 'Current Customer Booking List'
             }
         })
        .state('booking.CustomerSiteBookingList', {
             url: "/CustomerSiteBookingList",
             templateUrl: "views/booking/CustomerSiteBookingList.html",
             data: {
                 pageTitle: 'Customer Booking List'
             }
         })
        .state('booking.FleetListByFleetTypeId', {
            url: "/FleetListByFleetTypeId/:FleetTypeId",
            templateUrl: "views/configuration/FleetRegistrationList.html",
            data: {
                pageTitle: 'Fleet Registration List'
            }
        })
        .state('booking.BookingList', {
            url: "/BookingList/:CalendarDate",
            templateUrl: "views/booking/BookingList.html",
            data: {
                pageTitle: 'Booking List'
            }
        })
        .state('booking.DocketList', {
            url: "/DocketList/:BookingFleetId",
            templateUrl: "views/booking/DocketList.html",
            data: {
                pageTitle: 'Docket List'
            }
        })
        .state('booking.CreateDocket', {
            url: "/CreateDocket/:BookingFleetId",
            templateUrl: "views/booking/CreateDocket.html",
            data: {
                pageTitle: 'Create Docket'
            }
        })
        .state('booking.ViewDocket', {
             url: "/ViewDocket/:DocketId",
             templateUrl: "views/booking/ViewDocket.html",
             data: {
                 pageTitle: 'View Docket'
             }
         })
        .state('booking.EditDocket', {
            url: "/EditDocket/:DocketId",
            templateUrl: "views/booking/CreateDocket.html",
            data: {
                pageTitle: 'Edit Docket'
            }
        })
        .state('booking.CustomerDashboard', {
             url: "/CustomerDashboard/:CustomerId",
             templateUrl: "views/booking/CustomerDashboard.html",
             data: {
                 pageTitle: ''
             }
         })
         .state('booking.CustomerSiteBooking', {
             url: "/CustomerSiteBooking/:CustomerId/:SiteId/:Status",
             templateUrl: "views/booking/CustomerSiteFleetBooking.html",
             data: {
                 pageTitle: 'Customer Site Booking'
             }
         })
        .state('booking.CurrentCustomerSiteBookingList', {
            url: "/CurrentCustomerSiteBookingList/:CustomerId/:SiteId/:FromDate/:ToDate",
            templateUrl: "views/booking/CurrentCustomerSiteBookingList.html",
            data: {
                pageTitle: 'Current Customer Site Booking List'
            }
        })

        //Configuration
        //User CRUD
        .state('configuration', {
             abstract: true,
             url: "/configuration",
             templateUrl: "views/common/content.html",
             data: {
                 pageTitle: 'Configuration'
             }
         })
         .state('configuration.UserList', {
             url: "/UserList",
             templateUrl: "views/configuration/UserList.html",
             data: {
                 pageTitle: 'User List'
             }
         })
          .state('configuration.AddUser', {
              url: "/AddUser",
              templateUrl: "views/configuration/CreateUser.html",
              data: {
                  pageTitle: 'Add User'
              }
          })
         .state('configuration.EditUser', {
             url: "/EditUser/:UserId",
             templateUrl: "views/configuration/CreateUser.html",
             data: {
                 pageTitle: 'Edit User'
             }
         })
         .state('configuration.ChangePassword', {
             url: "/ChangePassword",
             templateUrl: "views/configuration/ChangePassword.html",
             data: {
                 pageTitle: 'Change Password'
             }
         })

         //Driver CRUD
         .state('configuration.DriverList', {
            url: "/DriverList",
            templateUrl: "views/configuration/DriverList.html",
            data: {
                pageTitle: 'Driver List'
            }
        })
         .state('configuration.AddDriver', {
              url: "/AddDriver",
              templateUrl: "views/configuration/CreateDriver.html",
              data: {
                  pageTitle: 'Add Driver'
              }
          })
         .state('configuration.EditDriver', {
             url: "/EditDriver/:DriverId",
             templateUrl: "views/configuration/CreateDriver.html",
             data: {
                 pageTitle: 'Edit Driver'
             }
         })

        //Checklist CRUD
        .state('configuration.CheckList', {
            url: "/CheckList",
            templateUrl: "views/configuration/CheckList.html",
            data: {
                pageTitle: 'Check List'
            }
        })

        //FleetRegistration CRUD
        .state('configuration.FleetRegistrationList', {
            url: "/FleetRegistrationList",
            templateUrl: "views/configuration/FleetRegistrationList.html",
            data: {
                pageTitle: 'Fleet Registration List'
            }
        })
        .state('configuration.AddFleetRegistration', {
            url: "/AddFleetRegistration",
            templateUrl: "views/configuration/CreateFleetRegistration.html",
            data: {
                pageTitle: 'Add Fleet'
            }
        })
        .state('configuration.EditFleetRegistration', {
            url: "/EditFleetRegistration/:FleetRegistrationId",
            templateUrl: "views/configuration/CreateFleetRegistration.html",
            data: {
                pageTitle: 'Edit Fleet'
            }
        })

         //Fleet Type        
        .state('configuration.FleetTypeList', {
            url: "/FleetTypeList",
            templateUrl: "views/configuration/FleetTypeList.html",
            data: {
                pageTitle: 'Fleet Type List'
            }
        })
        .state('configuration.AddFleetType', {
            url: "/AddFleetType",
            templateUrl: "views/configuration/CreateFleetType.html",
            data: {
                pageTitle: 'Add Fleet Type'
            }
        })
        .state('configuration.EditFleetType', {
            url: "/EditFleetType/:FleetTypeId",
            templateUrl: "views/configuration/CreateFleetType.html",
            data: {
                pageTitle: 'Edit Fleet Type '
            }
        })
        // Work Type
        .state('configuration.WorkTypeList', {
            url: "/WorkTypeList",
            templateUrl: "views/configuration/WorkTypeList.html",
            data: {
                pageTitle: 'Work Type List'
            }
        })
        //Customer CRUD
         .state('configuration.CustomerList', {
             url: "/CustomerList",
             templateUrl: "views/configuration/CustomerList.html",
             data: {
                 pageTitle: 'Customer List'
             }
         })
        .state('configuration.AddCustomer', {
            url: "/AddCustomer",
            templateUrl: "views/configuration/CreateCustomer.html",
            data: {
                pageTitle: 'Customer Registration'
            }
        })
        .state('configuration.EditCustomer', {
            url: "/EditCustomer/:CustomerId",
            templateUrl: "views/configuration/CreateCustomer.html",
            data: {
                pageTitle: 'Edit Customer'
            }
        })

        //Site CRUD
        .state('configuration.SiteList', {
            url: "/SiteList",
            templateUrl: "views/configuration/SiteList.html",
            data: {
                pageTitle: 'Site List'
            }
        })
        .state('configuration.AddSite', {
            url: "/AddSite/:CustomerId",
            templateUrl: "views/configuration/CreateSite.html",
            data: {
                pageTitle: 'Add Site'
            }
        })
        .state('configuration.EditSite', {
            url: "/EditSite/:SiteId/:CheckPage",
            templateUrl: "views/configuration/UpdateSite.html",
            data: {
                pageTitle: 'Edit Site '
            }
        })

        //Supervisor CRUD
        .state('configuration.SupervisorList', {
            url: "/SupervisorList",
            templateUrl: "views/configuration/SupervisorList.html",
            data: {
                pageTitle: 'Supervisor List'
            }
        })
        .state('configuration.AddSupervisor', {
            url: "/AddSupervisor",
            templateUrl: "views/configuration/CreateSupervisor.html",
            data: {
                pageTitle: 'Add Supervisor'
            }
        })
        .state('configuration.EditSupervisor', {
            url: "/EditSupervisor/:SupervisorId",
            templateUrl: "views/configuration/CreateSupervisor.html",
            data: {
                pageTitle: 'Edit Supervisor '
            }
        })

        //Gate CRUD
        .state('configuration.GateList', {
             url: "/GateList",
             templateUrl: "views/configuration/GateList.html",
             data: {
                 pageTitle: 'Gate List'
             }
        })
        .state('configuration.AddGate', {
            url: "/AddGate",
            templateUrl: "views/configuration/CreateGate.html",
            data: {
                pageTitle: 'Add Gate'
            }
        })
        .state('configuration.EditGate', {
            url: "/EditGate/:GateId",
            templateUrl: "views/configuration/CreateGate.html",
            data: {
                pageTitle: 'Edit Gate'
            }
        })

        //Tax CRUD
        .state('configuration.TaxList', {
            url: "/TaxList",
            templateUrl: "views/configuration/TaxList.html",
            data: {
                pageTitle: 'Tax List'
            }
        })       

        //Rate CRUD
        .state('configuration.RateList', {
            url: "/RateList",
            templateUrl: "views/configuration/RateList.html",
            data: {
                pageTitle: 'Rate List'
            }
        })
        .state('configuration.AddRate', {
            url: "/AddRate",
            templateUrl: "views/configuration/CreateRate.html",
            data: {
                pageTitle: 'Add Rate'
            }
        })
        .state('configuration.EditRate', {
            url: "/EditRate/:RateId",
            templateUrl: "views/configuration/CreateRate.html",
            data: {
                pageTitle: 'Edit Rate'
            }
        })
}

/**
 * Associate configurations and constants with angular application
 */
angular
    .module('borgcivil')
    .config(configState)
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }])
    .constant("CONST", {
        CONFIG: {
            //local server
            //BASE_URL: 'http://localhost:1234/',
            //API_URL: 'http://localhost:1234/api/',

            // development server
            BASE_URL: 'http://183.182.84.29/BorgCivil/',
            API_URL: 'http://183.182.84.29/BorgCivil/api/',
            IMG_URL: 'http://183.182.84.29/BorgCivil/Uploads/',
            DEFAULT_IMG: 'content/images/no-image.png'

        },
        /*Common messages for whole application*/
        MSG: {
            COMMON_ERROR: 'Something is wrong. Please try again later.',
            CONFIRM_RECORD_DELETE: 'Are you sure you want to delete this?',
            SUCCESS_RECORD_ADDED: 'The record has successfully added.',
            SUCCESS_RECORD_UPDATED: 'The record has been updated successfully.',
            SUCCESS_RECORD_SENT: 'The records has been successfully sent.',
            SUCCESS_RECORD_DELETED: 'The record has been successfully deleted.',
            WAITING_REQUEST: 'Please wait, your request is being processed.',
            WAITING_DATA_RETRIEVAL: 'Please wait, data is being retrieved.',
            SUCCESS_LOGGED_IN: 'You have successfully Logged In',
            LOGIN_ERROR: 'Invalid Credentials, Please try again',
            UNREGISTERED_EMAIL: 'This email is not registered',
            PASSWROD_CHANGE_EMAIL_SENT: 'New password successfully send to your mail, Please check.',
            OLD_PASSWORD: 'Old password is incorrect'
        }
    })
    .run(function ($rootScope, $state, editableOptions) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3';
    });