(function () {
    'use strict';

    /**
     * Booking Controller
     * Created by: (SIPL)
     */
    angular
        .module('borgcivil')
        .controller('WorkAllocationCtrl', WorkAllocationCtrl)
        .controller('NewJobCtrl', NewJobCtrl)
        .controller('JobBookingCtrl', JobBookingCtrl)
        .controller('ManageJobBookingCtrl', ManageJobBookingCtrl)
        .controller('ManageBookingFleetCtrl', ManageBookingFleetCtrl)
        .controller('ManageBookingSiteCtrl', ManageBookingSiteCtrl)
        .controller('BookingListCtrl', BookingListCtrl)
        .controller('BookingDashboardCustomerListCtrl', BookingDashboardCustomerListCtrl)
        .controller('ManageCustomerBookingListCtrl', ManageCustomerBookingListCtrl)
        //.controller('ManageCurrentCustomerBookingCtrl', ManageCurrentCustomerBookingCtrl)
        .controller('CustomerDashboardCtrl', CustomerDashboardCtrl)
        .controller('ManageDocketCtrl', ManageDocketCtrl)
        .controller('DocketViewCtrl', DocketViewCtrl)

    //Inject required stuff as parameters to factories controller function
    WorkAllocationCtrl.$inject = ['$timeout', '$scope', '$state', '$stateParams', '$uibModal', 'WorkAllocationFactory', 'UtilsFactory', 'BCAFactory', '$filter', 'BookingDashboardFactory', '$location'];

    /**
    * @name WorkAllocationCtrl
    * @param $timeout
    * @param $scope
    * @param $state
    * @param $stateParams
    * @param $uibModal
    * @param WorkAllocationFactory
    * @param UtilsFactory
    * @param BCAFactory
    * @param $filter
    * @param BookingDashboardFactory
    * @param $location
   */
    function WorkAllocationCtrl($timeout, $scope, $state, $stateParams, $uibModal, WorkAllocationFactory, UtilsFactory, BCAFactory, $filter, BookingDashboardFactory, $location) {

        //Assign controller scope pointer to a variable
        var vm = this;

        // map create job booking property
        vm.attributes = {
            FromDate: '',
            ToDate: '',
            BookingFleet: {
                BookingFleetId: '',
                BookingId: '',
                FleetTypeId: '',
                FleetRegistrationId: '',
                DriverId: '',
                IsDayShift: '',
                Iswethire: '',
                AttachmentIds: '',
                NotesForDrive: '',
                IsfleetCustomerSite: false,
                Reason: '',
                StatusLookupId: '',
                BookingNumber: '',
                AllocationNotes: '',
                CreatedDate: '',
                EndDate: '',
                FleetBookingDateTime: new Date(),
                FleetBookingEndDate: '',
                CallingDateTime: '',
                IsActive: true,
                FleetName: ''
            },
        };
        vm.status = {
            BookingId: '',
            StatusValue: '',
            CancelNote: '',
            Rate: ''
        };
        vm.bookingId = '';
        vm.bookingFleetStatus = {
            BookingFleetId: '',
            StatusValue: ''
        }
        vm.bookingFleetHistory = [];
        vm.stateParamBookingId = '';
        vm.fleetType = '';
        vm.waListData = '';
        vm.resetDate = true;
        vm.dateRangeError = false;     

        //START SONALI UI-Grid Code

        /**
        * Start Work Allocation
        * For Work Allocation grid column names
        * For booked-in grid
        **/
        vm.dataSetBookedIn = [
            //{
            //    name: 'DriverName'
            //},
            //{
            //    name: 'FleetDetail',
            //    displayName: 'Fleet Number'
            //},
            {
                name: 'CustomerName',
                cellTemplate: '<a class="ui-grid-cell-contents ng-binding ng-scope" href="javascript:void(0);" ng-click="grid.appScope.bookingCustomerDetail(row.entity);" >{{row.entity.CustomerName}}</a>'
            },
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'WorkType',
                displayName: 'Job Type'
            },
            //{
            //    name: 'Material'
            //},
            {
                name: 'BookingNumber'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                        '<li><a href="javascript:void(0)" ng-click="grid.appScope.fleetAllocation(row.entity,\'pending\')"><i class="fa pe-7s-file" aria-hidden="true"></i>  Allocation</a></li>' +
                                        '<li><a href="javascript:void(0)" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')"><i class="fa pe-7s-copy-file" aria-hidden="true"></i>  Duplicate</a></li>' +
                                        '<li><a href="javascript:void(0)" ng-click="grid.appScope.deleteBookingFleet(row.entity.BookingFleetId);"><i class="fa pe-7s-trash" aria-hidden="true"></i> Delete</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            },          
        ];

        //For Allocation grid
        vm.dataSetAllocation = [
            {
                name: 'DriverName'
            },
            {
                name: 'FleetDetail',
                displayName: 'Fleet Number'
            },//Fleet Number           
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'JobType'
            },
            {
                name: 'Material'
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'BookingNumber'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.CreateDocket({BookingFleetId: row.entity.BookingFleetId})" ><i class="fa pe-7s-file" aria-hidden="true"></i>Add Docket</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'reallocation\')" ><i class="fa pe-7s-refresh" aria-hidden="true"></i>Re-Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.FleetHistory({BookingFleetId: row.entity.BookingFleetId, BookingId: row.entity.BookingId})" ><i class="fa fa-history fa-icon" aria-hidden="true"></i>  Fleet History</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetComplete(row.entity.BookingFleetId);" ><i class="fa pe-7s-bookmarks" aria-hidden="true"></i>Marked As completed</a></li>'+
                                    '</ul>' +
                                '</div>'
                             ].join('')
            }
        ];

        //For Complete grid
        vm.dataSetCompleted = [
            {
                name: 'BookingNumber'
            },
            {
                name: 'FleetBookingDateTime'
            },
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'FleetDescription',
                displayName: 'Fleet Number / Description'
            },
            {
                name: 'DriverName'
            },
            {
                name: 'SiteDetail'
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'StartDateTime'
            },
            {
                name: 'EndDate'
            }
        ];

        vm.uiGrid0 = {};
        vm.uiGrid1 = {};
        vm.uiGrid2 = {};

        vm.uiGrid0 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetBookedIn);
        vm.uiGrid1 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetAllocation);
        vm.uiGrid2 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCompleted);

        //Grid Api
        vm.uiGrid0.onRegisterApi = function (gridApi) {           
            vm.gridApi0 = gridApi;
        }
        vm.uiGrid1.onRegisterApi = function (gridApi) {           
            vm.gridApi1 = gridApi;
        }
        vm.uiGrid2.onRegisterApi = function (gridApi) {           
            vm.gridApi2 = gridApi;
        }

        //End Work Allocation

        /**
        * Start Current Customer Booking list
        * For Current Customer Booking grid column names
        */

        //For booked-in grid
        vm.dataSetCustomerBookedIn = [
            {
                name: 'DriverName'
            },
            {
                name: 'FleetDetail',
                displayName: 'Fleet Number'
            },
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'WorkType',
                displayName: 'Job Type'
            },
            {
                name: 'Material'
            },
            {
                name: 'BookingNumber'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: [ '<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'pending\')" ><i class="fa pe-7s-file" aria-hidden="true"></i>Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i>Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.deleteBookingFleet(row.entity.BookingFleetId);" ><i class="fa pe-7s-trash" aria-hidden="true"></i>Delete</a></li>' +
                                    '</ul>' +
                                '</div>'
                            ].join('')
            }
        ];

        //For Allocation grid
        vm.dataSetCustomerAllocation = [
            {
                name: 'DriverName'
            },
            {
                name: 'FleetDetail',
                displayName: 'Fleet Number'
            },           
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'JobType'
            },
            {
                name: 'Material'
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'BookingNumber'
            },
            {
                 name: 'Status',
                 cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" >Allocated</div>'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.CreateDocket({BookingFleetId: row.entity.BookingFleetId})" ><i class="fa pe-7s-file" aria-hidden="true"></i>Add Docket</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'reallocation\')" ><i class="fa pe-7s-refresh" aria-hidden="true"></i>Re-Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.FleetHistory({BookingFleetId: row.entity.BookingFleetId, BookingId: row.entity.BookingId})" ><i class="fa fa-history fa-icon" aria-hidden="true"></i>  Fleet History</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetComplete(row.entity.BookingFleetId);" ><i class="fa pe-7s-bookmarks" aria-hidden="true"></i>Marked As completed</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        //For Completed grid
        vm.dataSetCustomerCompleted = vm.dataSetCompleted;// Same column names and their order  

        vm.uiGridCustomer0 = {};
        vm.uiGridCustomer1 = {};
        vm.uiGridCustomer2 = {};

        //Current Customer booking list
        vm.uiGridCustomer0 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerBookedIn);
        vm.uiGridCustomer1 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerAllocation);
        vm.uiGridCustomer2 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerCompleted);

        //Grid Api
        vm.uiGridCustomer0.onRegisterApi = function (gridApi) {            
            vm.gridApiCustomer0 = gridApi;
        }
        vm.uiGridCustomer1.onRegisterApi = function (gridApi) {           
            vm.gridApiCustomer1 = gridApi;
        }
        vm.uiGridCustomer2.onRegisterApi = function (gridApi) {           
            vm.gridApiCustomer2 = gridApi;
        }

        //End Current Customer Booking list

        //Start  Current Customer Site Booking list
        vm.uiGridCustomerSite0 = {};
        vm.uiGridCustomerSite1 = {};
        vm.uiGridCustomerSite2 = {};
       
        //For booked-in grid
        vm.dataSetCustomerSiteBookedIn = [
            {
                name: 'DriverName'
            },
            {
                name: 'FleetDetail',
                displayName: 'Fleet Number'
            },
            {
                name: 'WorkType',
                displayName: 'Job Type'
            },
            {
                name: 'Material'
            },
            {
                name: 'BookingNumber'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'pending\')" ><i class="fa pe-7s-file" aria-hidden="true"></i> Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.deleteBookingFleet(row.entity.BookingFleetId);" ><i class="fa pe-7s-trash" aria-hidden="true"></i>Delete</a></li>' +
                                    '</ul>' +
                                '</div>'
                            ].join('')
            }
        ];

        //For Allocation grid
        vm.dataSetCustomerSiteAllocation = [
            {
                name: 'DriverName'
            },
            {
                name: 'FleetDetail',
                displayName: 'Fleet Number'
            }, 
            {
                name: 'JobType'
            },
            {
                name: 'Material'
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'BookingNumber'
            },
            {
                 name: 'Status',
                 cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" >Allocated</div>'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: [ '<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.CreateDocket({BookingFleetId: row.entity.BookingFleetId})" ><i class="fa pe-7s-file" aria-hidden="true"></i>Add Docket</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'reallocation\')" ><i class="fa pe-7s-refresh" aria-hidden="true"></i>Re-Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.FleetHistory({BookingFleetId: row.entity.BookingFleetId, BookingId: row.entity.BookingId})" ><i class="fa fa-history fa-icon" aria-hidden="true"></i>  Fleet History</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetComplete(row.entity.BookingFleetId);" ><i class="fa pe-7s-bookmarks" aria-hidden="true"></i>Marked As completed</a></li>' +
                                    '</ul>' +
                                '</div>'
                            ].join('')
            }
        ];

        //For Completed grid
        vm.dataSetCustomerSiteCompleted = [
            {
                name: 'BookingNumber'
            },
            {
                name: 'FleetBookingDateTime'
            },
            {
                name: 'FleetDescription',
                displayName: 'Fleet Number / Description'
            },
            {
                name: 'DriverName'
            },
            {
                name: 'SiteDetail'
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'StartDateTime'
            },
            {
                name: 'EndDate'
            }
        ];


        //Current Customer booking list
        vm.uiGridCustomerSite0 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerSiteBookedIn);
        vm.uiGridCustomerSite1 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerSiteAllocation);
        vm.uiGridCustomerSite2 = UtilsFactory.uiGridOptionsWithExport(vm.dataSetCustomerSiteCompleted);

        //Grid Api
        vm.uiGridCustomerSite0.onRegisterApi = function (gridApi) {
            vm.gridApiCustomerSite0 = gridApi;
        }
        vm.uiGridCustomerSite1.onRegisterApi = function (gridApi) {
            vm.gridApiCustomerSite1 = gridApi;
        }
        vm.uiGridCustomerSite2.onRegisterApi = function (gridApi) {
            vm.gridApiCustomerSite2 = gridApi;
        }

        //End  Current Customer Site Booking list

        //Start  Fleet History
        vm.uiGridFleetHistory = {};
        vm.dataSetFleetHistory = [
            {
                name: 'CreatedDate',
                displayName: 'Date',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.CreatedDate | date : "dd-MM-yyyy"}}</div>'
            },
            {
                name: 'Driver/Shift',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" >{{row.entity.DriverName}} / {{(row.entity.IsDayShift=="true")?"Day":"Night"}}</div>'
            },
            {
                name: 'NoteForDrive',
                displayName: 'Notes'
            },
            {
                name: 'Reason',
                displayName: 'Reason For Change'
            },
            {
                name: 'Attachments'

            }
        ];
        vm.uiGridFleetHistory = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSetFleetHistory);
        vm.uiGridFleetHistory.onRegisterApi = function (gridApi) {
                    
            vm.gridApiFleetHistory = gridApi;
        }
        //End Fleet History

        //END UI-Grid Code
       
        // define value's corresponding to status
        var statusValue = {
            "Pending": "2",
            "Allocated": "3",
            "Completed": "4"
        }

        // vm.customerFleetByStatusList = '';
        vm.currentCustomerbookingData = '';

        //Methods
        vm.getListing = getListing;
        vm.getStatusListing = getStatusListing;
        vm.getBookingInfo = getBookingInfo;
        $scope.deleteBookingFleet = deleteBookingFleet;// Comment becoz call this function by $scope while movable column implement
        $scope.fleetComplete = fleetComplete; // Comment becoz call this function by $scope while movable column implement
        $scope.fleetAllocation = fleetAllocation;// Comment becoz call this function by $scope while movable column implement
        $scope.bookingCustomerDetail = bookingCustomerDetail;
        vm.manageFleetBooking = manageFleetBooking;
        vm.getAttachments = getAttachments;
        vm.getFleetypes = getFleetypes;
        vm.getBookingFleetDetail = getBookingFleetDetail;
       
        vm.getBookingFleetHistory = getBookingFleetHistory;
        vm.getWorkAllocationByBookingId = getWorkAllocationByBookingId;

        //Export functions for Work Allocation list
        //vm.downloadExcelBookingList = downloadExcelBookingList;
        //vm.downloadPrintBookingList = downloadPrintBookingList;

        ////Export functions for Current Customer Fleet List
        //vm.saveCurrentCustomerFleetListPDF = saveCurrentCustomerFleetListPDF;
        //vm.downloadExcelCurrentCustomerFleetList = downloadExcelCurrentCustomerFleetList;
        //vm.downloadPrintCurrentCustomerFleetList = downloadPrintCurrentCustomerFleetList;

        //Export functions for Current Customer Site Booking List
        //vm.downloadExcelCurrentCustomerSiteBookingList = downloadExcelCurrentCustomerSiteBookingList;
        //vm.downloadPrintCurrentCustomerSiteBookingList = downloadPrintCurrentCustomerSiteBookingList;

        //work allocation
        vm.print0 = print0;
        vm.print1 = print1;
        vm.print2 = print2;

        //current customer booking list
        vm.printCustomer0 = printCustomer0;
        vm.printCustomer1 = printCustomer1;
        vm.printCustomer2 = printCustomer2;

        //current customer site booking list
        vm.printCustomerSite0 = printCustomerSite0;
        vm.printCustomerSite1 = printCustomerSite1;
        vm.printCustomerSite2 = printCustomerSite2;
        //vm.saveCurrentCustomerSiteBookingListPDF = saveCurrentCustomerSiteBookingListPDF;

        //vm.downloadPdfBookingList = downloadPdfBookingList;
        vm.getCurrentCustomerBookingList = getCurrentCustomerBookingList;
        vm.getSitesByCustomerIdAndSiteId = getSitesByCustomerIdAndSiteId;      

        //Start Custom menu item UI-GRID

        vm.uiGrid0.gridMenuCustomItems = [
                        {
                            title: 'Print',
                            action: vm.print0
                        }
        ];
        vm.uiGrid1.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.print1
                       }
        ];
        vm.uiGrid2.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.print2
                       }
        ];

        vm.uiGridCustomer0.gridMenuCustomItems = [
                      {
                          title: 'Print',
                          action: vm.printCustomer0
                      }
        ];
        vm.uiGridCustomer1.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.printCustomer1
                       }
        ];
        vm.uiGridCustomer2.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.printCustomer2
                       }
        ];

        vm.uiGridCustomerSite0.gridMenuCustomItems = [
                      {
                          title: 'Print',
                          action: vm.printCustomerSite0
                      }
        ];
        vm.uiGridCustomerSite1.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.printCustomerSite1
                       }
        ];
        vm.uiGridCustomerSite2.gridMenuCustomItems = [
                       {
                           title: 'Print',
                           action: vm.printCustomerSite2
                       }
        ];
        //End Custom menu item UI-GRID

        //Getting state params on page load
        if (typeof $stateParams.BookingFleetId !== 'undefined' && typeof $stateParams.BookingId !== 'undefined') {

            // Calling when get StateParam of BookingFleetId for booking fleet history
            vm.getBookingFleetHistory($stateParams.BookingFleetId, $stateParams.BookingId);

        } else if (typeof $stateParams.BookingId !== 'undefined') {
           
            // Calling when get StateParam for Work allocation according to BookingId
            vm.getWorkAllocationByBookingId($stateParams.BookingId, 2);
            vm.stateParamBookingId = $stateParams.BookingId;
        } else if ($state.current.url == "/WorkAllocation") {

            // calling method on load of page            
            vm.getStatusListing('2');
        }

        /**
         * @name getWorkAllocationByBookingId
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getWorkAllocationByBookingId(bookingId, status) {
            vm.waListData = '';
            vm.bcaTableParams = '';

            // declaring variable
            var fromDate;
            var toDate;
            vm.uiGrid0.data = [];
            vm.uiGrid1.data = [];
            vm.uiGrid2.data = [];

            // checking condition of from and to date
            if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "" && vm.resetDate == true) {
                fromDate = "0";
                toDate = "0";
            }
            else {
                var tempFromDate = vm.attributes.FromDate;
                var tempToDate = vm.attributes.ToDate;
                vm.resetDate = false;
                fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
            }

            //Call booking factory get all factories data
            WorkAllocationFactory
                .getWorkAllocationByBookingId(bookingId, status, fromDate, toDate)
                .then(function () {
                    vm.waListData = WorkAllocationFactory.bookingDetail.DataObject;
                    //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.waListData.WorkAllocationList);

                    //START UI-Grid Code
                    if (typeof vm.waListData.WorkAllocationList !== 'undefined') {

                        vm.uiGrid0.data = vm.waListData.WorkAllocationList;
                        vm.uiGrid1.data = vm.waListData.WorkAllocationList;
                        vm.uiGrid2.data = vm.waListData.WorkAllocationList;                       
                    }
                    $timeout(function () {

                        vm.gridApi0.core.handleWindowResize();
                        vm.gridApi1.core.handleWindowResize();
                        vm.gridApi2.core.handleWindowResize();
                    }, 0);
                    //END UI-Grid Code

                });
        }

        /**
          * @name getBookingFleetHistory
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getBookingFleetHistory(fleetId, bookingId) {
            BCAFactory
                .getBookingFleetHistory(fleetId, bookingId)
                 .then(function () {
                     vm.bookingFleetHistory = BCAFactory.bookingFleetHistoryDetail.DataObject;
                     //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.bookingFleetHistory.FleetHistory);
                     vm.uiGridFleetHistory.data = vm.bookingFleetHistory.FleetHistory;
                     console.log(vm.uiGridFleetHistory);
                 });
        }

        /**
         * @name getListing
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getListing() {

            //Call booking factory get all factories data
            vm.bookings = WorkAllocationFactory.getListing();
            vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.bookings);
        }

        /**
         * @name getStatusListing
         * @desc Retrieve factories listing from factory with check the status of the tab
         * @returns {*}
         */
        function getStatusListing(status) {
            vm.waListData = '';
            vm.bcaTableParams = '';

            // declaring variable
            var fromDate;
            var toDate;

            // checking condition of from and to date
            if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "" && vm.resetDate == true) {
                fromDate = "0";
                toDate = "0";
            }
            else {
                var tempFromDate = vm.attributes.FromDate;
                var tempToDate = vm.attributes.ToDate;
                vm.resetDate = false;
                fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
            }

            //Call booking factory get all factories data
            WorkAllocationFactory
                .getListingByStatus(status, fromDate, toDate)
                .then(function () {
                    vm.waListData = WorkAllocationFactory.waStatus;
                    //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.waListData.data.DataList);  

                    //START UI-Grid Code

                    vm.uiGrid0.data = vm.waListData.data.DataList;
                    vm.uiGrid1.data = vm.waListData.data.DataList;
                    vm.uiGrid2.data = vm.waListData.data.DataList;
                    $timeout(function () {

                        vm.gridApi0.core.handleWindowResize();
                        vm.gridApi1.core.handleWindowResize();
                        vm.gridApi2.core.handleWindowResize();
                    }, 0);

                    //END UI-Grid Code

                });
        }

        /**
         * @name getBookingInfo
         * @desc Get details of selected factory from factory.
         */
        function getBookingInfo() {

            //Call factories details factory get factory data
            vm.customerInfo = WorkAllocationFactory.getBookingInfo();
        }

        //Open customer modal
        function addCustomerLabel() {

            //Call factories details factory get factory data
            $scope.modalInstance = $uibModal.open({
                animation: true,
                template: 'Hello wordl',
                size: 'lg',
                scope: $scope
            });
        }

        /**
         * @name getCurrentCustomerBookingList
         * @desc Get details of selected factory from factory.
         */
        function getCurrentCustomerBookingList(customerId, statusValue, fromDate, toDate) {

            //check params 
            if (fromDate == '' && toDate == '') {

                // checking condition of from and to date
                if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "" && vm.resetDate == true) {

                    fromDate = "0";
                    toDate = "0";
                }
                else {

                    var tempFromDate = vm.attributes.FromDate;
                    var tempToDate = vm.attributes.ToDate;
                    vm.resetDate = false;
                    fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                    toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
                }
            }

            $scope.location = $location.path();

            //checking current url for navigation the page according to url
            if ($state.current.url == "/CurrentCustomerFleetList/:CustomerId/:FromDate/:ToDate") {
                BookingDashboardFactory.getCurrentCustomerBooking(customerId, statusValue, fromDate, toDate)
                .then(function () {

                    vm.currentCustomerbookingData = BookingDashboardFactory.currentCustomerFleetLists;
                    //vm.bcaTableParamsCurrentCustomerBooking = UtilsFactory.bcaTableOptions(vm.currentCustomerbookingData.DataObject.CustomerBookingList);
                    vm.customerName = vm.currentCustomerbookingData.DataObject.CustomerName;

                    //START UI-Grid Code
                    vm.uiGridCustomer0.data = (vm.currentCustomerbookingData.DataObject.CustomerBookingList)?vm.currentCustomerbookingData.DataObject.CustomerBookingList:[];
                    vm.uiGridCustomer1.data = (vm.currentCustomerbookingData.DataObject.CustomerBookingList)?vm.currentCustomerbookingData.DataObject.CustomerBookingList:[];
                    vm.uiGridCustomer2.data = (vm.currentCustomerbookingData.DataObject.CustomerBookingList)?vm.currentCustomerbookingData.DataObject.CustomerBookingList:[];

                    $timeout(function () {

                        vm.gridApiCustomer0.core.handleWindowResize();
                        vm.gridApiCustomer1.core.handleWindowResize();
                        vm.gridApiCustomer2.core.handleWindowResize();
                    }, 0);
                    //END UI-Grid Code
                });
            }
            else {

                BookingDashboardFactory.getSitesByCustomerIdAndSiteId(customerId, $stateParams.SiteId, fromDate, toDate, statusValue)
               .then(function () {
                   vm.customerSiteFleetList = BookingDashboardFactory.customerSiteFleetList.Sitelist;
                   vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.customerSiteFleetList);                  
                   vm.customerName = BookingDashboardFactory.customerSiteFleetList.CustomerName;
                   vm.siteName = BookingDashboardFactory.customerSiteFleetList.SiteName;

                   //START UI-Grid Code
                   vm.uiGridCustomerSite0.data = (vm.customerSiteFleetList) ? vm.customerSiteFleetList : [];
                   vm.uiGridCustomerSite1.data = (vm.customerSiteFleetList) ? vm.customerSiteFleetList : [];
                   vm.uiGridCustomerSite2.data = (vm.customerSiteFleetList) ? vm.customerSiteFleetList : [];

                   //console.log(vm.currentCustomerbookingData, vm.uiGridCustomer0, vm.uiGridCustomer1, vm.uiGridCustomer2);
                   $timeout(function () {

                       vm.gridApiCustomerSite0.core.handleWindowResize();
                       vm.gridApiCustomerSite1.core.handleWindowResize();
                       vm.gridApiCustomerSite2.core.handleWindowResize();
                   }, 0);
                   //END UI-Grid Code
               });
            }
        }

        /**
         * click method of tabs
         */
        vm.tabClick = function (status) {
            vm.waListData = {};
            vm.bcaTableParamsCurrentCustomerBooking = {};
            vm.bcaTableParams = {};
            var statusValue = {
                "Pending": "2",
                "Allocated": "3",
                "Completed": "4"
            }
            vm.currentStatus = statusValue[status];
            if (typeof $stateParams.BookingId !== 'undefined') {
                // calling factory using funtion
                vm.getWorkAllocationByBookingId($stateParams.BookingId, statusValue[status]);
            }
            else if (typeof $stateParams.CustomerId !== 'undefined') {                
                vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue[status], '', '');
            }
            else {
                // calling factory using funtion           
                getStatusListing(statusValue[status]);
            }
        }

        /**
         * @name deleteBookingFleet booked fleet detailbookingCustomerDetail
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function deleteBookingFleet (bookingFleetId) {
            console.log("bookingFleetId - LINE: 388", bookingFleetId);
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {

                    //Call ManageJobBookingFactory factory get all factories data
                    BCAFactory
                        .deleteBookingFleet(bookingFleetId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

        /**
        * @name bookingCustomerDetail
        * @desc  calling booking customer detail popup method and popup
        */
        function bookingCustomerDetail(data) {
            $scope.CustomerName = data.CustomerName;
            $scope.ABN = data.CustomerABN;
            $scope.EmailForInvoices = data.EmailForInvoices;
            $scope.ContactNumber = data.ContactNumber;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/BookingCustomerDetail.html',
                scope: $scope,
                controller: 'BookingListCtrl',
                controllerAs: 'blCtrl'
                //controller: ModalInstanceCtrl,
            });
        };

        /**
         * @name fleetAllocation
         * @desc Get details of selected fleet for allocation.
         */
        function fleetAllocation(booking, fleetType) {
            
            $scope.fleetActionFrom = "";
            $scope.duplicate = false;

            //Check request for allocation of fleet
            if (fleetType == "new") {

                vm.fleetType = "new";
                vm.bookingId = $stateParams.BookingId;
                $scope.bookingFleetId = '';
            } else {

                //check request is rellocation or duplicate
                if (fleetType == "reallocation") {

                    vm.show = true;
                    vm.fromAllocation = true;
                    $scope.fleetActionFrom = "workAllocation";
                } else if (fleetType == "duplicate") {

                    $scope.duplicate = true;
                }

                vm.bookingId = booking.BookingId;                
                $scope.bookingFleetId = booking.BookingFleetId;                
            }

            $scope.show = vm.show;

            //call model for the request
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/JobBookingFleetDetail.html',
                size: 'lg',
                controller: ManageBookingFleetCtrl,
                controllerAs: 'mbfCtrl',
                scope: $scope
            });
        };

        /**
         * @name getBookingFleetDetail booked fleet detail
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getBookingFleetDetail(bookingFleetId) {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getBookingFleetDetail(bookingFleetId)
                .then(function () {
                    vm.bookingFleetDetail = BCAFactory.bookingFleetDetail.DataObject;

                    //asign dataobject to attributes
                    vm.attributes.BookingFleet.FleetTypeId = vm.bookingFleetDetail.FleetTypeId;
                    vm.attributes.BookingFleet.FleetRegistrationId = vm.bookingFleetDetail.FleetRegistrationId;
                    vm.attributes.BookingFleet.DriverId = vm.bookingFleetDetail.DriverId;
                    vm.attributes.BookingFleet.IsDayShift = vm.bookingFleetDetail.IsDayShift;
                    vm.attributes.BookingFleet.Iswethire = vm.bookingFleetDetail.Iswethire.toString();
                    vm.attributes.BookingFleet.AttachmentIds = vm.bookingFleetDetail.AttachmentIds;
                    vm.attributes.BookingFleet.NotesForDrive = vm.bookingFleetDetail.NotesForDrive;
                    vm.attributes.BookingFleet.FleetBookingDateTime = new Date(vm.bookingFleetDetail.FleetBookingDateTime);
                    vm.attributes.BookingFleet.FleetBookingEndDate = new Date(vm.bookingFleetDetail.FleetBookingEndDate);
                    vm.attributes.BookingFleet.IsfleetCustomerSite = vm.bookingFleetDetail.IsfleetCustomerSite;
                    vm.attributes.BookingFleet.Reason = vm.bookingFleetDetail.Reason;

                });
        }

        /**
          * @name getFleetypes for dropdown
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getFleetypes() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getFleetTypesDDL()
                .then(function () {
                    vm.fleetTypeDropdownList = BCAFactory.fleetTypeList.DataList;
                });
        }

        // calling the method on page load
        vm.getFleetypes();

        /**
         * @name manageBooking for add and update
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function manageFleetBooking() {

            // checking selected checkbox
            var log = [];
            angular.forEach(vm.check, function (value, key) {
                if (value == true) {
                    this.push(key);
                }
            }, log);
            vm.attributes.BookingFleet.BookingId = vm.bookingId;
            vm.attributes.BookingFleet.AttachmentIds = log.toString();

            // For Add new Fleet
            if ((typeof vm.bookingFleetId == 'undefined') || vm.bookingFleetId == '' || vm.bookingFleetId == '0') {

                BCAFactory
                       .addBookingFleet(vm.attributes)
                       .then(function () {
                           // Calling when get StateParam of BookingId
                       });
                $state.reload();
            }
            else { // For Rellocation of the fleet

                vm.attributes.BookingFleet.BookingFleetId = vm.bookingFleetId;
                BCAFactory
                     .updateBookingFleet(vm.attributes)
                     .then(function () {
                         vm.tabClick("Allocated");
                         // $state.reload();
                     });
            }
        }

        /**
          * @name fleetComplete
          * @desc Change status allocation to complete
          */
        function fleetComplete (bookingFleetId) {
            vm.bookingFleetStatus.BookingFleetId = bookingFleetId;
            vm.bookingFleetStatus.StatusValue = 4;
            BCAFactory
                .updateBookingFleetStatus(vm.bookingFleetStatus)
                .then(function () {
                    vm.tabClick("Allocated");
                    //$state.reload();
                });
        }

        /**
          * @name getAttachments for dropdown
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getAttachments() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getAttachmentsChk()
                .then(function () {
                    vm.attachementList = BCAFactory.attachementList.DataObject;
                });
        }

        // method call on Ctrl load
        vm.getAttachments();

        //Close allocation popup
        vm.cancel = function () {
            vm.bookingId = '';
            $scope.modalInstance.dismiss();
        };

        $scope.goBack = function () {
            window.history.back();
        };

        /* Call getListing method to show the factories data list */
        vm.getListing();

        //START print Custome function 
        //booked-in = print0
        function print0(data) {
            printGrid(data, 'grid0');
        }
        function printCustomer0(data) {
            printGrid(data, 'gridCustomer0');
        }
        function printCustomerSite0(data) {
            printGrid(data, 'gridCustomerSite0');
        }

        //allocated = print1 
        function print1(data) {
            printGrid(data, 'grid1');
        }
        function printCustomer1(data) {
            printGrid(data, 'gridCustomer1');
        }
        function printCustomerSite1(data) {
            printGrid(data, 'gridCustomerSite1');
        }

        //completed = print2
        function print2(data) {
            printGrid(data, 'grid2');
        }
        function printCustomer2(data) {
            printGrid(data, 'gridCustomer2');
        }
        function printCustomerSite2(data) {
            printGrid(data, 'gridCustomerSite2');
        }

        /**
       * @name printGrid
       * @desc print Grid List
       * @returns {*}
       */
        function printGrid(data, gridType) {
          
            //variable declaration
            var gridColumnData, gridData;

            //Check grid type (booked-in = grid0, allocated = grid1 or completed = grid2)
            if (gridType === 'grid0') {

                gridData = vm.uiGrid0.data;
                gridColumnData = vm.gridApi0;
            } else if (gridType === 'grid1') {

                gridData = vm.uiGrid1.data;
                gridColumnData = vm.gridApi1;
            } else if (gridType === 'grid2') {               

                gridData = vm.uiGrid2.data;
                gridColumnData = vm.gridApi2;
            } else if (gridType === 'gridCustomer0') {

                gridData = vm.uiGridCustomer0.data;
                gridColumnData = vm.gridApiCustomer0;
            }  else if (gridType === 'gridCustomer1') {

                gridData = vm.uiGridCustomer1.data;
                gridColumnData = vm.gridApiCustomer1;
            } else if (gridType === 'gridCustomer2') {

                gridData = vm.uiGridCustomer0.data;
                gridColumnData = vm.gridApiCustomer0;
            } else if (gridType === 'gridCustomerSite0') {

                gridData = vm.uiGridCustomerSite1.data;
                gridColumnData = vm.gridApiCustomerSite0;
            } else if (gridType === 'gridCustomerSite1') {

                gridData = vm.uiGridCustomerSite1.data;
                gridColumnData = vm.gridApiCustomerSite1;
            }
            else {
                gridData = vm.uiGridCustomerSite2.data;
                gridColumnData = vm.gridApiCustomerSite2;
            }

            //console.log(gridColumnData, gridData, gridColumnData.grid.moveColumns.orderCache.length, gridColumnData.grid.columns[1].field);          

            //Set current status by default "Allocated"
            if (typeof vm.currentStatus == 'undefined')
                vm.currentStatus = 2;

            var innerContents =  UtilsFactory.printTableHTML(gridColumnData, gridData);            

            var popupWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWindow.document.open();
            popupWindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
            popupWindow.focus();
            popupWindow.document.close();
            //popupWindow.focus();
            //popupWindow.print();
            //popupWindow.close();

        }
        
        //END print Custome function
       

        //Call on page load currentCustomerFleetList.html
        vm.initCurrentCustomer = function () {

            vm.attributes.FromDate = UtilsFactory.tryParseDateFromString($stateParams.FromDate);
            vm.attributes.ToDate = UtilsFactory.tryParseDateFromString($stateParams.ToDate);
            if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {

                vm.attributes.FromDate = new Date();
                vm.attributes.ToDate = new Date();
            }
            vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue["Pending"], $stateParams.FromDate, $stateParams.ToDate);
        }

        //Call on page load currentCustomerSiteBookingList.html
        vm.initCurrentCustomerSite = function () {

            vm.attributes.FromDate = UtilsFactory.tryParseDateFromString($stateParams.FromDate);
            vm.attributes.ToDate = UtilsFactory.tryParseDateFromString($stateParams.ToDate);
            if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {

                vm.attributes.FromDate = new Date();
                vm.attributes.ToDate = new Date();
            }
            vm.currentStatus = statusValue[status];
            vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue["Pending"], $stateParams.FromDate, $stateParams.ToDate);
        }

        /**
        * @name getSitesByCustomerIdAndSiteId
        * @desc get the detail of driver and fleet by customerId n siteId
        */
        function getSitesByCustomerIdAndSiteId() {
            // declaring variable
            var fromDate;
            var toDate;

            // checking condition of from and to
            if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {
                fromDate = "0";
                toDate = "0";
                //vm.attributes.ToDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            }
            else {
                var tempFromDate = vm.attributes.FromDate;
                var tempToDate = vm.attributes.ToDate;
                fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
            }

            BookingDashboardFactory.getSitesByCustomerIdAndSiteId($stateParams.CustomerId, $stateParams.SiteId, fromDate, toDate, $stateParams.Status)
            .then(function () {
                vm.customerSiteFleetList = BookingDashboardFactory.customerSiteFleetList.Sitelist;
                vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.customerSiteFleetList);
                //console.log('vm.bcaTableParams', vm.bcaTableParams)
                vm.customerName = BookingDashboardFactory.customerSiteFleetList.CustomerName;
                vm.siteName = BookingDashboardFactory.customerSiteFleetList.SiteName;
            });
        }

        // event will invoke on the load of customersitefleetBooking page
        vm.customerSiteLoad = function () {
            vm.getSitesByCustomerIdAndSiteId();
        }

        /**
        * click method for go event with date filter
        */
        vm.fiterdData = function (fromReset) {
            if (typeof fromReset == 'undefined' && (vm.attributes.FromDate == "" || vm.attributes.ToDate == "")) {

                vm.dateRangeError = true;
            } else {

                vm.dateRangeError = false;
                // checking currentStatus param is empty or not
                if (vm.currentStatus == undefined || vm.currentStatus == "") {
                    vm.currentStatus = 2;
                }
                if (vm.currentStatus.length == 1) {
                    // calling factory using funtion( directly passing the value from scope)
                    vm.getCurrentCustomerBookingList($stateParams.CustomerId, vm.currentStatus, '', '');
                }
                else {
                    // calling factory using funtion(getting value from text)
                    vm.getCurrentCustomerBookingList($stateParams.CustomerId, vm.currentStatus, '', '');
                }
            }
        }

        /**
           * click method for go event with date filter for work allocation
           */
        vm.fiterdWorkAllocationData = function (fromReset) {
           if (typeof fromReset == 'undefined' && (vm.attributes.FromDate == "" || vm.attributes.ToDate == "")) {

                vm.dateRangeError = true;
            } else {
               vm.dateRangeError = false;

                // checking currentStatus param is empty or not
                if (vm.currentStatus == undefined || vm.currentStatus == "") {
                    vm.currentStatus = 2;
                }
                
                //Check if tab already selected
                if (vm.currentStatus.length == 1) {

                    // calling factory using funtion( directly passing the value from scope)                
                    if (typeof $stateParams.BookingId !== 'undefined') {

                        // calling factory using funtion
                        vm.getWorkAllocationByBookingId($stateParams.BookingId, vm.currentStatus);
                    } else {

                        vm.getStatusListing(vm.currentStatus);
                    }
                }
                else {

                    // calling factory using funtion(getting value from text)                
                    if (typeof $stateParams.BookingId !== 'undefined') {

                        // calling factory using funtion
                        vm.getWorkAllocationByBookingId($stateParams.BookingId, vm.currentStatus);
                    } else {
                        vm.getStatusListing(vm.currentStatus);
                    }
                }
            }
        }

        /**
          * Reset date filter for all current Fleet listing pages which are come from dashboard
          */
        vm.resetFilterDate = function () {
            vm.attributes.FromDate = "";
            vm.attributes.ToDate = "";
            vm.resetDate = true;
            vm.fiterdData("reset");
        }

        /**
           * Reset date filter for work allocation page
           */
        vm.resetWorkAllocationFilterDate = function () {
            vm.attributes.FromDate = "";
            vm.attributes.ToDate = "";
            vm.resetDate = true;
            vm.fiterdWorkAllocationData("reset");
        }

        /**
         * @name sendEmail
         * @desc click function for sending Email
         * @returns {*}
         */
        vm.sendEmail = function (data) {

            vm.sendEmailResponse = BCAFactory.sendAttachment(data);
            console.log(vm.sendEmailResponse);
            console.log(JSON.stringify(data));
        }
    }

    //Inject required stuff as parameters to factories controller function
    NewJobCtrl.$inject = ['$scope', '$uibModal', '$state'];

    /**
     * @name NewJobCtrl
     * @desc call from main menu to add new job and refresh the page
     * @param $scope
     * @param $uibModal  
     * @param $state
     */
    function NewJobCtrl($scope, $uibModal, $state) {

        //Assign controller scope pointer to a variable
        var vm = this;

        //method
        vm.addNewJob = addNewJob;
        vm.refreshPage = refreshPage;

        /**
        * @name addNewJob
        * @desc call popup for booking new job
        * @returns {*}
        */
        function addNewJob() {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/JobBookingDetail.html',
                size: 'lg',
                controller: JobBookingCtrl,
                controllerAs: 'jbCtrl',
                scope: $scope
            });
        }

        /**
       * @name refreshPage
       * @desc Call for refresh the currnt page
       * @returns {*}
       */
        function refreshPage() {
           
            $state.go($state.current.name);           
        }
    }

    //Inject required stuff as parameters to factories controller function
    JobBookingCtrl.$inject = ['$scope', 'BCAFactory', 'ManageJobBookingFactory', 'ManageBookingSiteFactory', 'UtilsFactory', '$filter', '$timeout', 'NotificationFactory', '$state'];

    /**
    * @name JobBookingCtrl
    * @desc create a new job 
    * @param $scope
    * @param BCAFactory
    * @param ManageJobBookingFactory
    * @param ManageBookingSiteFactory
    * @param UtilsFactory
    * @param $filter 
    * @param $timeout
    * @param NotificationFactory
    * @param $state
    */
    function JobBookingCtrl($scope, BCAFactory, ManageJobBookingFactory, ManageBookingSiteFactory, UtilsFactory, $filter, $timeout, NotificationFactory, $state) {

        //Variable declaration and initialization
        var vm = this;
        vm.siteId = '';
        vm.customerId = '';
        vm.minDate = new Date();
        vm.customerAttribute = '';
        vm.siteAttribute = '';
        vm.supervisorAttribute = '';
        vm.gateAttribute = '';
        vm.contactAttribute = '';
        vm.showDropdown = false;
        vm.count = 0;
        vm.countPartial = 0;
        vm.minFleetDate = new Date();
        vm.maxFleetDate = new Date();
        vm.showDateTimePicker = true;
        //vm.maxCount = false; 

        vm.check = true;
        //vm.checkMaxDate = true;

        //Object initialization
        vm.validField = {
            validFleetFromDate: false,
            validFleetToDate: false,
            validWorkType: false,
            validFleetAvailable: false,
            validFleetType: false,
            validFleetCount: false,
            maxCount: false,
            validFleetList: false
        };
        vm.attributes = {
            CallingDateTime: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
            FleetBookingDateTime: new Date(),
            EndDate: new Date(),
            WorktypeId: '',
            AllocationNotes: '',
            SupervisorId: '',
            GateContactPersonId: '',
            GateId: '',
            Fleet: [],
            IsActive: true
        };
        vm.fleetDetailAttribute = {
            fleetFromDate: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
            fleetToDate: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
            fleetAvailableTypeObj: '',
            workTypeObj: '',
            fleetTypeObj: null,
            notesForDrive: '',
            iswethire: true,
            isDayShift: 0,
            fleetCount: 0
        };       
        vm.fleetRegistrationId = {};
        vm.supervisorGateDetail = {};

        //Array initialization
        vm.fleetRegistrationArray = [];
        vm.addFleets = [];
        vm.addFleetDetails = [];
        vm.workTypeDropdownList = [];
        vm.fleetTypeDropdownList = [];
        vm.totalAllocatedFleet = [];
        vm.customerList = [];
        vm.siteList = [];
        vm.fleetAvailableTypeDropdownList = [
            { Id: 1, Text: 'Full' },
            { Id: 2, Text: 'Partial' }
        ];

        //Method
        vm.getCustomerList = getCustomerList;
        vm.getSiteList = getSiteList;
        vm.changeCustomer = changeCustomer;
        vm.changeSite = changeSite;
        vm.getFleetypes = getFleetypes;
        vm.getWorkType = getWorkType;
        vm.getContactDetail = getContactDetail;
        vm.getAvailableFleets = getAvailableFleets;
        vm.addMoreFleet = addMoreFleet;
        vm.deleteFleetRows = deleteFleetRows;
        vm.manageFleetBooking = manageFleetBooking;
        vm.startDateChange = startDateChange;
        vm.endDateChange = endDateChange;
        vm.setMinEndDate = setMinEndDate;
        vm.fromDateChange = fromDateChange;
        vm.openFleetFromDateCalendar = openFleetFromDateCalendar;
        vm.openFleetToDateCalendar = openFleetToDateCalendar;

        
        /**
         * Reset fleet date range
         */
        vm.resetFleetDateRange = function () {
            vm.fleetDetailAttribute.fleetFromDate = "";
            vm.fleetDetailAttribute.fleetToDate = "";
        }

        /**
          * Reset booking date range
          */
        vm.resetBookingDateRange = function () {
            vm.attributes.FleetBookingDateTime = "";
            vm.attributes.EndDate = "";
        }


        //Set min date of fleetFromDate
        function startDateChange(startDate) {
            vm.check = false;
            vm.showDateTimePicker = false;
            vm.minFleetDate = startDate;
            vm.fleetDetailAttribute.fleetFromDate = $filter('date')(startDate, 'dd-MM-yyyy hh:mm a');
            vm.fleetDetailAttribute.fleetToDate = $filter('date')(startDate, 'dd-MM-yyyy hh:mm a');
            vm.attributes.EndDate = startDate;
            vm.showDateTimePicker = true;
            $timeout(function () {
                vm.check = true;
            }, 100);
        }

        //Set max date of fleetFromDate
        function endDateChange(endDate) {
            vm.fleetDetailAttribute.fleetToDate = $filter('date')(endDate, 'dd-MM-yyyy hh:mm a');
            vm.check = false;
            vm.maxFleetDate = endDate;
            $timeout(function () {
                vm.check = true;
            }, 100);
        }

        //Set Max date of fleetToDate
        function fromDateChange(fromDate) {

            var splitedDate = fromDate;
            var newSplited = splitedDate.split("-");
            var a = new Date(newSplited[1] + "/" + newSplited[0] + "/" + newSplited[2]);
            vm.minStartDate = a.toUTCString();           
        }

        //Open fleet calendar
        function openFleetFromDateCalendar() {

            $('#fleetFromDateTime').focus();
        }

        //Open fleet calendar
        function openFleetToDateCalendar() {

            $('#fleetToDateTime').focus();
        }

        //check if customerId is not exist then showing the customer dropdown
        if (typeof $scope.customerId !== 'undefined' && $scope.customerId !== '') {
            vm.customerId = $scope.customerId;
        } else {
            vm.showDropdown = true;
        }

        //check if siteId is not exist then showing the customer dropdown
        if (typeof $scope.siteId !== 'undefined' && $scope.siteId !== '') {
            vm.siteId = $scope.siteId;
        } else {
            vm.showDropdown = true;
        }

        // change event of FleetBookingDateTime
        function setMinEndDate(callingDateTime) {
            var splitedDate = callingDateTime;
            var newSplited = splitedDate.split("-");
            var a = new Date(newSplited[1] + "/" + newSplited[0] + "/" + newSplited[2]);
            vm.minEndDate = a.toUTCString();
        }

        /**
          * @name getCustomerList           
          * @desc Get all Customer from db
          * @returns {*}         
          */
        function getCustomerList() {
            BCAFactory.getCustomersDDL()
            .then(function () {
                vm.customerList = BCAFactory.customerList.DataList;
            });
        }

        /**
          * @name getSiteList           
          * @desc Get list of site by customer Id from db
          * @returns {*}         
          */
        function getSiteList(customerId) {
            BCAFactory.getSitesByCustomerIdDDL(customerId)
            .then(function () {
                vm.siteList = BCAFactory.siteList.DataList;
            });
        }

        //call on page load
        vm.getCustomerList();

        /**
           * @name changeCustomer           
           * @desc Get list of Site according to selected customer from db
           * @returns {*}         
           */
        function changeCustomer(coustomerId) {
            vm.bcaTableParams = UtilsFactory.bcaTableOptions('');
            if (typeof coustomerId !== 'undefined') {
                vm.customerId = coustomerId;
                vm.getSiteList(coustomerId);
            }
            else {
                vm.siteList = "";
            }
        }

        /**
          * @name changeSite           
          * @desc Get list of changeSite according to selected site from db
          * @returns {*}         
          */
        function changeSite(siteId) {            
            if (typeof siteId !== 'undefined' && siteId !== '') {
                vm.siteId = siteId;
                vm.getSupervisorGateDetailBySiteId(siteId);
            }
        }

        /**
        * @name getWorkType for dropdown
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getWorkType() {

            //Call BCAFactory factory get all factories data
            BCAFactory
            .getWorkTypesDDL()
            .then(function () {

                vm.workTypeDropdownList = BCAFactory.workTypeList.DataList;
            });
        }

        //calling the method on page load
        vm.getWorkType();

        /**
         * @name getFleetypes for dropdown
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getFleetypes() {

            //Call BCAFactory factory get all factories data
            BCAFactory
            .getFleetTypesDDL()
            .then(function () {

                vm.fleetTypeDropdownList = BCAFactory.fleetTypeList.DataList;
            });
        }

        //calling the method on page load
        vm.getFleetypes();      

        /**
         * @name getFleetRegistrations for dropdown
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getFleetRegistrations() {
            console.log(vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId, vm.fleetDetailAttribute.fleetFromDate, vm.fleetDetailAttribute.fleetToDate);
            vm.fleetRegistrationId = {};

                if (vm.fleetDetailAttribute.fleetTypeObj !== null) {
                    vm.fleetData = {
                        FleetTypeId: vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId,
                        FleetBookingDateTime: vm.fleetDetailAttribute.fleetFromDate,
                        FleetBookingEndDate: vm.fleetDetailAttribute.fleetToDate,
                    }

                    //Call BCAFactory factory get all factories data
                    ManageJobBookingFactory
                    .getFleetRegistrationsByFleetTypeId(vm.fleetData)
                    .then(function () {
                        vm.fleetRegistrationList = ManageJobBookingFactory.fleetRegistrationDetail.DataObject;
                        console.log(vm.fleetRegistrationList, Object.getOwnPropertyNames(vm.fleetRegistrationList).length);
                        vm.count = 0;
                        vm.countPartial = 0;

                        //Remove available fleets which already allocated  
                        if (Object.getOwnPropertyNames(vm.fleetRegistrationList).length !== 0) {
                            for (var i = vm.fleetRegistrationList.FullyAvailableFleet.length - 1; i >= 0; i--) {
                                vm.count++;

                                //Splice allocated fleets from main list
                                if (vm.totalAllocatedFleet.length > 0) {

                                    if (vm.totalAllocatedFleet.indexOf(vm.fleetRegistrationList.FullyAvailableFleet[i].FleetRegistrationId) !== -1) {
                                        --vm.count;
                                        vm.fleetRegistrationList.FullyAvailableFleet.splice(i, 1);
                                    }
                                }
                            }

                            //Remove available fleets which already allocated 
                            for (var i = vm.fleetRegistrationList.PartiallyAvailableFleet.length - 1; i >= 0; i--) {
                                vm.countPartial++;

                                //Splice allocated fleets from main list
                                if (vm.totalAllocatedFleet.length > 0) {

                                    if (vm.totalAllocatedFleet.indexOf(vm.fleetRegistrationList.PartiallyAvailableFleet[i].FleetRegistrationId) !== -1) {
                                        --vm.countPartial;
                                        vm.fleetRegistrationList.PartiallyAvailableFleet.splice(i, 1);
                                    }
                                }
                            }
                            //vm.fleetDetailAttribute.fleetCount = vm.count;
                        }
                                          
                    });
                } else {
                    vm.fleetRegistrationList = {};
                }
        }

        // method call on change of fleet type dropdown
        function getAvailableFleets() {
           
            console.log(vm.fleetDetailAttribute.fleetTypeObj);
            if (vm.fleetDetailAttribute.fleetFromDate !== '' && vm.fleetDetailAttribute.fleetToDate !== '' && vm.fleetDetailAttribute.fleetTypeObj !== null) {
                vm.validField.maxCount = false;
                vm.validField.validFleetCount = false;

                //calling list of fleet registration according to fleet type
                getFleetRegistrations();
            } else {
                vm.fleetRegistrationList = {};
            }
        }

        /**
         * @name getContactDetail
         * @desc Retrieve contact list from the factory
         * @return {*}
         */
        function getContactDetail(gateId) {

            //check gateId is exist or not
            if (gateId) {

                ManageBookingSiteFactory
               .getContactPersons(gateId)
               .then(function () {
                   vm.contactList = ManageBookingSiteFactory.contactDetail.DataList;
               });
            } else {

                //reinitialize to contact list of gatId if gate not exist
                vm.contactList = {};
            }
        }

        /**
         * @name getSupervisorGateDetailBySiteId
         * @desc Retrieve list of get Supervisor Gate Detail By SiteId from the factory
         * @return {*}
         */
        vm.getSupervisorGateDetailBySiteId = function (siteId) {

            if (siteId != '') {
                ManageJobBookingFactory
                .getSupervisorGateDetailBySiteId(siteId)
                .then(function () {

                    vm.supervisorGateDetail = ManageJobBookingFactory.getSupervisorGateDetail.DataObject;
                });
            }
        }

        //Call on page load
        vm.getSupervisorGateDetailBySiteId(vm.siteId);

        /**
        * @name objectSize
        * @desc Check object size
        * @return {size}
        */
        vm.objectSize = function (obj) {

            var size = 0, key;
            for (key in obj) {

                if (vm.fleetRegistrationId[key]) {
                    size++;
                }
            }
            return size;
        }

        /**
           * @name deleteFleetRows
           * @desc Delete record from temporary stored fleet detail into array
           * @return {*}
           */
        function deleteFleetRows(index) {

            //Check allocated fields
            if (vm.totalAllocatedFleet.indexOf(vm.addFleets[index].FleetRegistrationId) !== -1) {

                vm.totalAllocatedFleet.splice(vm.totalAllocatedFleet.indexOf(vm.addFleets[index].FleetRegistrationId), 1);
            }
            vm.addFleets.splice(index, 1);
            vm.getAvailableFleets();
        }

        /**
       * @name checkValidation
       * @desc check validation on temporary store fleet detail
       * @return {*}
       */
        vm.checkValidation = function (field, fieldName) {
            if (fieldName === 'workType') {
               
                vm.validField.validWorkType = (vm.fleetDetailAttribute.workTypeObj === '') ? true : false;
            } else if (fieldName === 'fleetAvailableType') {
               
                vm.validField.validFleetAvailable = (vm.fleetDetailAttribute.fleetAvailableTypeObj === '') ? true : false;
            } else if (fieldName === 'fromDate') {

                vm.validField.validFleetFromDate = (vm.fleetDetailAttribute.fleetFromDate === null) ? true : false;
            } else if (fieldName === 'toDate') {

                vm.validField.validFleetToDate = (vm.fleetDetailAttribute.fleetToDate === null) ? true : false;
            } else if (fieldName === 'fleetType') {

                vm.validField.validFleetType = (vm.fleetDetailAttribute.fleetTypeObj === null || typeof vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId === "undefined") ? true : false;
            } else if (fieldName === 'fleetCount') {

                vm.validField.validFleetCount = (vm.fleetDetailAttribute.fleetCount === 0 || vm.fleetDetailAttribute.fleetCount === null) ? true : false;
            }
        }

        /**
        * @name checkCount
        * @desc Check fleet count and available fleet count and compare them
        * @return {*}
        */
        vm.checkCount = function (fleetRegistrationObj) {           

            var ifExist = false;

            //push registration object if already not exist into array
            if (typeof fleetRegistrationObj != 'undefined') {
                if(vm.fleetRegistrationArray.length > 0){
                    for (var i = vm.fleetRegistrationArray.length - 1; i >= 0; i--) {
                        if (vm.fleetRegistrationArray[i].FleetRegistrationId === fleetRegistrationObj.FleetRegistrationId) {
                            ifExist = true;
                        }
                    }
                    if (!ifExist) vm.fleetRegistrationArray.push(fleetRegistrationObj);                    
                } else vm.fleetRegistrationArray.push(fleetRegistrationObj);
               
            }           
          
            vm.validField.maxCount = false;
            vm.objectLength = '';
            vm.objectLength = vm.objectSize(vm.fleetRegistrationId);
            
            // check selected fleets is not more than fleet count input value
            if (vm.objectLength > vm.fleetDetailAttribute.fleetCount) {

                vm.validField.maxCount = true;
            } else {

                vm.validField.maxCount = false;
            }            
        }

        /**
        * @name addMoreFleet
        * @desc Temporary store fleet detail into array
        * @return {*}
        */
        function addMoreFleet() {
            console.log(vm.fleetDetailAttribute.workTypeObj, vm.fleetDetailAttribute.fleetAvailableTypeObj);
            
            // Apply check for existance
            if ((vm.fleetDetailAttribute.workTypeObj !== '' && vm.fleetDetailAttribute.workTypeObj !== null)
                && (vm.fleetDetailAttribute.fleetAvailableTypeObj !== '' && vm.fleetDetailAttribute.fleetAvailableTypeObj !== null)
                && (vm.fleetDetailAttribute.fleetTypeObj !== null && vm.fleetDetailAttribute.fleetTypeObj.hasOwnProperty('FleetTypeId'))
                && vm.fleetDetailAttribute.fleetFromDate != null
                && vm.fleetDetailAttribute.fleetToDate != null
                && vm.fleetDetailAttribute.fleetCount != ""
                && vm.fleetDetailAttribute.fleetCount != null
                && !vm.validField.maxCount) {
                
                //Check Date validation
                //convert fleet booking datetime string to date object
                var fromDate = moment(vm.fleetDetailAttribute.fleetFromDate.replace(/-/g, "/"), 'DD/MM/YYYY hh:mm a')._d;
                var toDate = moment(vm.fleetDetailAttribute.fleetToDate.replace(/-/g, "/"), 'DD/MM/YYYY hh:mm a')._d;

                //copy of the object into another variable
                var fromDateSetHours = angular.copy(fromDate);
                var toDateSetHours = angular.copy(toDate);               

                // Set hours to zero for only date comparison
                vm.attributes.FleetBookingDateTime.setHours(0, 0, 0, 0);
                vm.attributes.EndDate.setHours(0, 0, 0, 0);
                fromDateSetHours.setHours(0, 0, 0, 0);
                toDateSetHours.setHours(0, 0, 0, 0)
                
                // Compare FleetStart date to FleetEnd date, Booking Start and Booking End date 
                if (fromDate >= toDate) {

                    NotificationFactory.error("From date should be less than to Todate");
                    return false;
                    
                } else if ((fromDateSetHours < vm.attributes.FleetBookingDateTime || fromDateSetHours > vm.attributes.EndDate) || (toDate <= fromDate || toDateSetHours > vm.attributes.EndDate)) {

                    NotificationFactory.error("From date is not into the range of booking Start date and End date");
                    return false;
                } else {

                    vm.addFleetDetails.push({
                        'FleetWorkType': vm.fleetDetailAttribute.workTypeObj,
                        'FleetAvailableFleetType': vm.fleetDetailAttribute.fleetAvailableTypeObj,
                        'FleetTypeId': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId,
                        'FleetTypeName': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeName,
                        'FleetFromDate': $filter('date')(vm.fleetDetailAttribute.fleetFromDate, 'yyyy-MM-dd hh:mm a'),
                        'FleetToDate': $filter('date')(vm.fleetDetailAttribute.fleetToDate, 'yyyy-MM-dd'),
                        'FleetCount': vm.fleetDetailAttribute.fleetCount,
                        'NotesForDrive': vm.fleetDetailAttribute.notesForDrive,
                        'IsDayShift': vm.fleetDetailAttribute.isDayShift,
                        'Iswethire': vm.fleetDetailAttribute.iswethire,
                        'AllocatedFleets': Object.keys(vm.fleetRegistrationId).map(function (k) { return k }).join(",")
                    });

                    // Create number of objects according to user input of fleet count
                    if (vm.fleetDetailAttribute.fleetCount > 0) {

                        for (var i = 0; i < vm.fleetDetailAttribute.fleetCount; i++) {

                            //Check fleetRegistrations are allocated or not
                            if (typeof Object.keys(vm.fleetRegistrationId)[i] !== "undefined") {
                                var fleetRegistrationNumber = '';
                                vm.totalAllocatedFleet.push(Object.keys(vm.fleetRegistrationId)[i]);

                                //Store selected registration number                                
                                for (var j = vm.fleetRegistrationArray.length - 1; j >= 0; j--) {
                                   
                                    if (vm.fleetRegistrationArray[j].FleetRegistrationId === Object.keys(vm.fleetRegistrationId)[i] && Object.values(vm.fleetRegistrationId)[i]) {
                                        fleetRegistrationNumber = vm.fleetRegistrationArray[j].RegistrationNumber;
                                    }
                                }
                                vm.addFleets.push({
                                    'WorktypeId': vm.fleetDetailAttribute.workTypeObj,
                                    'AvailableType': vm.fleetDetailAttribute.fleetAvailableTypeObj,
                                    'FleetTypeId': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId,
                                    'FleetTypeName': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeName,
                                    'FleetBookingDateTime': vm.fleetDetailAttribute.fleetFromDate,
                                    'FleetBookingEndDate': vm.fleetDetailAttribute.fleetToDate,
                                    'FleetCount': vm.fleetDetailAttribute.fleetCount,
                                    'NotesForDrive': vm.fleetDetailAttribute.notesForDrive,
                                    'IsDayShift': vm.fleetDetailAttribute.isDayShift,
                                    'Iswethire': vm.fleetDetailAttribute.iswethire,
                                    'FleetRegistrationId': Object.keys(vm.fleetRegistrationId)[i],
                                    'FleetRegistrationNumber': ((fleetRegistrationNumber !== '') ? fleetRegistrationNumber : ''),
                                    'FleetDetailIndex': vm.addFleetDetails.length - 1
                                });

                            } else {

                                vm.addFleets.push({
                                    'WorktypeId': vm.fleetDetailAttribute.workTypeObj,
                                    'AvailableType': vm.fleetDetailAttribute.fleetAvailableTypeObj,
                                    'FleetTypeId': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeId,
                                    'FleetTypeName': vm.fleetDetailAttribute.fleetTypeObj.FleetTypeName,
                                    'FleetBookingDateTime': vm.fleetDetailAttribute.fleetFromDate,
                                    'FleetBookingEndDate': vm.fleetDetailAttribute.fleetToDate,
                                    'FleetCount': vm.fleetDetailAttribute.fleetCount,
                                    'NotesForDrive': vm.fleetDetailAttribute.notesForDrive,
                                    'IsDayShift': vm.fleetDetailAttribute.isDayShift,
                                    'Iswethire': vm.fleetDetailAttribute.iswethire,
                                    'FleetRegistrationId': '',
                                    'FleetDetailIndex': vm.addFleetDetails.length - 1
                                });
                            }
                        }// End For loop

                        //Reinitialize to fleetDetailAttribute object
                        vm.fleetDetailAttribute = {
                            workTypeObj: '',
                            fleetAvailableTypeObj: '',
                            fleetTypeObj: {},
                            fleetFromDate: $filter('date')(vm.attributes.FleetBookingDateTime, 'dd-MM-yyyy hh:mm a'),
                            fleetToDate: $filter('date')(vm.attributes.EndDate, 'dd-MM-yyyy hh:mm a'),
                            fleetTypeId: '',
                            fleetCount: 0,
                            notesForDrive: '',
                            isDayShift: 0,
                            iswethire: true
                        };
                        vm.fleetRegistrationList = {};
                        vm.count = 0;
                        vm.countPartial = 0;
                    } //End second Outer If
                }

            } else { //End first Outer If

                vm.validField = {
                    validWorkType: false,
                    validFleetAvailable: false,
                    validFleetFromDate: false,
                    validFleetToDate: false,
                    validFleetType: false,
                    validFleetCount: false,
                    maxCount: false
                };
                vm.validField.validWorkType = (vm.fleetDetailAttribute.workTypeObj !== '') ? false : true;
                vm.validField.validFleetAvailable = (vm.fleetDetailAttribute.fleetAvailableTypeObj !== '') ? false : true;
                vm.validField.validFleetFromDate = (vm.fleetDetailAttribute.fleetFromDate == "") ? true : false;
                vm.validField.validFleetToDate = (vm.fleetDetailAttribute.fleetToDate == "") ? true : false;
                vm.validField.validFleetType = (vm.fleetDetailAttribute.fleetTypeObj !== null && vm.fleetDetailAttribute.fleetTypeObj.hasOwnProperty('FleetTypeId')) ? false : true;
                vm.validField.validFleetCount = (vm.fleetDetailAttribute.fleetCount == null || vm.fleetDetailAttribute.fleetCount == 0) ? true : false;
            }
            console.log( vm.addFleetDetails, vm.addFleets);
        }

        /**
           * @name manageFleetBooking
           * @desc Temporary store fleet detail into array
           * @return {*}
           */
        function manageFleetBooking() {

            //console.log(vm.addFleets);
            vm.validField.validFleetList = false;

            //Check Fleet list should not be empty
            if (vm.addFleets.length === 0) {

                vm.validField.validFleetList = true;
            } else {

                //Form values assign to variables
                vm.attributes.SiteId = vm.siteId;
                vm.attributes.customerId = vm.customerId;
                vm.attributes.SupervisorId = vm.supervisorAttribute.SupervisorId;
                vm.attributes.GateId = vm.gateAttribute.GateId;
                vm.attributes.GateContactPersonId = vm.contactAttribute.GateContactPersonId;
                vm.attributes.Fleet = vm.addFleets;

                //console.log("bookingObj" + JSON.stringify(vm.attributes), vm.attributes);

                //API call for new Job booking
                ManageJobBookingFactory
                       .addBooking(vm.attributes)
                       .then(function () {
                           vm.cancel();
                       });
                $state.reload();
            }
        }

        //Dismiss the popup
        vm.cancel = function () {
            $scope.modalInstance.dismiss();
        };
    }

    //Inject required stuff as parameters to factories controller function
    ManageJobBookingCtrl.$inject = ['$scope', 'UtilsFactory', 'BCAFactory', 'ManageJobBookingFactory', '$location', '$stateParams', '$uibModal', '$state', '$filter'];

    /**
   * @name ManageJobBookingCtrl
   * @param $scope
   * @param UtilsFactory
   * @param BCAFactory
   * @param ManageJobBookingFactory
   * @param $location
   * @param $stateParams
   * @param $uibModal
   * @param $state
   * @param $filter
   */
    function ManageJobBookingCtrl($scope, UtilsFactory, BCAFactory, ManageJobBookingFactory, $location, $stateParams, $uibModal, $state, $filter) {
        
        //Variable declaration and initialization
        var vm = this;

        // map create job booking property
        vm.attributes = {
            BookingId: '',
            CustomerId: '',
            SiteId: '',
            WorktypeId: '',
            StatusLookupId: '62E9A544-F295-4110-97F2-03A26E01ADE8',
            CallingDateTime: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
            FleetBookingDateTime: '',
            EndDate: '',
            BookingNumber: '',
            AllocationNotes: '',
            IsActive: 'true',
            BookingFleet: {
                BookingFleetId: '',
                BookingId: '',
                BookingNumber: '',
                RegistrationNumber: '',
                Driver: '',
                FleetBookingDateTime: new Date(),
                FleetBookingEndDate: '',
            },
        };
        vm.endDate = new Date();

        //Method
        vm.getCustomers = getCustomers;
        vm.getSites = getSites;
        vm.getWorkTypes = getWorkTypes;
        vm.manageBooking = manageBooking;
        vm.getBookingByBookingId = getBookingByBookingId;
        vm.deleteBookingFleet = deleteBookingFleet;
        vm.reset = reset;

        /**
        * @name getCustomerList for dropdown
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getCustomers() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getCustomersDDL()
                .then(function () {
                    vm.customerDropdownList = BCAFactory.customerList.DataList;
                });
        }

        // calling method on load
        vm.getCustomers();

        /**
       * @name getSites for dropdown
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function getSites() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getSitesByCustomerIdDDL(vm.attributes.CustomerId)
                .then(function () {
                    vm.siteDropdownList = BCAFactory.siteList.DataList;
                });
        }

        // method call on change of customer dropdown
        vm.customerChange = function () {
            //calling funtion of getSiteDropDownListing
            getSites();
        }

        /**
         * @name getWorkTypes for dropdown
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getWorkTypes() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getWorkTypesDDL()
                .then(function () {
                    vm.workTypeDropdownList = BCAFactory.workTypeList.DataList;
                });
        }

        // calling the method on page load
        vm.getWorkTypes();

        /**
           * @name manageBooking for add and update
           * @desc Retrieve factories listing from factory
           * @returns {*}
           */
        function manageBooking() {

            //adding bookingId in attributes
            vm.attributes.BookingId = $stateParams.BookingId;

            //calling edit booking factory
            ManageJobBookingFactory
                  .editBooking(vm.attributes)
                  .then(function () {
                      $location.path('booking/BookingList/');
                  });

            // commented the code as add is removed after the latest changes
            //ManageJobBookingFactory
            //       .addBooking(vm.attributes)
            //       .then(function () {
            //           $location.path('booking/BookingList');
            //       });
        }

        /**
         * @name getBookingByBookingId for edit
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getBookingByBookingId(bookingId) {

            //Call BCAFactory factory get all factories data
            ManageJobBookingFactory
                .getBookingDetail(bookingId)
                .then(function () {
                    vm.bookingDetail = ManageJobBookingFactory.bookingDetail.DataObject;
                    vm.attributes.CallingDateTime = vm.bookingDetail.CallingDateTime;
                    vm.attributes.FleetBookingDateTime = new Date(vm.bookingDetail.FleetBookingDateTime);
                    vm.attributes.EndDate = new Date(vm.bookingDetail.EndDate);                   
                    vm.attributes.CustomerId = vm.bookingDetail.CustomerId;
                    vm.attributes.BookingNumber = vm.bookingDetail.BookingNumber;
                    vm.customerChange();
                    vm.attributes.SiteId = vm.bookingDetail.SiteId;
                    vm.attributes.WorktypeId = vm.bookingDetail.WorktypeId;
                    vm.attributes.AllocationNotes = vm.bookingDetail.AllocationNotes;
                    vm.attributes.BookingFleet = vm.bookingDetail.BookedFleetList;
                    vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.attributes.BookingFleet);
                });
        }

        // showing and hiding fleet grid table on basis on ID
        if ($stateParams.BookingId == 0) {
            vm.showFleetTable = false;
        }
        else {
            vm.showFleetTable = true;
            vm.getBookingByBookingId($stateParams.BookingId);
        }

        //Add Fleets
        vm.addFleet = function (bookingFleetId) {
            $scope.bookingFleetId = bookingFleetId;
            $scope.bookingStartDate = vm.attributes.FleetBookingDateTime;
            $scope.bookingEndDate = vm.attributes.EndDate;
            $scope.bookingId = vm.attributes.BookingId;
            $scope.fleetActionFrom = "";
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/JobBookingFleetDetail.html',
                size: 'lg',
                controller: ManageBookingFleetCtrl,
                controllerAs: 'mbfCtrl',
                scope: $scope
            });
        };

        //Close the fleet modal
        vm.cancel = function () {
            $scope.modalInstance.dismiss();
        };

        /**
        * @name deleteBookingFleet booked fleet detail
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function deleteBookingFleet(bookingFleetId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call ManageJobBookingFactory factory get all factories data
                    ManageJobBookingFactory
                        .deleteBookingFleet(bookingFleetId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

        // Reset Function 
        var originalAttributes = angular.copy(vm.attributes);
        function reset() {
            vm.attributes = angular.copy(originalAttributes);
        };
    }

    //Inject required stuff as parameters to factories controller function
    ManageBookingFleetCtrl.$inject = ['$scope', 'UtilsFactory', 'BCAFactory', 'ManageJobBookingFactory', '$location', '$stateParams', '$uibModal', '$state', '$filter', 'NotificationFactory'];

    /**
        * @name ManageBookingFleetCtrl
        * @param $scope
        * @param UtilsFactory
        * @param BCAFactory
        * @param ManageJobBookingFactory
        * @param $location
        * @param $stateParams
        * @param $uibModal
        * @param $state
        */
    function ManageBookingFleetCtrl($scope, UtilsFactory, BCAFactory, ManageJobBookingFactory, $location, $stateParams, $uibModal, $state, $filter, NotificationFactory) {

        //Variable declaration and initialization
        var vm = this;

        // setting default date
        vm.minDate = new Date();

        // map create job booking property
        vm.check = {};
        vm.radioValue = {};
        vm.isDay = '';
        vm.attributes = {

            BookingFleet: {
                BookingFleetId: '',
                BookingId: '',
                FleetTypeId: '',
                WorktypeId:'',
                FleetRegistrationId: '',
                DriverId: '',
                IsDayShift: 0,// 0: day, 1: afternoon, 2: night
                Iswethire: true,
                AttachmentIds: '',
                NotesForDrive: '',
                IsfleetCustomerSite: false,
                Reason: '',
                StatusLookupId: '',
                BookingNumber: '',
                AllocationNotes: '',
                CreatedDate: '',
                EndDate: '',
                FleetBookingDateTime: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
                FleetBookingEndDate: $filter('date')(new Date(), 'dd-MM-yyyy hh:mm a'),
                CallingDateTime: '',
                IsActive: true,
                FleetName: ''
            },
        };
        vm.bookingFleetId = $scope.bookingFleetId;
        vm.bookingId = $scope.bookingId;
        vm.fleetActionFrom = $scope.fleetActionFrom;
        vm.bookingFleetDetail = '';
        vm.duplicate = $scope.duplicate;
        vm.bookingStartDate = $scope.bookingStartDate;
        vm.bookingEndDate = $scope.bookingEndDate;
        vm.driverDropdownList = '';
        vm.setForFirstTime = false;

        //Methods
        vm.getFleetypes = getFleetypes;
        vm.getWorkType = getWorkType;
        vm.getFleetRegistrations = getFleetRegistrations;
        vm.getDrivers = getDrivers;
        vm.getAttachments = getAttachments;
        vm.manageFleetBooking = manageFleetBooking;
        vm.getBookingFleetDetail = getBookingFleetDetail;
        vm.hideCancel = hideCancel;
        vm.openFleetFromDateCalendar = openFleetFromDateCalendar;
        vm.openFleetToDateCalendar = openFleetToDateCalendar;

        /**
          * Reset date range
          */
        vm.resetDateRange = function () {
            vm.attributes.BookingFleet.FleetBookingDateTime = "";
            vm.attributes.BookingFleet.FleetBookingEndDate = "";
        }


        //Open fleet calendar
        function openFleetFromDateCalendar() {

            $('#fleetFromDateTime').focus();
        }

        //Open fleet calendar
        function openFleetToDateCalendar() {

            $('#fleetToDateTime').focus();
        }

        /**
      * @name getFleetypes for dropdown
      * @desc Retrieve factories listing from factory
      * @returns {*}
      */
        function getFleetypes() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getFleetTypesDDL()
                .then(function () {
                    vm.fleetTypeDropdownList = BCAFactory.fleetTypeList.DataList;
                });
        }

        /**
        * @name getWorkType for dropdown
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getWorkType() {

            //Call BCAFactory factory get all factories data
            BCAFactory
            .getWorkTypesDDL()
            .then(function () {
                vm.workTypeDropdownList = BCAFactory.workTypeList.DataList;
            });
        }

        // calling the method on page load
        vm.getFleetypes();
        vm.getWorkType();

        /**
       * @name getFleetRegistrations for dropdown
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function getFleetRegistrations() {
            //convert fleet booking datetime string to date object           
            var fromDate = UtilsFactory.convertDateTimeStringToDate(vm.attributes.BookingFleet.FleetBookingDateTime);
            var toDate = UtilsFactory.convertDateTimeStringToDate(vm.attributes.BookingFleet.FleetBookingEndDate);

            // Compare FleetStart date to FleetEnd date, Booking Start and Booking End date
            if (fromDate >= toDate) {
                vm.fleetRegistrationList = '';
               // NotificationFactory.error("From date should be less than to Todate");
                return false;
            }

            //Post object
            vm.fleetData = {
                FleetTypeId: vm.attributes.BookingFleet.FleetTypeId,                
                FleetBookingDateTime: vm.attributes.BookingFleet.FleetBookingDateTime,
                FleetBookingEndDate: vm.attributes.BookingFleet.FleetBookingEndDate,
            }           

            //Call BCAFactory factory get all factories data
            ManageJobBookingFactory
            .getFleetRegistrationsByFleetTypeId(vm.fleetData)
            .then(function () {               
                vm.fleetRegistrationList = ManageJobBookingFactory.fleetRegistrationDetail.DataObject;
                console.log("vm.duplicate - Line 3327", vm.duplicate, vm.fleetRegistrationList, vm.attributes.BookingFleet.FleetTypeId
                    );
            });            
        }

        // method call on change of fleet dropdown
        vm.fleetChange = function (change, FleetTypeId) {

            // change: true for first default call for getBookingFleetDetail function
            if (!change) {

                vm.attributes.BookingFleet.FleetRegistrationId = '';
                vm.attributes.BookingFleet.DriverId = '';
            }

            //calling funtion of getFleetRegistrationDropDownListing
            if (FleetTypeId != "") {

                getFleetRegistrations();
            } else {

                vm.fleetRegistrationDropdownList = '';
                vm.driverDropdownList = '';
            }               
        }

        /**
          * @name getDrivers for dropdown
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getDrivers() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getDriversByFleetRegistrationIdDDL(vm.attributes.BookingFleet.FleetRegistrationId)
                .then(function () {
                    vm.driverDropdownList = BCAFactory.driverList.DataList;
                    console.log(vm.driverDropdownList);
                });
        }

        // method call on change of fleet registration dropdown
        vm.fleetRegistrationChange = function (change, FleetRegistrationId ) {
            // change: true for first default call for getBookingFleetDetail function
            if (!change) {
               
                vm.attributes.BookingFleet.DriverId = '';
            }

            //calling funtion of getDrivers if fleet registration exist
            if (FleetRegistrationId !== '') {

                getDrivers();
            } else {

                //If Id is empty then DDL will be blank
                vm.driverDropdownList = '';
            }                
        }

        /**
        * @name getAttachments for check list
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAttachments() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getAttachmentsChk()
                .then(function () {
                    vm.attachementList = BCAFactory.attachementList.DataObject;
                });
        }

        // method call on Ctrl load
        vm.getAttachments();

        /**
           * @name manageFleetBooking for add and update
           * @desc Retrieve factories listing from factory
           * @returns {*}
           */
        function manageFleetBooking() {            
        
            //Check Date validation           
            //convert fleet booking datetime string to date object           
            var fromDate = UtilsFactory.convertDateTimeStringToDate(vm.attributes.BookingFleet.FleetBookingDateTime);
            var toDate = UtilsFactory.convertDateTimeStringToDate(vm.attributes.BookingFleet.FleetBookingEndDate);

            //convert booking date string to date object
            var bookingStartDate = new Date(vm.bookingStartDate);
            var bookingEndDate = new Date(vm.bookingEndDate);

            //copy of the object into another variable
            var fromDateSetHours = angular.copy(fromDate);
            var toDateSetHours = angular.copy(toDate);

            // Set hours to zero for only date comparison
            bookingStartDate.setHours(0, 0, 0, 0);
            bookingEndDate.setHours(0, 0, 0, 0);
            fromDateSetHours.setHours(0, 0, 0, 0);
            toDateSetHours.setHours(0, 0, 0, 0)
            
            // Compare FleetStart date to FleetEnd date, Booking Start and Booking End date
            if (fromDate >= toDate) {

                NotificationFactory.error("From date should be less than to Todate");
                return false;

            } else if ((fromDateSetHours < bookingStartDate || fromDateSetHours > bookingEndDate) || (toDate <= fromDate || toDateSetHours > bookingEndDate)) {

                NotificationFactory.error("From date is not into the range of booking Start date and End date");
                return false;
            } else {

                // checking selected checkbox
                var log = [];
                angular.forEach(vm.check, function (value, key) {
                    if (key !== '' && value === true) {
                        this.push(key);
                    }
                }, log);

                if (typeof $stateParams.BookingId !== 'undefined') {
                    vm.attributes.BookingFleet.BookingId = $stateParams.BookingId;
                }
                vm.attributes.BookingFleet.AttachmentIds = log.toString();

                //check for Add /Edit /Duplicate fleets
                if (typeof vm.bookingFleetId == 'undefined' || vm.bookingFleetId == '0' || vm.bookingFleetId == '') {
                    ManageJobBookingFactory
                           .addBookingFleet(vm.attributes)
                           .then(function () {
                           });
                    $state.reload();
                }
                else {
                    if (vm.duplicate) {
                        vm.attributes.BookingFleet.StatusLookupId = '62E9A544-F295-4110-97F2-03A26E01ADE8';
                        ManageJobBookingFactory
                           .addBookingFleet(vm.attributes)
                           .then(function () {
                           });
                        $state.reload();
                    } else {
                        vm.attributes.BookingFleet.BookingFleetId = vm.bookingFleetId;
                        ManageJobBookingFactory
                             .updateBookingFleet(vm.attributes)
                             .then(function () {
                             });
                        $state.reload();
                    }
                }
            }
        }

        /**
       * @name getBookingFleetDetail booked fleet detail
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function getBookingFleetDetail() {
            
            if (vm.bookingFleetId != undefined) {

                if (vm.bookingFleetId == 0)
                    vm.show = false;
                else
                    vm.show = true;
            }

            //Call BCAFactory factory get all factories data
            ManageJobBookingFactory
                .getBookingFleetDetail(vm.bookingFleetId)
                .then(function () {

                    vm.bookingFleetDetail = ManageJobBookingFactory.bookingFleetDetail.DataObject;                    
                    vm.attributes.BookingFleet.BookingId = vm.bookingFleetDetail.BookingId;
                    vm.attributes.BookingFleet.FleetTypeId = vm.bookingFleetDetail.FleetTypeId;                    
                    vm.attributes.BookingFleet.WorktypeId = vm.bookingFleetDetail.WorktypeId;
                    vm.attributes.BookingFleet.FleetRegistrationId = vm.bookingFleetDetail.FleetRegistrationId;
                    vm.attributes.BookingFleet.DriverId = (vm.bookingFleetDetail.DriverId != null) ? vm.bookingFleetDetail.DriverId : '';
                    vm.attributes.BookingFleet.IsDayShift = vm.bookingFleetDetail.IsDayShift;
                    vm.attributes.BookingFleet.Iswethire = vm.bookingFleetDetail.Iswethire.toString();
                    vm.attributes.BookingFleet.AttachmentIds = vm.bookingFleetDetail.AttachmentIds;
                    vm.attributes.BookingFleet.NotesForDrive = vm.bookingFleetDetail.NotesForDrive;
                    vm.attributes.BookingFleet.FleetBookingDateTime = vm.bookingFleetDetail.FleetBookingDateTime;
                    vm.attributes.BookingFleet.FleetBookingEndDate = vm.bookingFleetDetail.FleetBookingEndDate;
                    vm.attributes.BookingFleet.IsfleetCustomerSite = vm.bookingFleetDetail.IsfleetCustomerSite;
                    vm.attributes.BookingFleet.Reason = vm.bookingFleetDetail.Reason;
                    vm.bookingStartDate = $filter('date')(vm.bookingFleetDetail.BookingStartDate, 'yyyy-MM-dd');
                    vm.bookingEndDate = $filter('date')(vm.bookingFleetDetail.BookingEndDate, 'yyyy-MM-dd');
                  
                    //Set default date if this is dulicate fleet
                    if (vm.duplicate) {

                        vm.attributes.BookingFleet.FleetBookingDateTime = '';
                        vm.attributes.BookingFleet.FleetBookingEndDate = '';
                    }

                    isChecked(vm.bookingFleetDetail.AttachmentIds);
                    vm.fleetChange(true);
                    
                    if (vm.attributes.BookingFleet.FleetRegistrationId !== '' && vm.attributes.BookingFleet.FleetRegistrationId !== null)
                        vm.fleetRegistrationChange(true);

                });
        }

        //get detail of booking fleet 
        vm.getBookingFleetDetail(vm.bookingFleetId);

        function hideCancel() {
            $scope.modalInstance.dismiss();
        }

        // checking checkboxes by Id while updating
        function isChecked(attachmentIds) {
            vm.check = {};
            if (attachmentIds) {
                var array = attachmentIds.split(',');
                if (array.length > 0) {
                    angular.forEach(array, function (items) {
                        vm.check[items] = true;
                    });
                }
            }
        }

        // change event of FleetBookingDateTime
        vm.setMinEndDate = function () {

            var splitedDate = vm.attributes.BookingFleet.FleetBookingDateTime;
            var newSplited = splitedDate.split("-");
            var a = new Date(newSplited[1] + "/" + newSplited[0] + "/" + newSplited[2]);
            vm.minEndDate = a.toUTCString();
        }
    }

    //Inject required stuff as parameters to factories controller function
    ManageBookingSiteCtrl.$inject = ['$scope', 'UtilsFactory', 'BCAFactory', 'ManageBookingSiteFactory', '$location', '$stateParams', '$state', '$uibModal'];

    /**
    * @name ManageBookingSiteCtrl
    * @param $scope
    * @param UtilsFactory
    * @param BCAFactory
    * @param ManageJobBookingFactory
    * @param $location
    * @param $stateParams
    * @param $state
    * @param $uibModal    
     */
    function ManageBookingSiteCtrl($scope, UtilsFactory, BCAFactory, ManageBookingSiteFactory, $location, $stateParams, $state, $uibModal) {

        //Variable declaration and initialization
        var vm = this;       

        // map create booking site property
        vm.attributes = {
            BookingId: '',
            CustomerName: '',
            SiteName: '',
            SiteDetail: '',
            SupervisorId: '',
            GateId: '',
            SupervisorName: '',
            SupervisorEmail: '',
            SupervisorMobileNumber: '',
            GateContactPersonId: '',
            SiteNote: '',
            IsActive: true
        };
        vm.SiteNote = '';

        // map Create/Update contact site property
        vm.contact = {
            GateContactPersonId: '',
            ContactPerson: '',
            MobileNumber: '',
            Email: '',
            GateId: '',
            IsDefault: '',
            IsActive: true
        };

        // map create booking site(gate dropdown) property
        vm.gate = {
            GateNumber: '',
            RegistrationDescription: '',
            ContactPerson: '',
            Email: '',
            MobileNumber: ''
        };

        // map create booking site(fleet dropdown) property
        vm.fleet = {
            FleetRegistrationId: '',
            RegistrationDescription: '',
        };

        // array's for locally managing adding supervisor and gate
        vm.addSupervisor = [];
        vm.superVisorId = [];
        vm.addGate = [];
        vm.gateId = [];
        vm.fleetRegistrationId = [];
        vm.gateContactPersonId = [];
        vm.contactModalGetList = [];

        //Methods
        vm.getSiteDetail = getSiteDetail;
        vm.manageBookingSite = manageBookingSite;
        vm.getContactDetail = getContactDetail;
        vm.bookingContactDetailModal = bookingContactDetailModal;
        vm.saveContact = saveContact;

        /**
          * @name getSiteDetail 
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getSiteDetail(bookingId) {

            //Call ManageBookingSiteFactory factory get all factories data
            ManageBookingSiteFactory
                .getBookingSiteDetail(bookingId)
                .then(function () {
                    vm.siteDetail = ManageBookingSiteFactory.siteDetail.DataObject;
                    vm.addSupervisor = vm.siteDetail.AllocatedSupervisor;
                    vm.superVisor = vm.siteDetail.SupervisorList;
                    vm.fleetList = vm.siteDetail.FleetList;
                    vm.gateList = vm.siteDetail.GateList;
                    vm.SiteName = vm.siteDetail.SiteName;
                    vm.CustomerName = vm.siteDetail.CustomerName;
                    vm.SiteDetail = vm.siteDetail.SiteDetail;
                    vm.addGate = vm.siteDetail.AllocatedGateContactList;
                    vm.SiteNote = vm.siteDetail.SiteNote;

                    //Store gate, fleet registration and contact person into array
                    for (var i = 0; i < vm.siteDetail.AllocatedGateContactList.length; ++i) {
                        vm.gateId[i] = vm.siteDetail.AllocatedGateContactList[i].GateId;
                        vm.fleetRegistrationId[i] = vm.siteDetail.AllocatedGateContactList[i].FleetRegistrationId;
                        vm.gateContactPersonId[i] = vm.siteDetail.AllocatedGateContactList[i].GateContactPersonId;

                    }

                    //store supervisors into array
                    for (var i = 0; i < vm.siteDetail.AllocatedSupervisor.length; ++i) {
                        vm.superVisorId[i] = vm.siteDetail.AllocatedSupervisor[i].SupervisorId;
                    }

                });

        }

        // calling the method on page load
        vm.getSiteDetail($stateParams.BookingId);

        /**
          * @name getContactDetail
          * @desc Retrieve contact list from the factory
          * @return {*}
          */
        function getContactDetail(gateId) {
            if (!vm.gate) {
                vm.gate = {};
            }

            //Get contact by gateId
            if (gateId) {
                vm.gate.contact = {};
                ManageBookingSiteFactory
               .getContactPersons(gateId)
               .then(function () {
                   vm.contactList = ManageBookingSiteFactory.contactDetail.DataList;
                   vm.gate.contact = vm.contactList.filter(function (c) { return c.IsDefault === true })[0];

               });
            } else {
                vm.contactList = {};
            }
        }

        /**
          * @name bookingContactDetailModal
          * @desc calling popup
          */
        function bookingContactDetailModal(contactId, getList) {
            vm.contact.GateContactPersonId = '';
            vm.contact.ContactPerson = '';
            vm.contact.MobileNumber = '';
            vm.contact.Email = '';
            vm.contact.IsDefault = '';
            vm.contact.IsActive = '';
            vm.contactModalGetList = {};

            if (contactId) {
                var filter = $(vm.contactList)
                           .filter(function (index, element) {
                               return element.GateContactPersonId == contactId;
                           });
                vm.contact.GateContactPersonId = filter[0].GateContactPersonId;
                vm.contact.ContactPerson = filter[0].ContactPerson;
                vm.contact.MobileNumber = parseInt(filter[0].MobileNumber);
                vm.contact.Email = filter[0].Email;
                vm.contact.IsDefault = filter[0].IsDefault;
                vm.contact.IsActive = filter[0].IsActive;
                vm.contact.gate = vm.gate;
            }
            vm.contactModalGetList = getList;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/bookingContactDetail.html',
                scope: $scope
                //controller: ModalInstanceCtrl,
            });
        };

        // hide modal
        vm.hideContact = function () {
            $scope.modalInstance.dismiss();
        }

        // hide cancel popup
        vm.hideCancel = function () {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name saveContact
        * @desc Add/Update contact detail
        */
        function saveContact() {

            // store data for api call 
            var contactAttribute = {
                GateId: vm.contact.gate.GateId,
                ContactPerson: vm.contact.ContactPerson,
                MobileNumber: vm.contact.MobileNumber,
                Email: vm.contact.Email,
                IsDefault: vm.contact.IsDefault,
                IsActive: vm.contact.IsActive
            }

            vm.contactModalGetList = {};

            //Add/Edit to Contacts
            if (vm.contact.GateContactPersonId) {
                contactAttribute.GateContactPersonId = vm.contact.GateContactPersonId;
                ManageBookingSiteFactory
                 .updateGateContactPerson(contactAttribute)
                 .then(function () {
                 });
            } else {
                ManageBookingSiteFactory
                .addGateContactPerson(contactAttribute)
                .then(function () {
                });
            }

            vm.getContactDetail(vm.contact.gate.GateId);
            vm.hideContact();
        }

        /**
         * @name manageBookingSite for add and update
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function manageBookingSite() {

            vm.attributes.SupervisorId = vm.superVisorId.toString();
            vm.attributes.BookingId = $stateParams.BookingId;
            vm.attributes.GateId = vm.gateId.toString();
            vm.attributes.FleetRegistrationId = vm.fleetRegistrationId.toString();
            vm.attributes.GateContactPersonId = vm.gateContactPersonId.toString();
            vm.attributes.SiteNote = vm.SiteNote;
           
            ManageBookingSiteFactory
                   .addBookingSiteDetail(vm.attributes)
                   .then(function () {
                       $state.reload();
                   });
        }

        // start supervisor list code add and remove code
        vm.addRow = function () {
            var bl = false;
            if (vm.attributes !== null) {
                $.grep(vm.addSupervisor, function (n, i) {
                    if (n["SupervisorName"] == vm.attributes.SupervisorName)
                        bl = true;
                });

                if (vm.attributes.SupervisorName !== "" && typeof vm.attributes.SupervisorName !== "undefined") {
                    // Apply check for existance
                    if (!bl) {
                        // adding supervisorId in array
                        vm.superVisorId.push(vm.attributes.SupervisorId);
                        vm.addSupervisor.push({
                            'Options': vm.attributes.Options,
                            'SupervisorId': vm.attributes.SupervisorId,
                            'SupervisorName': vm.attributes.SupervisorName,
                            'SupervisorEmail': vm.attributes.SupervisorEmail,
                            'SupervisorMobileNumber': vm.attributes.SupervisorMobileNumber
                        });
                    }
                }
            }
        }

        vm.removeRow = function (index) {

            vm.addSupervisor.splice(index, 1);
            vm.superVisorId.splice(index, 1);
        };
        // end supervisor list code add and remove code

        // start gate list code add and remove code
        vm.addGateRow = function () {
            var bl = false;
            if (vm.fleet.RegistrationDescription && vm.gate.contact) {
                $.grep(vm.addGate, function (n, i) {
                    if ((n["GateNumber"] == vm.gate.GateNumber) && (n["FleetRegistrationId"] == vm.fleet.FleetRegistrationId) || (n["ContactPerson"] == vm.gate.contact.ContactPerson))
                        bl = true;
                });
                if (vm.gate.GateNumber != "") {
                    // Apply check for existance
                    if (!bl) {
                        // adding GateId in array                       
                        vm.gateId.push(vm.gate.GateId);
                        vm.fleetRegistrationId.push(vm.fleet.FleetRegistrationId);
                        vm.gateContactPersonId.push(vm.gate.contact.GateContactPersonId);
                        vm.addGate.push({
                            'GateNumber': vm.gate.GateNumber,
                            'Registration': vm.fleet.RegistrationDescription,
                            'FleetRegistrationId': vm.fleet.FleetRegistrationId,
                            'ContactPerson': vm.gate.contact.ContactPerson,
                            'Email': vm.gate.contact.Email,
                            'MobileNumber': vm.gate.contact.MobileNumber
                        });
                    }
                }
            }
        }

        vm.removeGateRow = function (index) {
            vm.addGate.splice(index, 1);
            vm.gateId.splice(index, 1);
            vm.fleetRegistrationId.splice(index, 1);
            vm.gateContactPersonId.splice(index, 1);
        }
        // end gate list code add and remove code
    }

    //Inject required stuff as parameters to factories controller function
    BookingListCtrl.$inject = ['$timeout', '$scope', '$stateParams', '$uibModal', 'BookingListFactory', 'BookingCalendarFactory', 'UtilsFactory', '$filter', '$state'];

    /**
    * @name BookingListCtrl
    * @param $scope
    * @param $stateParams
    * @param $uibModal 
    * @param BookingListFactory 
    * @param BookingCalendarFactory
    * @param UtilsFactory
    * @param $filter
    * @param $state
    */
    function BookingListCtrl($timeout, $scope, $stateParams, $uibModal, BookingListFactory, BookingCalendarFactory, UtilsFactory, $filter, $state) {

        //Assign controller scope pointer to a variable
        var vm = this;

        // map create job booking property
        vm.attributes = {
            BookingId: '',
            FromDate: '',
            ToDate: '',
            CustomerId: '',
            CustomerName: '',
            SiteId: '',
            WorktypeId: '',
            StatusLookupId: '62E9A544-F295-4110-97F2-03A26E01ADE8',
            CallingDateTime: '',
            FleetBookingDateTime: '',
            EndDate: '',
            BookingNumber: '',
            AllocationNotes: '',
            ABN: '',
            EmailForInvoices: '',
            ContactNumber: '',
            BookingFleet: {
                FleetTypeId: '',
                FleetRegistrationId: '',
                DriverId: '',
            },
            BookingFleet1: [],
        }
        vm.status = {
            BookingId: '',
            StatusValue: '',
            CancelNote: '',
            Rate: ''
        };
        vm.dateRangeError = false;
        vm.attributes.FromDate = new Date();
        vm.attributes.ToDate = new Date();
        vm.uiGrid = {};

        //Methods
        vm.getBookingList = getBookingList;
        vm.getListing = getListing;
        vm.getBookingInfo = getBookingInfo;
        vm.bookingCustomerDetail = bookingCustomerDetail;
        vm.bookFleetDetail = bookFleetDetail;
        $scope.deleteBooking = deleteBooking;
        $scope.updateBookingStatus = updateBookingStatus;
        $scope.cancelStatusPopup = cancelStatusPopup;
        $scope.fleetDetail = fleetDetail;
        vm.closeModel = closeModel;
        vm.downloadPrintBookingList = downloadPrintBookingList;
        vm.downloadExcelBookingList = downloadExcelBookingList;
        vm.print = print;

        //START UI-Grid Code
       
        vm.dataSetBooking = [
            {
                name: 'BookingNumber',
                cellTemplate: '<a class="ui-grid-cell-contents ng-binding ng-scope" href="javascript:void(0)" ng-click="grid.appScope.fleetDetail(row.entity.Fleet)">{{row.entity.BookingNumber}}</a>'
            },
            {
                name: 'CustomerName'
            },
            {
                name: 'SiteName',
                displayName: 'Site'
            },
            {
                name: 'StatusTitle',
                displayName: 'Status'
            },
            {
                name: 'FleetBookingDateTime',
                displayName: 'Start Date & Time'
            },
            {
                name: 'EndDate'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: [ '<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a ui-sref="booking.BookingWorkAllocation({BookingId: row.entity.BookingId})" href="javascript:void(0);"><i class="fa fa-history fa-icon" aria-hidden="true"></i>  Work Allocation</a></li>' +
                                                '<li ng-if="row.entity.StatusTitle == \'Allocated\'"><a href="javascript:void(0)" ng-click="grid.appScope.updateBookingStatus(row.entity.BookingId,4)"><i class="fa pe-7s-look" aria-hidden="true"></i> Marked As Complete</a></li>' +
                                                '<li><a ui-sref="booking.JobBooking({BookingId: row.entity.BookingId})" href="javascript:void(0)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                                '<li ng-if="booking.StatusTitle == \'Pending\'"><a href="javascript:void(0)" ng-click="grid.appScope.cancelStatusPopup(row.entity.BookingId)"><i class="fa pe-7s-look" aria-hidden="true"></i> Cancel Booking</a></li>' +
                                                '<li><a href="javascript:void(0)" ng-click="grid.appScope.deleteBooking(row.entity.BookingId);" ><i class="fa pe-7s-trash" aria-hidden="true"></i>Delete</a></li>' +
                                    '</ul>' +
                                '</div>'
                             ].join('')

            }
        ];
       
        vm.uiGrid = UtilsFactory.uiGridOptionsWithExport(vm.dataSetBooking);

        vm.uiGrid.onRegisterApi = function (gridApi) {           
            vm.gridApi = gridApi;
        }

       
        //Custom menu item UI-GRID

        vm.uiGrid.gridMenuCustomItems = [
                        {
                            title: 'Print',
                            action: vm.print
                        }
        ];
        //END UI-Grid Code
        
            if (typeof $stateParams.CalendarDate !== 'undefined' && $stateParams.CalendarDate !== '') {
                BookingCalendarFactory.getAllBookingByFleetBookingDate($stateParams.CalendarDate)
                .then(function () {
                    vm.bookingList = BookingCalendarFactory.bookingListByDate.DataList;
                    //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.bookingList);
                   

                        vm.uiGrid.data = vm.bookingList;
                        console.log(vm.uiGrid);
                   
               
                });
            } else {
                // calling method on load
                vm.getBookingList();
            }
       

        //Set to date according to from date
        vm.changeFromDate = function (fromDate) {
            vm.attributes.ToDate = fromDate;
        }

        /**
           * @name getAllBooking for booking list
           * @desc Retrieve factories listing from factory
           * @returns {*}
           */
        function getBookingList(fromReset) {

            if (typeof fromReset == 'undefined' && (vm.attributes.FromDate == '' || vm.attributes.ToDate == '')) {

                vm.dateRangeError = true;
            } else {
                vm.dateRangeError = false;
                // declaring variable
                var fromDate;
                var toDate;

                // checking condition of from and to
                if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {
                    fromDate = "0";
                    toDate = "0";
                    //vm.attributes.ToDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                }
                else {
                    var tempFromDate = vm.attributes.FromDate;
                    var tempToDate = vm.attributes.ToDate;
                    fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                    toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
                }

                //Call BookingListFactory factory get all factories data
                BookingListFactory
                    .getAllBookingByDateRange(fromDate, toDate)
                    .then(function () {
                        vm.bookingList = BookingListFactory.bookingList.DataList;                        
                        //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.bookingList);   
                        vm.uiGrid.data = vm.bookingList;
                    });
            }
        }

        //START print Custome function        

        function print(data) {
            printGrid(data);
        }


        /**
            * @name printGrid
            * @desc print Grid List
            * @returns {*}
            */
        function printGrid() {

            //variable declaration
            var gridColumnData, gridData;
                gridData = vm.uiGrid.data;
                gridColumnData = vm.gridApi;
            
            //console.log(gridColumnData, gridData, gridColumnData.grid.moveColumns.orderCache.length, gridColumnData.grid.columns[1].field); 
           
            var innerContents = UtilsFactory.printTableHTML(gridColumnData, gridData);

            var popupWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWindow.document.open();
            popupWindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
            popupWindow.focus();
            popupWindow.document.close();
            //popupWindow.focus();
            //popupWindow.print();
            //popupWindow.close();

        }

        //END print Custome function

        /**
          * Reset date filter
          */
        vm.resetFilterDate = function () {
            vm.attributes.FromDate = "";
            vm.attributes.ToDate = "";
            vm.resetDate = true;
            vm.getBookingList("reset");
        }

        /**
         * @name getListing
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getListing() {

            //Call booking factory get all factories data
            vm.bookings = BookingsListDetailsFactory.getListing();
            vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.bookings);
        }

        /**
         * @name getFactoryInfo
         * @desc Get details of selected factory from factory.
         */
        function getBookingInfo() {

            //Call factories details factory get factory data
            vm.customerInfo = BookingsListDetailsFactory.getBookingInfo();
        }

        /**
         * @name bookingCustomerDetail
         * @desc callin popup
         */
        function bookingCustomerDetail(data) {
            // Assign values to scope of modal
            $scope.CustomerName = data.CustomerName;
            $scope.ABN = data.CustomerABN;
            $scope.EmailForInvoices = data.EmailForInvoices;
            $scope.ContactNumber = data.ContactNumber;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/BookingCustomerDetail.html',
                scope: $scope,
                controller: 'BookingListCtrl',
                controllerAs: 'blCtrl'
                //controller: ModalInstanceCtrl,
            });
        };

        // hide modal
        vm.hideCustomer = function () {
            $scope.modalInstance.dismiss();
        }

        //CancelBookingModal
        function cancelStatusPopup (bookingId) {
            vm.bookingIdForCancel = bookingId;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/CancelBooking.html',
                //controller: ModalInstanceCtrl,
                scope: $scope
            });
        }

        // hide cancel popup
        vm.hideCancel = function () {
            $scope.modalInstance.dismiss();
        }

        /**
       * @name customerDetail
       * @desc calling booking customer detail popup method
       */
        vm.customerDetail = function (data) {
            vm.attributes.CustomerName = data.CustomerName;
            vm.attributes.ABN = data.CustomerABN;
            vm.attributes.EmailForInvoices = data.EmailForInvoices;
            vm.attributes.ContactNumber = data.ContactNumber;
            vm.bookingCustomerDetail();
        }

        /**
        * @name bookFleetDetail
        * @desc callin popup
        */
        function bookFleetDetail() {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/AllocatedFleetList.html',
                size: 'lg',
                scope: $scope
                //controller: ModalInstanceCtrl,
            });
        };

        // hide AllocatedFleet popup
        vm.hideFleet = function () {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name fleetDetail
        * @desc calling booking fleet detail popup method
        */
        function fleetDetail(data) {
            vm.fleetList = data;
            vm.bcaFleetList = UtilsFactory.bcaTableOptions(vm.fleetList);
            vm.bookFleetDetail();
        }

        /**
        * @name deleteBooking by bookingId
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function deleteBooking(bookingId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call BookingListFactory factory get all factories data
                    BookingListFactory
                    .deleteBooking(bookingId)
                    .then(function () {
                        $state.reload();
                    });
                }
            });
        }

        /**
       * @name updateBookingStatus by bookingId
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function updateBookingStatus(bookingId, statusValue, note, rate) {
            if (bookingId == undefined) {
                vm.status.BookingId = vm.bookingIdForCancel;
            } else {
                vm.status.BookingId = bookingId;
            }
            vm.status.StatusValue = statusValue;
            //Call BCAFactory factory get all factories data
            BookingListFactory
                .updateBookingStatus(vm.status)
                .then(function () {
                    $state.reload();
                });
        }

        /**
         * @name closeModal
         * @desc Close pop up
         */
        function closeModel() {
            $scope.modalInstance.dismiss();
        }

        /**
         * @name downloadExcelBookingList
         * @desc download pdf Booking list
         * @returns {*}
         */
        function downloadExcelBookingList(data) {

            var data = data;
            var innerContents = '';

            //Binding HTML
            innerContents += '<table width="100%" border="1" cellpadding="0" cellspacing="0" align="center" style="border:1px solid #b5b5b5;width:100%;"><thead>';
            innerContents += '<tr><td><b>Booking Number</b></td>';
            innerContents += '<td><b>Customer Name</b></td>';
            innerContents += '<td><b>Site</b></td>';
            innerContents += '<td><b>Work Type</b></td>';
            innerContents += '<td><b>Status</b></td>';
            innerContents += '<td><b>Booked Fleet</b></td>';
            innerContents += '<td><b>Start Date & Time</b></td>';
            innerContents += '<td><b>End Date</b></td></tr></thead>';
            innerContents += '<tbody style="background-color:#fff;">';

            // create table for data
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    innerContents += '<tr>';
                    innerContents += '<td align="right">' + data[i].BookingNumber + '</td>';
                    innerContents += '<td>' + data[i].CustomerName + '</td>';
                    innerContents += '<td>' + data[i].SiteName + '</td>';
                    innerContents += '<td>' + data[i].WorkType + '</td>';
                    innerContents += '<td>' + data[i].StatusTitle + '</td>';
                    innerContents += '<td>' + data[i].FleetCount + '</td>';
                    innerContents += '<td align="center">' + data[i].FleetBookingDateTime + '</td>';
                    innerContents += '<td align="center">' + data[i].EndDate + '</td>';
                    innerContents += '</tr>';
                }
            } else {
                innerContents += '<tr><td colspan="8" align="center">No records found</td></tr>';
            }

            innerContents += '</tbody></table>';

            if (window.navigator.msSaveBlob) { // IE 10+
                window.navigator.msSaveOrOpenBlob(new Blob([(innerContents)], { type: "text/richtext;charset=utf-8;" }), "Booking-List.xls")
            }
            else {
                var uri = 'data:application/vnd.ms-word,' + encodeURIComponent(innerContents);
                var downloadLink = document.createElement("a");

                downloadLink.href = uri;
                downloadLink.download = "Booking-List.xls";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }

        /**
         * @name downloadPrintBookingList
         * @desc print Booking list
         * @returns {*}
         */
        function downloadPrintBookingList(data) {

            var data = data;
            var innerContents = '';

            //Binding HTML
            innerContents += '<table width="100%" border="1" cellpadding="0" cellspacing="0" align="center" style="border:1px solid #b5b5b5;width:100%;"><thead>';
            innerContents += '<tr><td><b>Booking Number</b></td>';
            innerContents += '<td><b>Customer Name</b></td>';
            innerContents += '<td><b>Site</b></td>';
            innerContents += '<td><b>Work Type</b></td>';
            innerContents += '<td><b>Status</b></td>';
            innerContents += '<td><b>Booked Fleet</b></td>';
            innerContents += '<td><b>Start Date & Time</b></td>';
            innerContents += '<td><b>End Date</b></td></tr></thead>';
            innerContents += '<tbody style="background-color:#fff;">';

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    innerContents += '<tr>';
                    innerContents += '<td align="right">' + data[i].BookingNumber + '</td>';
                    innerContents += '<td>' + data[i].CustomerName + '</td>';
                    innerContents += '<td>' + data[i].SiteName + '</td>';
                    innerContents += '<td>' + data[i].WorkType + '</td>';
                    innerContents += '<td>' + data[i].StatusTitle + '</td>';
                    innerContents += '<td align="right">' + data[i].FleetCount + '</td>';
                    innerContents += '<td align="center">' + data[i].FleetBookingDateTime + '</td>';
                    innerContents += '<td align="center">' + data[i].EndDate + '</td>';
                    innerContents += '</tr>';
                }
            } else {
                innerContents += '<tr><td colspan="8" align="center">No records found</td></tr>';
            }

            innerContents += '</tbody></table>';

            var popupWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWindow.document.open();
            popupWindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
            popupWindow.focus();
            popupWindow.document.close();
        }

        /**
           * @name savePDF
           * @desc click function for creating PDF
           * @returns {*}
           */
        vm.savePDF = function (printdata) {
           
            //PDF PRINTER
            var columns = [
                "Booking Number",
                "Customer Name",
                "Site",
                "Work Type",
                "Status",
                "Booked Fleet",
                "Start Date & Time",
                "End Date"
            ];

            var rows = [];

            if (printdata.length > 0) {
                printdata.forEach(function (item) {
                    rows.push([
                        item.BookingNumber,
                        item.CustomerName,
                        item.SiteName,
                        item.WorkType,
                        item.StatusTitle,
                        item.FleetCount,
                        item.FleetBookingDateTime,
                        item.EndDate
                    ])
                });
            } else {
                rows.push(['',
                        '',
                        '',
                        'No records found',
                        '',
                        '',
                        '',
                        ''
                ])
            }


            var doc = new jsPDF('l', 'pt');

            function processPDF(doc) {
                var header = "Booking List" + '\n';

                doc.setFontSize(14);
                doc.text(header, 40, 40);

                var altInfo = "";
                //altInfo += "Payroll Date: " + moment.utc(printdata[0].payroll_date).format('MM/DD/YYYY') + "\n";
                //altInfo += "\nTotal Hours: " + printdata[printdata.length - 1].TotalHours + "\n";
                //altInfo += "Total Payment: $" + numberWithCommas(printdata[printdata.length - 1].TotalPayment + "\n");
                //altInfo += "Total Units: " + totalUnits + "\n";

                doc.setFontSize(10);
                doc.text(altInfo, 40, 60);

                var totalPagesExp = "{total_pages_count_string}";

                var pageContent = function (data) {

                    if (data.pageCount != 1) {
                        // HEADER
                        doc.setFontSize(8);
                        doc.setTextColor(40);
                        doc.setFontStyle('normal');

                        doc.text('full name' + ' (' + '1234' + ') ' +
                            "Payroll Date: " + "", data.settings.margin.left + 10, 22);
                    }
                    // FOOTER
                    var str = "Page " + data.pageCount;
                    // Total page number plugin only available in jspdf v1.0+
                    if (typeof doc.putTotalPages === 'function') {
                        str = str + " of " + totalPagesExp;
                    }
                    doc.setFontSize(10);
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
                };


                doc.autoTable(columns, rows, {
                    headerStyles: {
                        fillColor: [218, 236, 243],
                        textColor: [6, 6, 6]
                    },
                    startY: 70,
                    styles: {
                        overflow: 'linebreak',
                        columnWidth: 'wrap'
                    },
                    addPageContent: pageContent,
                    columnStyles: {
                        0: { columnWidth: 100, halign: 'right' },
                        1: { columnWidth: 100 },
                        2: { columnWidth: 100 },
                        3: { columnWidth: 100 },
                        4: { columnWidth: 100 },
                        5: { columnWidth: 50, halign: 'right' },
                        6: { columnWidth: 150, halign: 'center' },
                        7: { columnWidth: 100, halign: 'center' }

                    }
                    //theme: 'plain'
                });

                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    doc.putTotalPages(totalPagesExp);
                }

                return doc;
            }

            doc = processPDF(doc);
            // doc.addPage();
            // doc = processPDF(doc);

            var filename = "BookingList";
            doc.save(filename.replace(/\s/g, '') + '.pdf');
        };

        /**
         * @name sendEmail
         * @desc click function for sending Email
         * @returns {*}
         */
        vm.sendEmail = function (data) {

            vm.sendEmailResponse = BookingListFactory.sendAttachment(data);
            console.log(vm.sendEmailResponse);
            console.log(JSON.stringify(data));
        }

    }

    //Inject required stuff as parameters to factories controller function
    BookingDashboardCustomerListCtrl.$inject = ['$scope', '$stateParams', 'BookingDashboardFactory', '$filter', 'CONST'];

    /**
    * @name BookingDashboardCustomerListCtrl
    * @param $scope
    * @param $stateParams
    * @param BookingDashboardFactory
    * @param $filter
    * @param CONST
    */
    function BookingDashboardCustomerListCtrl($scope, $stateParams, BookingDashboardFactory, $filter, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.bookingDashboardList = '';
        vm.customerFleetList = '';
        vm.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.imagePath = CONST.CONFIG.IMG_URL;
        vm.defaultImg = CONST.CONFIG.BASE_URL + CONST.CONFIG.DEFAULT_IMG;
        vm.isCustomerList = "customer";
        // vm.calendarDate = '';

        //Method
        vm.getBookingDashboardList = getBookingDashboardList;
        vm.getFleetList = getFleetList;
        vm.searchFleet = searchFleet;

        //Call on page load
        if (typeof $stateParams.CalendarDate !== 'undefined' && $stateParams.CalendarDate !== '') {
            //console.log($stateParams.CalendarDate);
            vm.currentDate = $stateParams.CalendarDate;
            vm.getBookingDashboardList(vm.currentDate);
            vm.getFleetList(vm.currentDate);
        } else {

            vm.getBookingDashboardList(vm.currentDate);
            vm.getFleetList(vm.currentDate);
        }

        /**
        * @name getBookingDashboardList
        * @desc Get details of selected factory from factory.
        */
        function getBookingDashboardList(date) {
            // var date = vm.currentDate;           
            BookingDashboardFactory.getBookingDashboardCustomerList(date)
            .then(function () {
                vm.bookingDashboardList = BookingDashboardFactory.bookingList.DataList;
                //console.log(vm.bookingDashboardList);
            });
        }

        /**
         * @name getFleetList
         * @desc Get details of selected factory from factory.
         */
        function getFleetList(date) {
            BookingDashboardFactory.getFleetList(date)
            .then(function () {
                vm.customerFleetList = BookingDashboardFactory.customerFleetList.DataObject;
            });
        }
        
        /**
       * @name searchFleet
       * @desc Get details of selected factory from factory.
       */
        function searchFleet(fleetName) {
            if (fleetName != '') {
                BookingDashboardFactory.searchFleetByFleetName(fleetName, vm.currentDate)
                .then(function () {
                    vm.customerFleetList = BookingDashboardFactory.customerFleetList.DataObject;
                });
            } else {
                vm.getFleetList(vm.currentDate);
            }
        }

        //Tab right button show hide on tab click
        vm.tabClick = function (val) {

            if (val == 'Customer')
                vm.isCustomerList = "customer";
            else
                vm.isCustomerList = "Fleet";
        }

    }

    //Inject required stuff as parameters to factories controller function
    ManageCustomerBookingListCtrl.$inject = ['$scope', '$state', 'BookingDashboardFactory', '$stateParams', 'UtilsFactory', 'BCAFactory', '$filter', '$uibModal'];

    /**
    * @name ManageCutomerBookingListCtrl
    * @param $scope
    * @param $state
    * @param BookingDashboardFactory
    * @param $stateParams
    * @param UtilsFactory
    * @param BCAFactory
    * @param $filter
    * @param $uibModal
    */
    function ManageCustomerBookingListCtrl($scope, $state, BookingDashboardFactory, $stateParams, UtilsFactory, BCAFactory, $filter, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customerFleetByStatusList = '';
        vm.customerId = '';
        vm.fleetTypeId = '';
        vm.statusValue = 2;
        vm.attributes = {
            FromDate: '',
            ToDate: ''
        };
        vm.show = false;
        vm.dateRangeError = false;
        vm.uiGrid = {};
        //vm.customerSiteDetail = '';

        //Method
        vm.getBookingList = getBookingList;
        $scope.deleteBookingFleet = deleteBookingFleet;
        $scope.fleetAllocation = fleetAllocation;
        vm.print = print;

        //START UI-Grid Code

        //Customer Booking List for Booked-in status
        vm.dataSetAllocated = [
            {
                name: 'DriverName'                 
            },
            {
                name: 'FleetNumber'
            },
            {
                name: 'SiteDetail',
                displayName: 'Site'
            },
            {
                name: 'WorkType',
                displayName: 'Job Type'
            },
            {
                name: 'Material'              
            },
            {
                name: 'Dockets',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets != 0"> <a href="javascript:void(0);" ui-sref="booking.DocketList({BookingFleetId: row.entity.BookingFleetId})">{{row.entity.Dockets}}</a></div>' +
                    '<div class="ui-grid-cell-contents ng-binding ng-scope" ng-if="row.entity.Dockets == 0"> {{row.entity.Dockets}}</div>'
            },
            {
                name: 'BookingNumber'
            },
            {
                name: 'Status'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.CreateDocket({BookingFleetId: row.entity.BookingFleetId})" ><i class="fa pe-7s-file" aria-hidden="true"></i>Add Docket</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'reallocation\')" ><i class="fa pe-7s-refresh" aria-hidden="true"></i>Re-Allocation</a></li>' +
                                                '<li><a href="javascript:void(0);" ui-sref="booking.FleetHistory({BookingFleetId: row.entity.BookingFleetId, BookingId: row.entity.BookingId})" ><i class="fa fa-history fa-icon" aria-hidden="true"></i>  Fleet History</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetComplete(row.entity.BookingFleetId);" ><i class="fa pe-7s-bookmarks" aria-hidden="true"></i>Marked As completed</a></li>' +
                                    '</ul>' +
                                '</div>'
                            ].join('')

            }
        ];

        //Customer Booking List for Allocated status
        vm.dataSetBookedIn = [
          
            {
                name: 'SiteDetail',
                displayName: 'Site'
            },
            {
                name: 'WorkType',
                displayName: 'Job Type'
            },
            {
                name: 'BookingNumber'
            },
            {
                name: 'Status'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: [
                                  '<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                        '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                            '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                        '</a>' +
                                        '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                    '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'pending\')" ><i class="fa pe-7s-file" aria-hidden="true"></i> Allocation</a></li>' +
                                                    '<li><a href="javascript:void(0);" ng-click="grid.appScope.fleetAllocation(row.entity,\'duplicate\')" ><i class="fa pe-7s-copy-file" aria-hidden="true"></i> Duplicate</a></li>' +
                                                    '<li><a href="javascript:void(0);" ng-click="grid.appScope.deleteBookingFleet(row.entity.BookingFleetId);" ><i class="fa pe-7s-trash" aria-hidden="true"></i>  Delete</a></li>' +
                                        '</ul>' +
                                    '</div>'
                ].join('')                  
            }
        ];  
       
        //END UI-Grid Code

        /**
       * @name getAllBooking for booking list
       * @desc Retrieve factories listing from factory
       * @returns {*}
       */
        function getBookingList(fromReset) {

            if (typeof fromReset == 'undefined' && (vm.attributes.FromDate == "" || vm.attributes.ToDate == "")) {
                vm.dateRangeError = true;
            } else {
                vm.dateRangeError = false;

                // declaring variable
                var fromDate;
                var toDate;

                // checking condition of from and to
                if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {

                    fromDate = "0";
                    toDate = "0";
                }
                else {

                    var tempFromDate = vm.attributes.FromDate;
                    var tempToDate = vm.attributes.ToDate;
                    fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
                    toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
                }

                //Call BookingListFactory factory get all factories data
                BookingDashboardFactory.getCurrentCustomerFleetByStatus(vm.customerId, vm.fleetTypeId, vm.statusValue, fromDate, toDate)
                .then(function () {

                    vm.customerFleetByStatusList = BookingDashboardFactory.customerFleetByStatusList.DataObject;                   
                    vm.uiGrid.data = vm.customerFleetByStatusList.CustomerBookingList;                   
                });
            }
        }

        //Check params on page load 
        if (typeof $stateParams.CustomerId !== 'undefined' && $stateParams.CustomerId !== ''
            && typeof $stateParams.FleetTypeId !== 'undefined' && $stateParams.FleetTypeId !== ''
            && typeof $stateParams.StatusValue !== 'undefined' && $stateParams.StatusValue !== '') {

            vm.customerId = $stateParams.CustomerId;
            vm.fleetTypeId = $stateParams.FleetTypeId;
            vm.statusValue = $stateParams.StatusValue;

            if (vm.statusValue == 2) {
                vm.uiGrid = UtilsFactory.uiGridOptionsWithExport(vm.dataSetBookedIn);
            }else{
                vm.uiGrid = UtilsFactory.uiGridOptionsWithExport(vm.dataSetAllocated);
            }

            vm.uiGrid.onRegisterApi = function (gridApi) {
                vm.gridApi = gridApi;
            }

            //Custom menu item UI-GRID
            vm.uiGrid.gridMenuCustomItems = [
                            {
                                title: 'Print',
                                action: vm.print
                            }
            ];

            //Check params
            if ($stateParams.FromDate !== 'undefined' && $stateParams.FromDate !== ''
                && $stateParams.ToDate !== 'undefined' && $stateParams.ToDate !== '') {

                vm.attributes.FromDate = UtilsFactory.tryParseDateFromString($stateParams.FromDate);
                vm.attributes.ToDate = UtilsFactory.tryParseDateFromString($stateParams.ToDate);
            }
            vm.getBookingList();
        }


        /**
          * Reset date filter
          */
        vm.resetFilterDate = function () {

            vm.attributes.FromDate = "";
            vm.attributes.ToDate = "";
            vm.resetDate = true;
            vm.getBookingList("reset");
        }

        /**
         * @name deleteBookingFleet booked fleet detailbookingCustomerDetail
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function deleteBookingFleet(bookingFleetId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call ManageJobBookingFactory factory get all factories data
                    BCAFactory
                        .deleteBookingFleet(bookingFleetId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

        /**
         * @name fleetAllocation
         * @desc Get details of selected fleet for allocation.
         */
        function fleetAllocation(booking, fleetType) {
            $scope.duplicate = false;
            $scope.fleetActionFrom = "";

            // check fleet type is New Alloation/ Rellocation/ Duplicate
            if (fleetType == "new") {

                vm.fleetType = "new";
                vm.bookingId = $stateParams.BookingId;
                $scope.bookingFleetId = '';
            } else {

                if (fleetType == "reallocation") {

                    vm.show = true;
                    vm.fromAllocation = true;
                    $scope.fleetActionFrom = "workAllocation";
                } else if (fleetType == "duplicate") {

                    $scope.duplicate = true;
                }

                vm.bookingId = booking.BookingId;               
                $scope.bookingFleetId = booking.BookingFleetId;                
            }

            $scope.show = vm.show;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/JobBookingFleetDetail.html',
                size: 'lg',
                controller: ManageBookingFleetCtrl,
                controllerAs: 'mbfCtrl',
                scope: $scope
            });

        };

        //START print Custome function   
        function print(data) {
            printGrid(data);
        }


        /**
        * @name printGrid
        * @desc print Grid List
        * @returns {*}
        */
        function printGrid() {

            //variable declaration
            var gridColumnData, gridData;
            gridData = vm.uiGrid.data;
            gridColumnData = vm.gridApi;

            //console.log(gridColumnData, gridData, gridColumnData.grid.moveColumns.orderCache.length, gridColumnData.grid.columns[1].field); 

            var innerContents = UtilsFactory.printTableHTML(gridColumnData, gridData);

            var popupWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWindow.document.open();
            popupWindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
            popupWindow.focus();
            popupWindow.document.close();
            //popupWindow.focus();
            //popupWindow.print();
            //popupWindow.close();

        }

        //END print Custome function


        /**
         * @name sendEmail
         * @desc click function for sending Email
         * @returns {*}
         */
        vm.sendEmail = function (data) {

            vm.sendEmailResponse = BCAFactory.sendAttachment(data);
            console.log(vm.sendEmailResponse);
            console.log(JSON.stringify(data));
        }
    }

    //Inject required stuff as parameters to factories controller function
    //ManageCurrentCustomerBookingCtrl.$inject = ['$scope', 'BookingDashboardFactory', '$stateParams', 'UtilsFactory', '$filter'];

    ///**
    //* @name ManageCurrentCustomerBookingCtrl
    //* @param $scope
    //* @param BookingDashboardFactory
    //* @param $stateParams
    //* @param UtilsFactory
    //* @param $filter
    //*/
    //function ManageCurrentCustomerBookingCtrl($scope, BookingDashboardFactory, $stateParams, UtilsFactory, $filter) {
        
    //    //Assign controller scope pointer to a variable
    //    var vm = this;

    //    // map create job booking property
    //    vm.attributes = {
    //        FromDate: '',
    //        ToDate: '',
    //    }

    //    // define value's corresponding to status
    //    var statusValue = {
    //        "Pending": "2",
    //        "Allocated": "3",
    //        "Completed": "4"
    //    }

    //    // vm.customerFleetByStatusList = '';
    //    vm.currentCustomerbookingData = '';

    //    //Method
    //    vm.getCurrentCustomerBookingList = getCurrentCustomerBookingList;

    //    /**
    //     * @name getCurrentCustomerBookingList
    //     * @desc Get details of selected factory from factory.
    //     */
    //    function getCurrentCustomerBookingList(customerId, statusValue) {

    //        // declaring variable
    //        var fromDate;
    //        var toDate;

    //        // checking condition of from and to
    //        if (vm.attributes.FromDate == "" && vm.attributes.ToDate == "") {
    //            fromDate = "0";
    //            toDate = "0";
    //            //vm.attributes.ToDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    //        }
    //        else {
    //            var tempFromDate = vm.attributes.FromDate;
    //            var tempToDate = vm.attributes.ToDate;
    //            fromDate = $filter('date')(tempFromDate, 'yyyy-MM-dd');
    //            toDate = $filter('date')(tempToDate, 'yyyy-MM-dd');
    //        }

    //        BookingDashboardFactory.getCurrentCustomerBooking(customerId, statusValue, fromDate, toDate)
    //        .then(function () {
    //            vm.currentCustomerbookingData = BookingDashboardFactory.currentCustomerFleetLists;
    //            vm.bcaTableParamsCurrentCustomerBooking = UtilsFactory.bcaTableOptions(vm.currentCustomerbookingData.DataList);
    //        });
    //    }

    //    //Check params on page load
    //    if (typeof $stateParams.CustomerId !== 'undefined' && $stateParams.CustomerId !== '') {
    //        vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue["Pending"]);
    //    }

    //    /**
    //    * click method of tabs(Pending, Allocated,Completed )
    //    */
    //    vm.tabClick = function (status) {

    //        //setting status value in vm
    //        vm.currentStatus = statusValue[status];

    //        // calling factory using funtion
    //        vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue[status]);

    //    }

    //    /**
    //    * click method for go event with date filter
    //    */
    //    vm.fiterdData = function () {

    //        // checking currentStatus param is empty or not
    //        if (vm.currentStatus == undefined || vm.currentStatus == "") {
    //            vm.currentStatus = "Pending";
    //        }

    //        // calling factory using funtion
    //        vm.getCurrentCustomerBookingList($stateParams.CustomerId, statusValue[vm.currentStatus]);
    //    }
    //}

    //Inject required stuff as parameters to factories controller function
    CustomerDashboardCtrl.$inject = ['$scope', '$uibModal', '$stateParams', 'BookingDashboardFactory', '$filter'];

    /**
    * @name CustomerDashboardCtrl
    * @param $scope
    * @param $uibModal
    * @param $stateParams
    * @param BookingDashboardFactory
    * @param $filter
    */
    function CustomerDashboardCtrl($scope, $uibModal, $stateParams, BookingDashboardFactory, $filter) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customerId = '';
        vm.customerName = '';
        vm.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        // define methods
        vm.customerDashboardList = customerDashboardList;

        //added by rajat
        // check param and calling event on controller load
        if (typeof $stateParams.CustomerId != 'undefined' && $stateParams.CustomerId != '') {
            if (typeof sessionStorage.selectedDate !== 'undefined' && sessionStorage.selectedDate !== '')
                vm.currentDate = sessionStorage.selectedDate;
            console.log(sessionStorage.selectedDate);
            vm.customerId = $stateParams.CustomerId;
            vm.customerDashboardList(vm.customerId, vm.currentDate);
        }

        //commented by rajat
        //if (typeof $stateParams.CustomerId != 'undefined' && $stateParams.CustomerId != '') {
        //    vm.customerId = $stateParams.CustomerId;

        //    vm.customerDashboardList(vm.customerId);
        //}

        /**
         * @name customerDashboardList
         * @desc Get details of sites with the available count by customerId
         */
        function customerDashboardList(customerId, date) {
            vm.customerId = $stateParams.CustomerId;
            BookingDashboardFactory.getCustomerSiteDetailByCustomerId(customerId, date)
            .then(function () {
                vm.customerSiteList = BookingDashboardFactory.customerSiteList.fleetlistDashboard;
                vm.customerName = BookingDashboardFactory.customerSiteList.Name;
            });
        }

        //Customer Dashboard Add New Job Popup
        vm.addNewJob = function (siteId) {
            $scope.siteId = siteId;
            $scope.customerId = $stateParams.CustomerId;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/booking/partial/JobBookingDetail.html',
                size: 'lg',
                controller: JobBookingCtrl,
                controllerAs: 'jbCtrl',
                scope: $scope
            });
        };

        vm.cancel = function () {
            $scope.modalInstance.dismiss();
        };

    }

    //Inject required stuff as parameters to factories controller function
    ManageDocketCtrl.$inject = ['$scope', '$rootScope', 'UtilsFactory', 'BCAFactory', 'ManageDocketFactory', '$location', '$stateParams', '$state', '$uibModal', 'Upload', '$timeout', '$filter', 'CONST', 'bootstrap3ElementModifier'];

    /**
    * @name ManageDocketCtrl
    * @param $scope
    * @param $rootScope
    * @param UtilsFactory
    * @param BCAFactory
    * @param ManageDocketFactory
    * @param $location
    * @param $stateParams  
    * @param $state
    * @param $uibModal
    * @param Upload
    * @param $timeout
    * @param $filter
    * @param CONST
    * @param bootstrap3ElementModifier
    */
    function ManageDocketCtrl($scope, $rootScope, UtilsFactory, BCAFactory, ManageDocketFactory, $location, $stateParams, $state, $uibModal, Upload, $timeout, $filter, CONST, bootstrap3ElementModifier) {

        //Assign controller scope pointer to a variable
        var vm = this;

        vm.bookedFleetRegistration = [];       
        vm.fleetRegistrationNumber = {},
        vm.bookingFleetDetail = '';
        vm.attachementList = '';      
        vm.ImageBase64 = '';
        vm.Image = CONST.CONFIG.DEFAULT_IMG;       
        vm.BookingSiteSupervisors = '';
        vm.fromState = '';
        vm.check = {};
        vm.checkList = {};
        vm.invalidTime = false;
        vm.invalidLunchTime = false;
        vm.invalidLunch1Time = false;
        vm.invalidLunch2Time = false;
        vm.checkTotalKMs = false;
        vm.docketCheckList = '';
        vm.startTime = '';
        vm.endTime = '';
        vm.travelTime = '';
        vm.attributes = {
            BookingFleetId: '',
            SiteId: '',
            FleetRegistrationId: '',
            DocketNo: '',
            StartTime: '',
            EndTime: '',
            StartKMs: '',
            FinishKMsA: '',
            LunchBreak1From: '',
            LunchBreak1End: '',
            LunchBreak2From: '',
            LunchBreak2End: '',
            AttachmentIds: '',
            DocketCheckListId: '',
            IsActive: true,
            ImageBase64: '',
            SupervisorId: '',
            DocketDate: '',
            LoadDocketDataModel: [{
                DocketId: '',
                LoadingSite: '',
                Weight: 0,
                LoadTime: '',
                TipOffSite: '',
                TipOffTime: '',
                Material: '',
                IsActive: true,
            }]
        };

        //Methods
        vm.registrationNumber = registrationNumber;
        vm.getBookingFleetDetail = getBookingFleetDetail;
        vm.getAttachments = getAttachments;
        vm.saveDocket = saveDocket;
        vm.checkTotalHour = checkTotalHour;
        vm.checkLunchBreak1 = checkLunchBreak1;
        vm.checkLunchBreak2 = checkLunchBreak2;
        vm.calculateTotalTime = calculateTotalTime;
        vm.getAllDocketCheckboxList = getAllDocketCheckboxList;
        vm.totalKm = totalKm;
        vm.checkTime = checkTime;
        vm.isCheckedList = isCheckedList;
        vm.clearImage = clearImage;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        $scope.showLoader = false;

        //Check States for manage Docket
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            vm.fromState = fromState;
            vm.toState = toState;
            vm.fromParams = fromParams;
        });

        /**
         * @name getBookingFleetDetail
         * @desc retrive booking fleet detail
         * @returns {*}
         */
        function getBookingFleetDetail(bookingFleetId) {

            BCAFactory
              .getBookingFleetDetail(bookingFleetId)
              .then(function () {

                  vm.bookingFleetDetail = BCAFactory.bookingFleetDetail.DataObject;
                  if (vm.bookingFleetDetail.AttachmentIds !== null) {
                      isChecked(vm.bookingFleetDetail.AttachmentIds);
                  }
                 
                  //Pre selected supervisor
                  vm.BookingSiteSupervisors = $filter('filter')(vm.bookingFleetDetail.BookingSiteSupervisors, { SupervisorId: vm.bookingFleetDetail.BookingSiteSupervisors[0].SupervisorId })[0];
              });
        }

        /**
           * @name registrationNumber
           * @desc retrive booked registration numbers
           * @returns {*}
           */
        function registrationNumber() {          

            ManageDocketFactory
                .getBookedFleetRegistration()
                .then(function () {
                    vm.bookedFleetRegistration = ManageDocketFactory.docketDetail.DataList;

                    //Pre selected fleet registration if get stateparams (Come from the allocated fleet for create docket)
                    if (typeof $stateParams.BookingFleetId !== 'undefined' && $stateParams.BookingFleetId !== '') {
                                               
                        vm.fleetRegistrationNumber = $filter('filter')(vm.bookedFleetRegistration, { BookingFleetId: $stateParams.BookingFleetId })[0];
                        getBookingFleetDetail($stateParams.BookingFleetId);
                    }                    
                });
           
        }

        //Call on page load
        vm.registrationNumber();

        // retrive Docket Detail for update Docket
        if (typeof $stateParams.DocketId !== 'undefined' && $stateParams.DocketId !== '') {

            ManageDocketFactory
               .getDocketDetail($stateParams.DocketId)
               .then(function () {

                   vm.attributes = ManageDocketFactory.docketDetail.DataObject;

                   //Binding Loading data
                   if (vm.attributes.LoadDocket.length > 0) {
                       vm.attributes.LoadDocketDataModel = vm.attributes.LoadDocket;
                   } else {
                       vm.attributes.LoadDocketDataModel = [{
                           "DocketId": "",
                           "LoadingSite": "",
                           "Weight": 0,
                           "LoadTime": "",
                           "TipOffSite": "",
                           "TipOffTime": "",
                           "Material": "",
                           "IsActive": "true",
                       }];
                   }

                   vm.startTime = vm.attributes.StartTime;
                   vm.endTime = vm.attributes.EndTime;
                   vm.travelTime = vm.attributes.TravelTime;
                   vm.attributes.DocketDate = ManageDocketFactory.docketDetail.DataObject.DocketDate;

                   //Calculate distance
                   if (vm.attributes.FinishKMsA - vm.attributes.StartKMs > 0)
                       vm.attributes.totalKMs = vm.attributes.FinishKMsA - vm.attributes.StartKMs;
                   else {
                       vm.attributes.totalKMs = 0;
                   }

                   //vm.attributes.DocketDate = new Date(vm.attributes.DocketDate);
                   if (vm.attributes.Image != '') {
                       vm.Image = CONST.CONFIG.IMG_URL + vm.attributes.Image;
                       $("#fileName").val(vm.Image);
                   }

                   $("#previewId").attr('src', vm.Image);

                   //remove from as required not working(rajat)
                   vm.BookingSiteSupervisors = {
                       SupervisorId: '',
                       MobileNumber: ''
                   };

                   vm.getBookingFleetDetail(vm.attributes.BookingFleetId);
                   vm.isCheckedList(vm.attributes.DocketCheckListId);

                   //Get detail of the booked fleet
                   ManageDocketFactory
                   .getBookedFleetRegistration()
                   .then(function () {
                       vm.bookedFleetRegistration = ManageDocketFactory.docketDetail.DataList;
                       vm.fleetRegistrationNumber = $filter('filter')(vm.bookedFleetRegistration, { FleetRegistrationId: vm.attributes.FleetRegistrationId })[0];
                       vm.BookingSiteSupervisors.SupervisorId = vm.attributes.SupervisorId;
                       vm.BookingSiteSupervisors.MobileNumber = vm.attributes.MobileNumber;
                   });
               });
        }

        /**
           * @name addNewLoading
           * @desc Add new row
           * @returns {*}
           */
        vm.addNewLoading = function () {
            var i = vm.attributes.LoadDocketDataModel.length - 1;

            //Check not empty condition
            if ((vm.attributes.LoadDocketDataModel[i].LoadingSite !== '' && typeof vm.attributes.LoadDocketDataModel[i].LoadingSite !== 'undefined')
                && (vm.attributes.LoadDocketDataModel[i].Weight !== 0 && typeof vm.attributes.LoadDocketDataModel[i].Weight !== 'undefined')
                && (vm.attributes.LoadDocketDataModel[i].LoadTime !== '' && typeof vm.attributes.LoadDocketDataModel[i].LoadTime !== 'undefined')
                && (vm.attributes.LoadDocketDataModel[i].TipOffSite !== '' && typeof vm.attributes.LoadDocketDataModel[i].TipOffSite !== 'undefined')
                && (vm.attributes.LoadDocketDataModel[i].TipOffTime !== '' && typeof vm.attributes.LoadDocketDataModel[i].TipOffTime !== 'undefined')
                && (vm.attributes.LoadDocketDataModel[i].Material !== '' && typeof vm.attributes.LoadDocketDataModel[i].Material !== 'undefined')) {
                vm.attributes.LoadDocketDataModel.push({
                    'LoadingSite': '',
                    'Weight': 0,
                    'LoadTime': '',
                    'TipOffSite': '',
                    'TipOffTime': '',
                    'Material': '',
                    'IsActive': true
                });
            }
        };

        function tConvert(time) {

            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join(''); // return adjusted time or original string
        }
       
        /**
          * @name calculateTotalTime
          * @desc Calculate Total Hours with travel time and lunch breaks
          * @returns {*}
          */
        function calculateTotalTime() {
            
            if (vm.startTime !== '' && vm.endTime !== '') {

                //calculate difference of start and end time 
                var startActualTime = Date.parse('01/01/2016 ' + vm.startTime);
                var endActualTime = Date.parse('01/01/2016 ' + vm.endTime);
                var totalTime = endActualTime - startActualTime;
               
                // calculate difference of lunch break1 and subtract from Total hours
                if (vm.attributes.LunchBreak1From !== '' && vm.attributes.LunchBreak1End !== '') {
                    var lunchBreak1From = Date.parse('01/01/2016 ' + vm.attributes.LunchBreak1From);
                    var LunchBreak1End = Date.parse('01/01/2016 ' + vm.attributes.LunchBreak1End);
                    var diffLunchBreak1 = LunchBreak1End - lunchBreak1From;
                    totalTime -= diffLunchBreak1;
                    if (totalTime < 0) {
                        vm.invalidLunchTime = true;
                        console.log("negative 1");
                        return false;
                    } else {
                        vm.invalidLunchTime = false;
                    }                    
                }

                // calculate difference of lunch break2 and subtract from Total hours
                if (vm.attributes.LunchBreak2From !== '' && vm.attributes.LunchBreak2End !== '') {
                    var lunchBreak2From = Date.parse('01/01/2016 ' + vm.attributes.LunchBreak2From);
                    var LunchBreak2End = Date.parse('01/01/2016 ' + vm.attributes.LunchBreak2End);
                    var diffLunchBreak2 = LunchBreak2End - lunchBreak2From;
                    totalTime -= diffLunchBreak2;
                    if (totalTime < 0) {
                        vm.invalidLunchTime = true;
                        console.log("negative 2");
                        return false;
                    } else {
                        vm.invalidLunchTime = false;
                    }                   
                }
               
                var totalTimeSecond = totalTime / 1000;
                var HH = Math.floor(totalTimeSecond / 3600);
                var MM = Math.floor(totalTimeSecond % 3600) / 60;               

                //Add Traveling time into total hours
                if (vm.travelTime !== '' && typeof vm.travelTime != "undefined") {
                    var d;
                    d = new Date('01/01/2016 ' + vm.travelTime);                    
                    d.setMinutes(d.getMinutes() + MM);
                    MM = d.getMinutes();
                    HH = d.getHours() + HH;
                }

                //Formatted total time
                vm.attributes.totalHour = ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM);
            }
        }

        /**
          * @name checkTotalHour
          * @desc Calculate Total Hours 
          * @returns {*}
          */
        function checkTotalHour(StartTime, EndTime) {

            var start_actual_time = Date.parse('01/01/2016 ' + StartTime);
            var end_actual_time = Date.parse('01/01/2016 ' + EndTime);           
            var diff = end_actual_time - start_actual_time;
            var diffSeconds = diff / 1000;
            var HH = Math.floor(diffSeconds / 3600);
            var MM = Math.floor(diffSeconds % 3600) / 60;
            if ((HH <= 0 && MM <= 0) || (isNaN(HH) && isNaN(MM))) {

                vm.attributes.totalHour = '';
                vm.invalidTime = true;
            } else {

                vm.invalidTime = false;
                calculateTotalTime();

                var formatted = ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM)
                vm.attributes.totalHour = formatted;                               
            }
        }

        /**
           * @name checkLunchBreak1
           * @desc check Total Hours
           * @returns {*}
           */
        function checkLunchBreak1(StartTime, EndTime) {

            if (StartTime == '' && EndTime == '') {
                vm.invalidLunch1Time = false;
            } else {
                if (StartTime != '' && EndTime != '') {
                    var start_actual_time = Date.parse('01/01/2016 ' + StartTime);
                    var end_actual_time = Date.parse('01/01/2016 ' + EndTime);
                    var diff = end_actual_time - start_actual_time;
                    var diffSeconds = diff / 1000;
                    var HH = Math.floor(diffSeconds / 3600);
                    var MM = Math.floor(diffSeconds % 3600) / 60;
                    if ((HH <= 0 && MM <= 0) || (isNaN(HH) && isNaN(MM))) {
                        vm.invalidLunch1Time = true;
                    } else {
                        vm.invalidLunch1Time = false;
                        calculateTotalTime();
                    }
                } else {
                    vm.invalidLunch1Time = true;
                }
            }

        }

        /**
           * @name checkLunchBreak2
           * @desc check Total Hours 
           * @returns {*}
           */
        function checkLunchBreak2(StartTime, EndTime) {
            if (StartTime == '' && EndTime == '') {
                vm.invalidLunch2Time = false;
            } else {
                if (StartTime != '' && EndTime != '') {
                    var start_actual_time = Date.parse('01/01/2016 ' + StartTime);
                    var end_actual_time = Date.parse('01/01/2016 ' + EndTime);
                    var diff = end_actual_time - start_actual_time;
                    var diffSeconds = diff / 1000;
                    var HH = Math.floor(diffSeconds / 3600);
                    var MM = Math.floor(diffSeconds % 3600) / 60;
                    if ((HH <= 0 && MM <= 0) || (isNaN(HH) && isNaN(MM))) {

                        vm.invalidLunch2Time = true;
                    } else {

                        vm.invalidLunch2Time = false;
                        calculateTotalTime();
                    }
                } else {

                    vm.invalidLunch2Time = true;
                }
            }
        }      

        //Reset docket date
        vm.resetDate = function () {
            vm.attributes.DocketDate = '';
        }

        //Reset startTime and endTime
        vm.resetStartEndTime = function () {
            vm.startTime = '';
            vm.endTime = '';
        }

        //Reset travelTime
        vm.resetTravelTime = function () {
            vm.travelTime = '';
            vm.calculateTotalTime();
        }

        //Reset LunchBreak1 time
        vm.resetBreak1 = function () {
            vm.attributes.LunchBreak1From = '';
            vm.attributes.LunchBreak1End = '';
            vm.invalidLunch1Time = false;
            vm.calculateTotalTime();
        }

        //Reset LunchBreak2 time
        vm.resetBreak2 = function () {
            vm.attributes.LunchBreak2From = '';
            vm.attributes.LunchBreak2End = '';
            vm.invalidLunch2Time = false;
            vm.calculateTotalTime();
        }

        /**
           * @name isChecked
           * @desc Check checkboxes by Id while updating
           * @returns {*}
           */
        function isChecked(attachmentIds) {
            vm.check = {};
            var array = attachmentIds.split(',');
            if (array.length > 0) {
                angular.forEach(array, function (items) {
                    vm.check[items] = true;
                });
            }
        }

        /**
          * @name isCheckedList
          * @desc check checkboxes by Id while updating
          * @returns {*}
          */
        function isCheckedList(checkListIds) {
            vm.checkList = {};
            var array = checkListIds.split(',');
            if (array.length > 0) {
                angular.forEach(array, function (items) {
                    vm.checkList[items] = true;
                });
            }
        }

        /**
         * @name getAttachments for check list
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getAttachments() {
            //Call BCAFactory factory get all factories data
            BCAFactory
                .getAttachmentsChk()
                .then(function () {
                    vm.attachementList = BCAFactory.attachementList.DataObject;
                });
        }

        /**
         * @name getAllDocketCheckboxList for check list
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getAllDocketCheckboxList() {
            ManageDocketFactory
             .getAllDocketCheckboxList()
            .then(function () {
                vm.docketCheckList = ManageDocketFactory.docketCheckList.DataList;
            });
        }

        // method call on Ctrl load
        vm.getAttachments();

        // method call on Ctrl load
        vm.getAllDocketCheckboxList();

        /**
          * @name openStartTimeCalendar for check list
          * @desc Open for StartTime DateTimePicker       
          */
        vm.openStartTimeCalendar = function (picker) {
            $('#StartTimePicker').focus();
        };

        /**
          * @name openEndTimeCalendar for check list
          * @desc Open for EndTime DateTimePicker       
          */
        vm.openEndTimeCalendar = function (picker) {
            $('#EndTimePicker').focus();
        };

        /**
          * @name openTravelTimeCalendar for check list
          * @desc Open for TravelTime DateTimePicker       
          */
        vm.openTravelTimeCalendar = function (picker) {
            $('#TravelTimePicker').focus();
        };            

        /**
        * @name openBreak1FromCalendar for check list
        * @desc Open for Break1From DateTimePicker       
        */
        vm.openBreak1FromCalendar = function (picker) {
            $('#Break1FromPicker').focus();
        };

        /**
          * @name openBreak1ToCalendar for check list
          * @desc Open for Break1To DateTimePicker       
          */
        vm.openBreak1ToCalendar = function (picker) {
            $('#Break1ToPicker').focus();
        };

        /**
          * @name openBreak2FromCalendar for check list
          * @desc Open for Break2From DateTimePicker       
          */
        vm.openBreak2FromCalendar = function (picker) {
            $('#Break2FromPicker').focus();
        };

        /**
        * @name openBreak2ToCalendar for check list
        * @desc Open for forBreak2To DateTimePicker       
        */
        vm.openBreak2ToCalendar = function (picker) {
            $('#Break2ToPicker').focus();
        };

        /**
          * @name openLoadTimePickerCalendar for check list
          * @desc Open for LoadTime DateTimePicker       
          */
        vm.openLoadTimePickerCalendar = function () {
            //alert($(this).find('input[type=text]').focus());
            alert($(this).siblings(":text").attr("name"));
            //$(this).prev().attr().focus();
        };

        /**
         * @name checkTime for check list
         * @desc Check valid totalTime       
         */
        function checkTime() {
            if (vm.endTime && vm.startTime) {
                if (Date.parse('01/01/2016 ' + vm.endTime) > Date.parse('01/01/2016 ' + vm.startTime)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
         * @name checkLunchTime for check list
         * @desc Check valid totalTime       
         */
        function checkLunchTime(startTime, endTime) {

            if (startTime && endTime) {
                if (Date.parse('01/01/2016 ' + endTime) > Date.parse('01/01/2016 ' + startTime)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        /**
        * @name totalKm for check list
        * @desc Calculate totalTime       
        */
        function totalKm() {
            if ((vm.attributes.FinishKMsA - vm.attributes.StartKMs) <= 0) {
                vm.attributes.totalKMs = '';
                vm.checkTotalKMs = true;
            } else {
                vm.attributes.totalKMs = (vm.attributes.FinishKMsA - vm.attributes.StartKMs);
                vm.checkTotalKMs = false;
            }
            return vm.checkTotalKMs;
        }

        /**
         * @name saveDocket for add and update
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function saveDocket() {

            // enabling loader
            $scope.showLoader = true;

            // checking selected checkbox            
            if (vm.checkTime() === true
                && vm.totalKm() === false
                && vm.invalidLunch1Time === false
                && vm.invalidLunch2Time === false) {

                var log = [];
                var checkListlog = [];

                angular.forEach(vm.check, function (value, key) {
                    if (value == true) {
                        this.push(key);
                    }
                }, log);
                angular.forEach(vm.checkList, function (value, key) {
                    if (value == true) {
                        this.push(key);
                    }
                }, checkListlog);
                var i = vm.attributes.LoadDocketDataModel.length - 1;

                if (vm.attributes.LoadDocketDataModel[i].LoadingSite === '' || vm.attributes.LoadDocketDataModel[i].Weight === 0 || vm.attributes.LoadDocketDataModel[i].LoadTime === '' || vm.attributes.LoadDocketDataModel[i].TipOffSite === '' || vm.attributes.LoadDocketDataModel[i].TipOffTime === '' || vm.attributes.LoadDocketDataModel[i].Material === '') {
                    vm.attributes.LoadDocketDataModel.splice(i, 1);
                }

                vm.attributes.BookingFleetId = vm.fleetRegistrationNumber.BookingFleetId;
                vm.attributes.SupervisorId = vm.BookingSiteSupervisors.SupervisorId;
                vm.attributes.DocketDate = vm.attributes.DocketDate;
                vm.attributes.FleetRegistrationId = vm.fleetRegistrationNumber.FleetRegistrationId;
                vm.attributes.AttachmentIds = log.toString();
                vm.attributes.DocketCheckListId = checkListlog.toString();
                vm.attributes.StartTime = $filter('date')(Date.parse('01/01/2016 ' + vm.startTime), 'HH:mm:ss');
                vm.attributes.EndTime = $filter('date')(Date.parse('01/01/2016 ' + vm.endTime), 'HH:mm:ss');
                vm.attributes.TravelTime = $filter('date')(Date.parse('01/01/2016 ' + vm.travelTime), 'HH:mm:ss');

                if (vm.attributes.LunchBreak1From != '')
                    vm.attributes.LunchBreak1From = $filter('date')(Date.parse('01/01/2016 ' + vm.attributes.LunchBreak1From), 'HH:mm:ss');
                if (vm.attributes.LunchBreak1End != '')
                    vm.attributes.LunchBreak1End = $filter('date')(Date.parse('01/01/2016 ' + vm.attributes.LunchBreak1End), 'HH:mm:ss');
                if (vm.attributes.LunchBreak2From != '')
                    vm.attributes.LunchBreak2From = $filter('date')(Date.parse('01/01/2016 ' + vm.attributes.LunchBreak2From), 'HH:mm:ss');
                if (vm.attributes.LunchBreak2End != '')
                    vm.attributes.LunchBreak2End = $filter('date')(Date.parse('01/01/2016 ' + vm.attributes.LunchBreak2End), 'HH:mm:ss');

                if (angular.element('#imageBase64')[0].value != '') {
                    vm.ImageBase64 = angular.element('#imageBase64')[0].value;
                    vm.attributes.ImageBase64 = vm.ImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
                } else {
                    vm.attributes.ImageBase64 = '';
                }

                if ($("#fileName").val() === '') {
                    vm.attributes.Image = '';
                }
                if (typeof $stateParams.DocketId !== 'undefined' && $stateParams.DocketId !== '') {
                    ManageDocketFactory
                     .updateDocket(vm.attributes)
                      .then(function () {
                          // enabling loader
                          $scope.showLoader = false;
                          //$location.path('booking/DocketList/' + vm.attributes.BookingFleetId);
                      });
                } else {
                  
                    ManageDocketFactory
                     .addDocket(vm.attributes)
                      .then(function () {
                          // enabling loader
                          $scope.showLoader = false;
                          $location.path('booking/DocketList/' + vm.attributes.BookingFleetId);
                      });
                }

            } else {

                $scope.validationError = true;
                vm.invalidTime = (vm.checkTime() === true) ? false : true;
                return false;
            }
        }

        /**
         * @name loadImageFileAsURL
         * @desc Convert Image to base64
          @returns {}
         */
        function loadImageFileAsURL() {
            var filesSelected = document.getElementById("inputFileToLoad").files;

            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var textAreaFileContents = document.getElementById
                    (
                        "textAreaFileContents"
                    );
                    $("#previewId").attr('src', fileLoadedEvent.target.result);
                    $("#imageBase64").val(fileLoadedEvent.target.result);
                    $("#fileName").val(filesSelected[0].name);
                    $('#clearImageId').show();
                };

                fileReader.readAsDataURL(fileToLoad);
            }
        }

        /**
         * @name clearImage
         * @desc For clear image and set as default image
          @returns {}
         */
        function clearImage() {
            $("#imageBase64").val('');
            $("#fileName").val('');
            $("#previewId").attr('src', CONST.CONFIG.DEFAULT_IMG);
            $('#clearImageId').hide();
        }
    }

    //Inject required stuff as parameters to factories controller function
    DocketViewCtrl.$inject = ['$scope', '$rootScope', 'UtilsFactory', 'BCAFactory', 'ManageDocketFactory', '$location', '$stateParams', '$state', '$uibModal', 'Upload', '$timeout', '$filter', 'CONST', 'uiGridConstants'];

    /**
     * @name DocketViewCtrl
     * @param $scope
     * @param $rootScope
     * @param UtilsFactory
     * @param BCAFactory
     * @param ManageDocketFactory
     * @param $location
     * @param $stateParams  
     * @param $state
     * @param $uibModal
     * @param Upload
     * @param $timeout
     * @param $filter
     * @param CONST
     * @param uiGridConstants
     */
    function DocketViewCtrl($scope, $rootScope, UtilsFactory, BCAFactory, ManageDocketFactory, $location, $stateParams, $state, $uibModal, Upload, $timeout, $filter, CONST, uiGridConstants) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.bookingFleetId = '';
        vm.docketList = [];
        vm.checkList = [];
        vm.viewAttributes = {
            "DocketId": "",
            "BookingFleetId": "",
            "SiteId": "",
            "FleetRegistrationId": "",
            "DocketNo": "",
            "StartTime": "",
            "EndTime": "",
            "TravelTime": "",
            "StartKMs": "",
            "FinishKMsA": "",
            "LunchBreak1From": "",
            "LunchBreak1End": "",
            "LunchBreak2From": "",
            "LunchBreak2End": "",
            "AttachmentIds": "",
            "DocketCheckListId": "",
            "IsActive": true,
            "ImageBase64": "",
            "SupervisorId": "",
            "LoadDocketDataModel": [{
                "DocketId": "",
                "LoadingSite": "",
                "Weight": 0,
                "LoadTime": "",
                "TipOffSite": "",
                "TipOffTime": "",
                "Material": "",
                "IsActive": "true",
            }]
        };
        vm.docketId = '';
        vm.uiGrid = {};

        //Method
        vm.isCheckedList = isCheckedList;
        vm.getAllDocketCheckboxList = getAllDocketCheckboxList;
        vm.getDocketDetail = getDocketDetail;
        $scope.downloadPrintDocket = downloadPrintDocket;
        vm.timeFormat = tConvert;

        //START UI-Grid Code
        vm.dataSetDocket = [
            {
                name: 'DocketNo',
                cellTemplate: '<a class="ui-grid-cell-contents ng-binding ng-scope" href="javascript:void(0);"  ui-sref="booking.ViewDocket({DocketId: row.entity.DocketId})">{{row.entity.DocketNo}}</a>'
            },
            {
                field: 'FleetBookingDateTime',              
                cellFilter: 'date:"dd-MM-yyyy HH:mm a"',// apply search filter for date format               
                filterCellFiltered: 'true',
            },
            {
                name: 'Fleet'
            },
            {
                name: 'Driver',
                dsplayName: 'Driver Name'
            },
            {
                name: 'IsDayShift',
                displayName: 'Shift',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{IsDayShift}}</div>'
            },                      
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: [ '<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void();" ui-sref="booking.ViewDocket({DocketId: row.entity.DocketId})"><i class="fa pe-7s-news-paper" aria-hidden="true"></i> View</a></li>' +
                                                '<li><a href="javascript:void();" ui-sref="booking.EditDocket({DocketId:  row.entity.DocketId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                                '<li><a href="javascript:void();" ng-click="grid.appScope.downloadPrintDocket(row.entity.DocketId);"><i class="fa pe-7s-print" aria-hidden="true"></i> Print </a></li>' +
                                    '</ul>' +
                                '</div>'
                              ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSetDocket);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
           * @name isCheckedList for check list
           * @desc for check checkboxes by Id while updating
           * @returns {*}
           */
        function isCheckedList(checkListIds) {
            vm.checkList = {};
            var array = checkListIds.split(',');
            if (array.length > 0) {
                angular.forEach(array, function (items) {
                    vm.checkList[items] = true;
                });
            }
        }

        /**
            * @name getAllDocketCheckboxList for check list
            * @desc Retrieve factories listing from factory
            * @returns {*}
            */
        function getAllDocketCheckboxList() {
            ManageDocketFactory
             .getAllDocketCheckboxList()
            .then(function () {
                vm.docketCheckList = ManageDocketFactory.docketCheckList.DataList;
            });
        }

        //Call on load 
        vm.getAllDocketCheckboxList();

        function tConvert(time) {
            // Check correct time format and split into components
            time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
                time = time.slice(1);  // Remove full string match value
                time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join(''); // return adjusted time or original string
        }

        /**
          * @name calculateTotalTime
          * @desc Calculate Total Hours with travel time and lunch breaks
          * @returns {*}
          */
        function calculateTotalTime() {

            if (vm.viewAttributes.StartTime !== '' && vm.viewAttributes.EndTime !== '') {

                //calculate difference of start and end time 
                var startActualTime = Date.parse('01/01/2016 ' + vm.viewAttributes.StartTime);
                var endActualTime = Date.parse('01/01/2016 ' + vm.viewAttributes.EndTime);
                var totalTime = endActualTime - startActualTime;

                // calculate difference of lunch break1 and subtract from Total hours
                if (vm.viewAttributes.LunchBreak1From !== '' && vm.viewAttributes.LunchBreak1End !== '') {
                    var lunchBreak1From = Date.parse('01/01/2016 ' + vm.viewAttributes.LunchBreak1From);
                    var LunchBreak1End = Date.parse('01/01/2016 ' + vm.viewAttributes.LunchBreak1End);
                    var diffLunchBreak1 = LunchBreak1End - lunchBreak1From;
                    totalTime -= diffLunchBreak1;

                    if (totalTime < 0) {                       
                        return false;
                    }
                }

                // calculate difference of lunch break2 and subtract from Total hours
                if (vm.viewAttributes.LunchBreak2From !== '' && vm.viewAttributes.LunchBreak2End !== '') {
                    var lunchBreak2From = Date.parse('01/01/2016 ' + vm.viewAttributes.LunchBreak2From);
                    var LunchBreak2End = Date.parse('01/01/2016 ' + vm.viewAttributes.LunchBreak2End);
                    var diffLunchBreak2 = LunchBreak2End - lunchBreak2From;
                    totalTime -= diffLunchBreak2;

                    if (totalTime < 0) { 
                        return false;
                    }
                }

                var totalTimeSecond = totalTime / 1000;
                var HH = Math.floor(totalTimeSecond / 3600);
                var MM = Math.floor(totalTimeSecond % 3600) / 60;                

                //Add Traveling time into total hours
                if (vm.viewAttributes.TravelTime !== '' && typeof vm.viewAttributes.TravelTime != "undefined") {

                    var d;
                    d = new Date('01/01/2016 ' + vm.viewAttributes.TravelTime);
                    d.setMinutes(d.getMinutes() + MM);
                    HH = d.getHours() + HH;
                    MM = d.getMinutes();
                } 

                //formatted total time
                vm.viewAttributes.TotalHour = ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM);
            }
        }

        //Check BookingFleetId param for Docketlist
        if (typeof $stateParams.BookingFleetId !== 'undefined' && $stateParams.BookingFleetId !== '') {
            vm.bookingFleetId = $stateParams.BookingFleetId;
            ManageDocketFactory
            .GetAllDocketByBookingFleetId(vm.bookingFleetId)
            .then(function () {
                vm.docketList = ManageDocketFactory.docketList.DataList;                
                vm.uiGrid.data = vm.docketList;
            });
        }

        //Check BookingFleetId param for DocketView
        if (typeof $stateParams.DocketId !== 'undefined' && $stateParams.DocketId !== '') {
            vm.docketId = $stateParams.DocketId;
            vm.getDocketDetail(vm.docketId);
        }

        /**
           * @name getDocketDetail
           * @desc Retrieve factories listing from factory
           * @returns {*}
           */
        function getDocketDetail(docketId) {
            ManageDocketFactory
           .getDocketDetail(docketId)
           .then(function () {
               vm.viewAttributes = ManageDocketFactory.docketDetail.DataObject;
               $("#image").attr('href', CONST.CONFIG.IMG_URL + vm.viewAttributes.Image);               
               calculateTotalTime();
               vm.isCheckedList(vm.viewAttributes.DocketCheckListId);

           });
        }

        /**
           * @name downloadPrintDocket
           * @desc print Docket
           * @returns {*}
           */
        function downloadPrintDocket(docketId) {
            vm.getAllDocketCheckboxList();
            ManageDocketFactory
                .getDocketDetail(docketId)
                .then(function () {
                    vm.viewAttributes = ManageDocketFactory.docketDetail.DataObject;
            
                    calculateTotalTime();
                    var array = vm.viewAttributes.DocketCheckListId.split(',');
                    var isDayShift = (vm.viewAttributes.IsDayShift === 0) ? "Day" : ((vm.viewAttributes.IsDayShift === 1)? "After Noon": "Night");
                    var iswethire = (vm.viewAttributes.Iswethire === true) ? "Yes" : "No";
                    var innerContents = '';

                    innerContents += '<h3 style="padding-top: 10px;paddding-bottom:20px;font-weight: 200; color: #6a6c6f; text-align:right;font-size:24px;font-family:Arial, Helvetica, sans-serif;">Docket Number:' + (vm.viewAttributes.DocketNo) ? vm.viewAttributes.DocketNo : '________' + '</h3><br>';
                    innerContents += '<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;">';
                    innerContents += '<tbody>';
                    innerContents += '<tr>';
                    innerContents += '<td width="50%">';
                    innerContents += '<table class="table table-bordered" cellpadding="0" cellspacing="0" style="border:1px solid #ddd;width:100%; font-family:Arial, Helvetica, sans-serif; font-size:13px; text-align:left;">';
                    innerContents += '<tbody>';
                    innerContents += '<tr><th width="180" style="border:1px solid #ddd; padding:8px; text-align-left;">Customer Name</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.CustomerName + '</td>';
                    innerContents += '<th width="180" style="border:1px solid #ddd; padding:8px;">Site Name</th>';
                    innerContents += '<td style="border:1px solid #ddd;padding:8px;">' + vm.viewAttributes.SiteName + '</td>';
                    innerContents += '</tr><tr>';
                    innerContents += '<th width="180" style="border:1px solid #ddd; padding:8px;">Contact Person Name</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.SupervisorName + '</td>';
                    innerContents += '<th width="180" style="border:1px solid #ddd; padding:8px;">Contract Number</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.BookingNumber + '</td>';
                    innerContents += '</tr><tr><th style="border:1px solid #ddd; padding:8px;">Driver\'s Name</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.DriverName + '</td>'
                    innerContents += '<th width="180" style="border:1px solid #ddd; padding:8px;">Shift</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + isDayShift + '</td>';
                    innerContents += '</tr><tr><th style="border:1px solid #ddd; padding:8px;">Date &amp; Time</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.DocketDate + '</td>';
                    innerContents += '<th width="180" style="border:1px solid #ddd; padding:8px;">Wet Hire</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + iswethire + '</td></tr>';
                    innerContents += '</tbody></table></td>';
                    //Second Table
                    innerContents += '<table class="table table-bordered text-center" width="100%" cellpadding="0" cellspacing="0" style="table-layout: fixed;border:1px solid #ddd; font-family:Arial, Helvetica, sans-serif; font-size:13px; margin-top:20px; text-align:center">';
                    innerContents += '<tbody><tr><td style="border:1px solid #ddd; padding:8px;"><label>Start</label></td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;"><label>End</label></td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;"><label>TravelTime</label></td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;"><label>Total Hours</label></td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;"><label>Brog Civil Truck No.</label></td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;"><label>Truck Rego</label></td></tr>';
                    innerContents += '<tr><td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.StartTime + '</td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.EndTime + '</td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.TravelTime + '</td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.TotalHour + '</td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.BorgCivilPlantNumber + '</td>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.Registration + '</td>';
                    innerContents += '</tr></tbody></table>';

                    //Lunch Table 
                    innerContents += '<table class="table m-t10 m-b0" style="font-family:Arial, Helvetica, sans-serif; font-size:13px;">';
                    innerContents += '<tbody><tr>';
                    innerContents += '<td nowrap="" style="padding:8px;"><h4 style="font-size:18px; padding-top:10px; padding-bottom:10px; width:130px;">Lunch</h4></td>';
                    innerContents += '<td style="padding:8px;"><p style="margin-bottom:10px;"><label style="font-size:12px;color:#666666; font-weight:400;">Break 1</label>';
                    innerContents += '<label style="font-size:12px;color:#666666; font-weight:400;"> From:' + ((vm.viewAttributes.LunchBreak1From != '00:00:00' && vm.viewAttributes.LunchBreak1From) ? vm.viewAttributes.LunchBreak1From : '______________') + '</label>';
                    innerContents += '<label style="font-size:12px;color:#666666; font-weight:400;"> To:' + ((vm.viewAttributes.LunchBreak1End != '00:00:00' && vm.viewAttributes.LunchBreak1End) ? vm.viewAttributes.LunchBreak1End : '______________') + '</label>';
                    innerContents += '</p><p style="margin-bottom:0px;"><label style="font-size:12px;color:#666666; font-weight:400;">Break 2</label>';
                    innerContents += '<label style="font-size:12px;color:#666666; font-weight:400;"> From:' + ((vm.viewAttributes.LunchBreak2From != '00:00:00' && vm.viewAttributes.LunchBreak2From) ? vm.viewAttributes.LunchBreak2From : '______________') + '</label>';
                    innerContents += '<label style="font-size:12px;color:#666666; font-weight:400;"> To:' + ((vm.viewAttributes.LunchBreak2End != '00:00:00' && vm.viewAttributes.LunchBreak2End) ? vm.viewAttributes.LunchBreak2End : '______________') + '</label>';
                    innerContents += '</p></td>';
                    innerContents += '</tr></tbody></table>';

                    //Loading Table
                    innerContents += '<table class="table table-bordered" cellpadding="0" cellspacing="0" style="border:1px solid #ddd; font-family:Arial, Helvetica, sans-serif; font-size:13px; margin-top:0px; text-align:left;">';
                    innerContents += '<tbody><tr><th nowrap="" width="1%" style="border:1px solid #ddd; padding:8px;">Load</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Loading Site</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Weight(tonne)</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Load Time</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Tip Off Site</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Tip Off Time</th>';
                    innerContents += '<th style="border:1px solid #ddd; padding:8px;">Material</th>';
                    innerContents += '</tr>';
                    //console.log(vm.viewAttributes.LoadDocket[0]);
                    if (vm.viewAttributes.LoadDocket.length > 0) {

                        for (var i = 0; i < vm.viewAttributes.LoadDocket.length; i++) {
                            if (vm.viewAttributes.LoadDocket[i].LoadTime != null || vm.viewAttributes.LoadDocket[i].LoadTime != '')
                                var loadTime = tConvert(vm.viewAttributes.LoadDocket[i].LoadTime);
                            if (vm.viewAttributes.LoadDocket[i].TipOffTime != null || vm.viewAttributes.LoadDocket[i].TipOffTime != '')
                                var tipOffTime = tConvert(vm.viewAttributes.LoadDocket[i].TipOffTime);
                            innerContents += '<tr>';
                            innerContents += '<td align="center" style="border:1px solid #ddd; padding:8px;">' + i + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.LoadDocket[i].LoadingSite + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.LoadDocket[i].Weight + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + loadTime + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.LoadDocket[i].TipOffSite + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + tipOffTime + '</td>';
                            innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.LoadDocket[i].Material + '</td>';
                            innerContents += '</tr>';

                        }
                    } else {
                        innerContents += '<tr>';
                        innerContents += '<td align="center" colspan="7" style="padding:8px;">No Records Found</td>';
                        innerContents += '</tr>';
                    }
                    innerContents += '</tbody></table>';

                    //Check list Table
                    innerContents += '<table width="100%">';
                    innerContents += '<tbody><tr>';
                    innerContents += '<td width="75%" style="vertical-align: top">';

                    if (vm.docketCheckList.length > 0) {
                        innerContents += '<ul class="list-left-box" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; margin-top:20px; padding-left:0;">';
                        for (var i = 0; i < vm.docketCheckList.length; i++) {
                            innerContents += '<li style="position:relative; display: inline-block;vertical-align: top;margin-right: 5px;width: 23%; padding-left:21px; padding-bottom:7px;">';
                            if (array.indexOf(vm.docketCheckList[i].DocketCheckListId) != -1) {
                                innerContents += '<img src="Content/images/form-checkbox.png" style="vertical-align:middle; margin-right:5px;position:absolute;top:0;left:0;"/>';
                            }
                            else {
                                innerContents += '<img src="Content/images/form-checkbox-notselect.png" style="vertical-align:middle; margin-right:5px;position:absolute;top:0;left:0;"/>';
                            }
                            innerContents += vm.docketCheckList[i].Title;
                            innerContents += '</li>';
                        }
                        innerContents += '</ul>'
                    }

                    innerContents += '</td>';
                    innerContents += '<td width="25%" align="right" style="vertical-align: top">';

                    // KMs Table
                    innerContents += '<table class="table table-bordered" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #ddd; font-family:Arial, Helvetica, sans-serif; font-size:13px;  text-align:left;">';
                    innerContents += '<tbody><tr><th width="110" style="border:1px solid #ddd; padding:8px;">Start KMs</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.StartKMs + '</td>';
                    innerContents += '</tr><tr><th style="border:1px solid #ddd; padding:8px;">Finish KMs</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + vm.viewAttributes.FinishKMsA + '</td>';
                    innerContents += '</tr><tr><th style="border:1px solid #ddd; padding:8px;">Total KMs</th>';
                    innerContents += '<td style="border:1px solid #ddd; padding:8px;">' + (((vm.viewAttributes.FinishKMsA - vm.viewAttributes.StartKMs) > 0) ? (vm.viewAttributes.FinishKMsA - vm.viewAttributes.StartKMs) : 0) + '</td>';
                    innerContents += '</tr></tbody></table>';
                    innerContents += '</td></tr></tbody></table>';
                    innerContents += '<p style="font-size:13px;font-family:Arial, Helvetica, sans-serif;margin-top:20px;margin-bottom:10px;">By signing this Daliy Drivers docket I confirm that I am free from the effects of drugs/alcohol and fatigue';
                    innerContents += 'and I am fit for work. I understand that I am to report to my supervisor if not fit for duty.';
                    innerContents += 'I understand that if I make a false or misleading declaration it may be considered to be an offence and I may be subject to Brog Civil disciplinary action.<br>';
                    innerContents += 'Driver\'s Signature_____________________________<br></p>';

                    // Signature Table
                    innerContents += '<table width="100%"><tbody><tr><td>Customer Name_________________</td>';
                    innerContents += '<td align="right">Supervisor Signature_________________</td></tr></tbody></table>';

                    var popupWindow = window.open('', '_blank', 'width=800,height=900,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWindow.document.open();
                    popupWindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
                    popupWindow.focus();
                    popupWindow.document.close();


                });               
        }
    }
})();