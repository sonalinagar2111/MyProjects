(function () {
    'use strict';

    /**
     * Configuration Controller
     * Created by: (SIPL)
     */

    angular
        .module('borgcivil')
        .controller('FleetRegistrationListCtrl', FleetRegistrationListCtrl)
        .controller('ManageFleetRegistrationCtrl', ManageFleetRegistrationCtrl)
        .controller('UserListCtrl', UserListCtrl)
        .controller('ManageUserCtrl', ManageUserCtrl)
        .controller('DriverListCtrl', DriverListCtrl)
        .controller('ManageDriverCtrl', ManageDriverCtrl)
        .controller('FleetTypeListCtrl', FleetTypeListCtrl)
        .controller('ManageFleetTypeCtrl', ManageFleetTypeCtrl)
        .controller('WorkTypeCtrl', WorkTypeCtrl)
        .controller('CheckListCtrl', CheckListCtrl)
        .controller('CustomerListCtrl', CustomerListCtrl)
        .controller('ManageCustomerCtrl', ManageCustomerCtrl)
        .controller('SiteListCtrl', SiteListCtrl)
        .controller('CreateSiteCtrl', CreateSiteCtrl)
        .controller('UpdateSiteCtrl', UpdateSiteCtrl)
        .controller('SupervisorCtrl', SupervisorCtrl)
        .controller('GateListCtrl', GateListCtrl)
        .controller('ManageGateCtrl', ManageGateCtrl)
        .controller('TaxCtrl', TaxCtrl)     
        .controller('RateListCtrl', RateListCtrl)
        .controller('ManageRateCtrl', ManageRateCtrl)

    //Inject required stuff as parameters to factories controller function
    FleetRegistrationListCtrl.$inject = ['$scope', '$state', '$uibModal', 'ManageFleetRegistrationFactory', 'BookingDashboardFactory', 'UtilsFactory', 'CONST', '$stateParams'];

    /**
     * @name FleetRegistrationListCtrl
     * @param $scope
     * @param $state
     * @param $uibModal
     * @param ManageFleetRegistrationFactory
     * @param BookingDashboardFactory
     * @param UtilsFactory
     * @param CONST
     * @param $stateParams
     */
    function FleetRegistrationListCtrl($scope, $state, $uibModal, ManageFleetRegistrationFactory, BookingDashboardFactory, UtilsFactory, CONST, $stateParams) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.fleetRegList = '';
        vm.fleetAttribute = '';
        //vm.images = '';
        vm.filePath = CONST.CONFIG.IMG_URL;
        vm.uiGrid = {};

        //Methods
        vm.getFleetRegList = getFleetRegList;
        vm.getFleetRegListByFleetTypeId = getFleetRegListByFleetTypeId;
        $scope.viewFleetRegistration = viewFleetRegistration;
        vm.deleteFleetRegistration = deleteFleetRegistration;
        vm.cancel = cancel;

        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'BorgCivilPlantNumber',
                displayNameL: 'Plant Number',
                cellTemplate: '<a class="ui-grid-cell-contents ng-binding ng-scope" href="javascript:void(0);" ng-click="grid.appScope.viewFleetRegistration(row.entity);">{{row.entity.BorgCivilPlantNumber}}</a>'
            },
            {
                name: 'MakeModelYear',
                displayNameL: 'Make/Model/Year'                
            },
            {
                name: 'VinEngineNumber',
                displayNameL: 'VIN/Engine Number'
            },
            {
                name: 'InsuranceDate'                  
            },
            {
                name: 'Fleet',
                displayNameL: 'Fleet Type'
            },
            {
                name: 'ServiceInterval'                    
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate:  ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                        '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                            '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                        '</a>' +
                                        '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                    '<li><a href="javascript:void(0)" ui-sref="configuration.EditFleetRegistration({FleetRegistrationId: row.entity.FleetRegistrationId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                        '</ul>' +
                                    '</div>'
                                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code


        // setting empty the value of session storage variables
        sessionStorage.FleetTypeId = "";

        /**
         * @name getFleetRegList
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getFleetRegList() {

            //Call Fleet Registration factory get all factories data
            ManageFleetRegistrationFactory
                .getAllFleetRegistration()
            .then(function () {
                vm.uiGrid.data = ManageFleetRegistrationFactory.fleetRegLists.DataList;               
            });
        }

        /**
        * @name getFleetRegListByFleetTypeId
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getFleetRegListByFleetTypeId(fleetTypeId) {
            sessionStorage.FleetTypeId = fleetTypeId;

            //Call Fleet Registration factory get all factories data
            BookingDashboardFactory.getAvailableFleetsByFleetTypeId(fleetTypeId)
             .then(function () {
                 vm.fleetRegistrationList = BookingDashboardFactory.fleetRegistrationList;
                 vm.uiGrid.data = vm.fleetRegistrationList.DataList;
             }); 
        }

        /* Call getFleetRegList method to show the factories data list on page load */
        if (typeof $stateParams.FleetTypeId !== 'undefined' && $stateParams.FleetTypeId !== '') {
            vm.getFleetRegListByFleetTypeId($stateParams.FleetTypeId);
        } else {
            vm.getFleetRegList();
        }

        /**
        * @name viewFleetRegistration
        * @desc View Fleet Registration on popup modal        
        */
        function viewFleetRegistration(fleetRegData) {
            vm.fleetAttribute = fleetRegData;
            vm.fleetAttribute.images = fleetRegData.Image.split(',');
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/FleetRegistrationDetail.html',
                scope: $scope
            });
        }

        /**
          * @name cancel
          * @desc To Dismiss Modal.
          */
        function cancel() {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name deleteFleetRegistration
        * @desc Delete fleet registration        
        */
        function deleteFleetRegistration(fleetRegistrationId) {
            ManageFleetRegistrationFactory
            .deleteFleetRegistration(fleetRegistrationId)
            .then(function () {
                $state.reload();
            });
        }
    }

    //Inject required stuff as parameters to factories controller function
    ManageFleetRegistrationCtrl.$inject = ['$scope', '$stateParams', '$state', 'UtilsFactory', 'ManageFleetRegistrationFactory', 'BCAFactory', 'DriverFactory', 'Upload', '$timeout', '$filter', 'CONST', '$rootScope', '$location'];

    /**
     * @name ManageFleetRegistrationCtrl
     * @param $scope
     * @param $stateParams
     * @param $state
     * @param UtilsFactory
     * @param ManageFleetRegistrationFactory
     * @param BCAFactory
     * @param DriverFactory
     * @param Upload
     * @param $timeout
     * @param $filter
     * @param CONST, 
     * @param $rootScope   
     * @param $location
     */
    function ManageFleetRegistrationCtrl($scope, $stateParams, $state, UtilsFactory, ManageFleetRegistrationFactory, BCAFactory, DriverFactory, Upload, $timeout, $filter, CONST, $rootScope, $location) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.fleetRegDetail = '';
        vm.fleetRegistrationId = '';
        vm.fleetTypeList = '';
        vm.driverList = [];
        vm.fleetType = '';      
        vm.yearRegx = /^(19[5-9]\d|20[0-4]\d|2050)$/;      
        vm.setForFirstTime = false;
        vm.Images = '';
        vm.imagePath = CONST.CONFIG.IMG_URL;
        vm.files = [];
        vm.attachementList = '';
        vm.filesSelected = [];
        vm.deletedImage = [];      
        vm.tabs = [{ active: true }, { active: false }];

        //Others tab
        vm.othersList = [];
        vm.mutipleFiles = { File: [], FileName: [], OtherTabId: '' };
        vm.others = {};
        vm.othersError = false;

        vm.isSubcontractor = "customer";

        // map create Fleet Registration property
        vm.attributes = {
            FleetRegistrationId: '',
            FleetTypeId: '',
            SubcontractorId: '',
            Make: '',
            Model: '',
            Capacity: '',
            Registration: '',
            BorgCivilPlantNumber: '',
            VINNumber: '',
            EngineNumber: '',
            InsuranceDate: new Date(),
            InsuranceExpiryDate: new Date(),
            InsuranceCompany: '',
            InsurancePolicyNumber: '',
            CurrentMeterReading: '',
            LastServiceMeterReading: '',
            ServiceInterval: '',
            HVISType: '',
            //DriverId:'',
            UnavailableFromDate: '',
            UnavailableToDate: '',
            UnavailableNote: '',
            AttachmentId: '',
            IsActive: true,
            CreatedBy: '',
            EditedBy: '',
            files: [],
            Others: {},//others tab
        };

        //Methods
        vm.getFleetType = getFleetType;
        vm.reset = reset;
        vm.updateDetails = updateDetails;
        vm.closeForm = closeForm;
        vm.getAttachments = getAttachments;
        vm.getSubcontractor = getSubcontractor;
        vm.deleteImage = deleteImage;
        vm.getAvailableDriversList = getAvailableDriversList;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.loadOtherImageFileAsURL = loadOtherImageFileAsURL;
        vm.addOthersRow = addOthersRow;
        vm.deleteOtherImage = deleteOtherImage;
        vm.deleteOtherDetail = deleteOtherDetail;

        /**
          * @name goNextTab
          * @desc Tab Navigation          
          */
        vm.goNextTab = function (index) {            
            for (var i = 0; i <= vm.tabs.length; i++) {
                if (i === index + 1) {
                    vm.tabs[index + 1].active = true;
                }
                else {
                    vm.tabs[index].active = false;
                }
            }
        }

        /**
          * @name goPreviousTab
          * @desc Tab Navigation         
          */
        vm.goPreviousTab = function (index) {
            for (var i = 0; i <= vm.tabs.length; i++) {
                if (i === index - 1) {
                    vm.tabs[index - 1].active = true;
                }
                else {
                    vm.tabs[index].active = false;
                }
            }
            vm.tabs[index - 1].active = true;
        }

        /**
          * Reset insurance date
          */
        vm.resetDate = function () {
            vm.attributes.InsuranceDate = "";
        }

        /**
         * Reset insurance expiry date
         */
        vm.resetExpiryDate = function () {
            vm.attributes.InsuranceExpiryDate = "";
        }

        /**
          * Reset date range
          */
        vm.resetDateRange = function () {
            vm.attributes.UnavailableFromDate = "";
            vm.attributes.UnavailableToDate = "";
        }

        /**
          * @name getFleetType
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getFleetType() {
            BCAFactory
            .getFleetTypesDDL()
            .then(function () {
                vm.fleetTypeList = BCAFactory.fleetTypeList.DataList;
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
                    vm.attachmentList = BCAFactory.attachementList.DataObject.Attachments;
                });
        }

        /**
          * @name getSubcontractor for dropdown
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getSubcontractor() {

            //Call BCAFactory factory get all factories data
            BCAFactory
                .getSubcontractor()
                .then(function () {
                    vm.subcontractorList = BCAFactory.subContractors.DataObject;
                });
        }

        /**
         * @name getAvailableDriversList for dropdown
         * @desc Get all available list of driver
         * @returns {*}
         */
        function getAvailableDriversList() {

            //Call DriverFactory factory get all factories data
            DriverFactory
                .getDriversNotMapped()
                .then(function () {
                    vm.driverList = DriverFactory.drivers.DataList;                                    
                });
        }

        //Set to date according to from date
        vm.changeFromDate = function (fromDate) {
            vm.attributes.UnavailableToDate = fromDate;
        }

        //Fetch attachments on page load
        vm.getAttachments();
        vm.getSubcontractor();
        vm.getAvailableDriversList();

        //Get Fleet Registration Data by ID for update
        $timeout(function () {

            if (typeof $stateParams.FleetRegistrationId !== 'undefined' && $stateParams.FleetRegistrationId !== '') {

                vm.fleetRegistrationId = $stateParams.FleetRegistrationId;

                //Get detail of the Fleet
                ManageFleetRegistrationFactory
                .getFleetRegistrationDetail(vm.fleetRegistrationId)
                .then(function () {
                    vm.attributes = ManageFleetRegistrationFactory.fleetRegInfo.DataObject;
                    vm.attributes.Year = parseInt(vm.attributes.Year);
                    vm.attributes.CurrentMeterReading = parseInt(vm.attributes.CurrentMeterReading);
                    vm.attributes.LastServiceMeterReading = parseInt(vm.attributes.LastServiceMeterReading);
                    vm.attributes.InsuranceDate = new Date(vm.attributes.InsuranceDate);
                    vm.attributes.InsuranceExpiryDate = new Date(vm.attributes.InsuranceExpiryDate);
                    vm.attributes.UnavailableFromDate = new Date(vm.attributes.UnavailableFromDate);
                    vm.attributes.UnavailableToDate = new Date(vm.attributes.UnavailableToDate);

                    //Check image is exist or not
                    if (vm.attributes.Image != '') {
                        vm.files = vm.attributes.Image.split(',');
                    }

                    //Check others list is exist or not
                    if (vm.attributes.OtherTabList.length > 0) {
                        vm.othersList = vm.attributes.OtherTabList;                       
                        vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);                        
                    }

                    //Get Fleet type list
                    BCAFactory
                       .getFleetTypesDDL()
                       .then(function () {
                           vm.fleetTypeList = BCAFactory.fleetTypeList.DataList;
                           vm.fleetType = $filter('filter')(vm.fleetTypeList, { FleetTypeId: vm.attributes.FleetTypeId })[0];
                       });

                    //For binding the driver object when first time data render 
                    if (typeof vm.attributes.DriverDetail !== 'undefined' && vm.attributes.DriverDetail !== '' && !vm.setForFirstTime) {
                       
                        vm.driverList.push(vm.attributes.DriverDetail[0]);
                        vm.driver = $filter('filter')(vm.driverList, { DriverId: vm.attributes.DriverId })[0];
                        vm.setForFirstTime = true;
                    }
                })
            } else {

                //List of Fleet Types Call on page load
                vm.getFleetType();
            }
        }, 500);
   
        /**
          * @name updateDetails
          * @desc Save records of Fleet Registration
          * @returns {*}
          */
        function updateDetails(add_fleetregistration_form) {
           
            var checkRoute = sessionStorage.FleetTypeId;

            // Assign objects
            vm.attributes.Others = vm.othersList;
            vm.attributes.files = vm.Image;
            vm.attributes.FleetTypeId = vm.fleetType.FleetTypeId;
            vm.attributes.DriverId = vm.driver.DriverId;

            if (typeof $stateParams.FleetRegistrationId !== 'undefined' && $stateParams.FleetRegistrationId !== '') {
                vm.attributes.FleetRegistrationId = vm.fleetRegistrationId;
                vm.attributes.Image = vm.files.join(',');

                //Update fleet registration detail
                ManageFleetRegistrationFactory
                .updateFleetRegistration(vm.attributes)
                .then(function () {
                    
                    //checkRoute: FleetTypeId
                    if (checkRoute != "")
                        $location.path('/booking/FleetListByFleetTypeId/' + checkRoute);
                    else
                        $state.go('configuration.FleetRegistrationList');
                });
            } else {
               
                //Add new fleet registration detail
                ManageFleetRegistrationFactory
                .addFleetRegistration(vm.attributes)
                .then(function () {
                    $state.go('configuration.FleetRegistrationList');
                });
            }

            // Setting empty the value of session storage variables
            sessionStorage.FleetTypeId = "";
        }

        // Reset Function 
        var originalAttributes = angular.copy(vm.attributes);

        /**
       * @name reset
       * @desc Reset elements value
       * @returns {*}
       */
        function reset() {
            vm.attributes = angular.copy(originalAttributes);
        };

        /**
        * @name loadImageFileAsURL
        * @descDisplay Image name 
        * @returns {*}
        */
        function loadImageFileAsURL() {

            vm.attributes.Image = '';
            for (var i = 0; i < document.getElementById("inputFileToLoad").files.length; i++) {
                vm.filesSelected.push(document.getElementById("inputFileToLoad").files[i]);
                vm.files.push(document.getElementById("inputFileToLoad").files[i].name);               
            }
        } 

        /**
         * @name loadOtherImageFileAsURL
         * @descDisplay and manage Image name and Objects
         * @returns {*}
         */
        function loadOtherImageFileAsURL() {

            //START mutiple objects of multifile uploads
            if (document.getElementById("inputOtherFileToLoad").files.length > 0) {

                //OtherTabId='': For temporary Image records
                vm.mutipleFiles = [];

                // Store file objects and file name into an array of objects                
                for (var i = 0; i < document.getElementById("inputOtherFileToLoad").files.length; i++) {

                    var imgObj = { File: [], FileName: [], OtherTabId: '' };                   
                    imgObj.FileName = (document.getElementById("inputOtherFileToLoad").files[i].name)
                    imgObj.File = vm.othersImage[i];
                    imgObj.OtherTabId = '';
                    vm.mutipleFiles.push(imgObj);
                }                
            }           
            //END  mutiple objects of multifile uploads
        }

        /**
        * @name addOthersRow
        * @desc Add new record into temporary object
        * @returns {*}
        */
        function addOthersRow() {
           
            //Image object file[] and Image[]            
            vm.others.OtherFile = vm.mutipleFiles;
           
            //Check required of subject and files
            if ((vm.others.Subject !== '' && typeof vm.others.Subject !== 'undefined')
                && (vm.others.OtherFile.length > 0)) {

                //This is main "Other" object and this will pass as a post param(Add/Update Fleet registration)
                vm.othersList.push(vm.others);
                vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);               

                //Do empty objects 
                vm.others = {
                    Subject: '',
                    Note: '',
                    OtherFile: {},
                    OtherTabId: ''
                }

                vm.mutipleFiles = vm.mutipleFiles = [];;
                vm.othersError = false;
            } else {

                //Error message displayed for 2 second
                vm.othersError = true;
                setTimeout(function () {
                    vm.othersError = false;
                    $scope.$apply();

                }, 2000);
            }           
        }


        /**
        * @name deleteImage
        * @desc remove Image name 
        * @returns {*}
        */
        function deleteImage(index, imageName) {
            
            vm.files.splice(index, 1);
            vm.deletedImage.push(imageName);
            var isSelectedImage = false;

            if (vm.filesSelected.length > 0) {
                for (var i = 0; i < vm.filesSelected.length ; i++) {
                    if (typeof vm.filesSelected[i] != 'undefined' && vm.filesSelected[i].name == imageName) {
                        vm.filesSelected.splice(i, 1);
                        isSelectedImage = true;
                        //delete vm.filesSelected[i];
                    }
                }
            }

            //Delete selected image
            if (vm.fleetRegistrationId != '' && !isSelectedImage) {
                var splitImage = imageName.split('.');
                ManageFleetRegistrationFactory.deleteDocumentByName(splitImage[0], splitImage[1], vm.fleetRegistrationId);
            }
        }

        /**
       * @name deleteOtherImage
       * @desc Remove other images from the record
       * @returns {*}
       */
        function deleteOtherImage(perentIndex, imageIndex, imageObj) {
           
            //Dynamic Deleted
            if (imageObj.OtherTabId !== '') {
                
                BCAFactory.deleteOtherTab(imageObj);                              
            } 

            //Remove from list of image array
            vm.othersList[perentIndex].OtherFile.splice(imageIndex, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }

        /**
        * @name deleteOtherDetail
        * @desc Remove other tab complete records 
        * @returns {*}
        */
        function deleteOtherDetail(otherObj, index) {

            //Dynamic delete from database
            if (otherObj.OtherTabId !== '', typeof otherObj.OtherTabId !== 'undefined') {  
               
                BCAFactory.deleteOtherTab(otherObj);               
            }

            //Remove from list of array
            vm.othersList.splice(index, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }

        //Close form and navigate to list page
        function closeForm() {
            $state.go('configuration.FleetRegistrationList');
        }
    };

    //Inject required stuff as parameters to factories controller function
    UserListCtrl.$inject = ['$scope', '$state', 'UtilsFactory', 'UserFactory', '$stateParams'];

    /**
        * @name UserListCtrl
        * @param $scope
        * @param $state
        * @param UtilsFactory
        * @param UserFactory
        * @param $stateParams
       */
    function UserListCtrl($scope, $state, UtilsFactory, UserFactory, $stateParams) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.userId = '';
        vm.countries = {};
        vm.states = {};
        vm.userList = {};

        //Methods
        vm.getAllCountries = getAllCountries;
        vm.getStates = getStates;
        vm.getAllUsers = getAllUsers;
        vm.deleteUser = deleteUser;

        /**
        * @name getAllUsers
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAllUsers() {
            UserFactory
             .getAllEmployee()
             .then(function () {
                 vm.userList = UserFactory.users.DataList;
                 vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.userList);
             });
        }       

        /**
         * @name getAllCountries
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getAllCountries() {
            UserFactory
            .getAllCountry()
            .then(function () {
                vm.countries = UserFactory.countries;
            });

        }

        //Call on page load
        vm.getAllUsers();
        vm.getAllCountries();

        /**
         * @name getAllStates
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getStates(countryId) {
            UserFactory
             .getAllState(countryId)
             .then(function () {
                 vm.states = UserFactory.states;
             });
        }

        /**
        * @name deleteUser
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function deleteUser(userId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    UserFactory
                        .deleteEmployee(userId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    ManageUserCtrl.$inject = ['$scope', '$state', 'UserFactory', '$stateParams', 'CONST'];

    /**
       * @name ManageUserCtrl
       * @param $scope
       * @param $state
       * @param UserFactory
       * @param $stateParams
       * @param CONST
       */
    function ManageUserCtrl($scope, $state, UserFactory, $stateParams, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.userId = '';
        vm.countries = {};
        vm.country = '';
        vm.state = '';
        vm.states = {};
        vm.role = '';

        //Job Title Select Listing
        vm.roles = {};
        vm.Image = CONST.CONFIG.DEFAULT_IMG;
        vm.attributes = {
            RoleId: '',
            FirstName: '',
            SurName: '',
            Email: '',
            ContactNumber: '',
            Address1: '',
            Address2: '',
            CountryId: '',
            StateId: '',
            City: '',
            ZipCod: '',
            ImageBase64: '',
            EmploymentCategoryId: '',
            EmploymentStatusId: '',
            IsActive: true
        };
        vm.passwordAttributes = {

        };

        //Methods
        vm.getAllCountries = getAllCountries;
        vm.getStates = getStates;
        vm.updateDetails = updateDetails;
        vm.getAllRoles = getAllRoles;
        vm.clearImage = clearImage;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.changePassword = changePassword;

        //For Edit User
        if (typeof $stateParams.UserId !== 'undefined' && $stateParams.UserId !== '') {
            vm.userId = $stateParams.UserId;
            UserFactory
            .getEmployeeDetail(vm.userId)
            .then(function () {
                vm.country = { Value: '' };
                vm.state = { Value: '' };
                vm.attributes = UserFactory.userInfo.DataObject;
                vm.country.Value = vm.attributes.CountryId;
                vm.state.Value = vm.attributes.StateId;
                vm.attributes.ContactNumber = parseInt(vm.attributes.ContactNumber);
                vm.attributes.ZipCode = parseInt(vm.attributes.ZipCode);
                vm.role = vm.attributes.RoleId
                vm.Image = CONST.CONFIG.IMG_URL + vm.attributes.Image;
                $("#fileName").val(vm.attributes.Image);
                $("#previewId").attr('src', CONST.CONFIG.IMG_URL + vm.attributes.Image);
                vm.getStates(vm.attributes.CountryId)
            });
        }

        /**
         * @name getAllCountries
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getAllCountries() {
            UserFactory
            .getAllCountry()
            .then(function () {
                vm.countries = UserFactory.countries;
            });
        }

        //Call on page load
        vm.getAllCountries();

        /**
        * @name getAllRoles
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAllRoles() {
            UserFactory
            .getAllRoles()
            .then(function () {
                vm.roles = UserFactory.roles.DataList;
            });
        }

        //Call on page load
        vm.getAllRoles();

        /**
         * @name getAllStates
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getStates(countryId) {
            if (typeof countryId != 'undefined') {
                UserFactory
                 .getAllState(countryId)
                 .then(function () {
                     vm.states = UserFactory.states;
                 });
            } else {
                vm.states = "";
            }
        }

        /**
          * @name loadImageFileAsURL
          * @desc Convert Image to base64
          * @returns {*}
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
                    $("#fileName").html(filesSelected[0].name);
                    $('#clearImageId').show();
                };

                fileReader.readAsDataURL(fileToLoad);
            }
        }

        /**
         * @name clearImage
         * @desc For clear image and set as default image
         * @returns {*}
         */
        function clearImage() {
            $("#imageBase64").val('');
            $("#fileName").html('');
            $("#previewId").attr('src', CONST.CONFIG.DEFAULT_IMG);
            $('#clearImageId').hide();
        }

        /**
        * @name updateDetails
        * @desc Update User detail
        * @returns {*}
        */
        function updateDetails(formValid) {
            if (angular.element('#imageBase64')[0].value != '') {
                vm.ImageBase64 = angular.element('#imageBase64')[0].value;
                vm.attributes.ImageBase64 = vm.ImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
            } else {
                vm.attributes.ImageBase64 = '';
            }

            vm.attributes.CountryId = vm.country.Value;
            vm.attributes.StateId = vm.state.Value;
            vm.attributes.RoleId = vm.role;

            //User Add/Edit
            if (typeof vm.userId !== 'undefined' && vm.userId !== '') {
                UserFactory
                 .updateEmployee(vm.attributes)
                 .then(function () {
                     window.location.reload();
                     $scope.$apply(function () {
                         $rootScope.Image = CONST.CONFIG.IMG_URL + localStorage["Image"];
                     });
                 });

            } else {

                UserFactory
                 .addEmployee(vm.attributes)
                 .then(function () {
                     $state.go("configuration.UserList");
                 });
            }
        }

        /**
       * @name changePassword
       * @desc Update User password
       * @returns {*}
       */
        function changePassword(form) {

            vm.passwordAttributes.EmployeeId = 'e9da2bf0-7376-4770-922e-0a9ae26b2f35';
            UserFactory
            .changePassword(vm.passwordAttributes)
            .then(function () {
                console.log("password Updated");
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    DriverListCtrl.$inject = ['$scope', '$state', 'UtilsFactory', 'DriverFactory', '$stateParams', 'CONST'];

    /**
        * @name DriverListCtrl
        * @param $scope
        * @param $state
        * @param UtilsFactory
        * @param DriverFactory     
        * @param $stateParams
        * @param CONST
       */
    function DriverListCtrl($scope, $state, UtilsFactory, DriverFactory, $stateParams, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.driverId = '';
        vm.countries = {};
        vm.states = {};
        vm.driverList = {};
        $scope.imagePath = CONST.CONFIG.IMG_URL;
        $scope.defaultImg = CONST.CONFIG.BASE_URL + CONST.CONFIG.DEFAULT_IMG;
        vm.uiGrid = {};

        //Methods
        vm.getAllDriver = getAllDriver;
        //vm.getStates = getStates;
        //vm.getAllUsers = getAllUsers;
        $scope.deleteDriver = deleteDriver;

        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'Name',
                field: 'FirstName',
                cellTemplate: '<div class="driver-user ui-grid-cell-contents ng-binding ng-scope">' +
                        '<div class="driver-img">'+
                            '<img ng-src="{{(row.entity.Image !== \'\')?(grid.appScope.imagePath+row.entity.Image):(grid.appScope.defaultImg)}}" height="30" width="30"/> {{row.entity.FirstName}}' +
                        '</div>'+
                       
                        '</div>'
            },
            {
                name: 'EmploymentInfo'               
            },
            {
                name: 'LicenseInfo'
            },
            {
                name: 'CardInfo'
            },
            {
                name: 'Awards'               
            },
            {
                name: 'BaseRate'
            },
            {
                name: 'Shift'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)"><i class="fa fa-bus" aria-hidden="true"></i> Assign To Vehicle</a></li>' +
                                                '<li><a href="javascript:void(0)" ui-sref="configuration.EditDriver({DriverId: row.entity.DriverId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit Driver</a></li>' +
                                                '<li><a href="javascript:void(0)"><i class="fa pe-7s-user" aria-hidden="true"></i> Manage Driver</a></li>' +
                                    '</ul>' +
                                '</div>'
                              ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);
        vm.uiGrid.rowHeight = 40; //Set row height for viewing driver image
        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
        * @name getAllDriver
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getAllDriver() {
            DriverFactory
             .getAllDriver()
             .then(function () {
                 vm.driverList = DriverFactory.drivers.DataList;
                 //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.driverList);
                 vm.uiGrid.data = vm.driverList;
             });
        }

        //Call on page load
        vm.getAllDriver();

        /**
        * @name deleteDriver
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function deleteDriver(driverId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    DriverFactory
                        .deleteDriver(driverId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller functio
    ManageDriverCtrl.$inject = ['$scope', '$state', 'DriverFactory', 'BCAFactory', 'UserFactory', 'UtilsFactory', '$stateParams', 'CONST', '$filter', '$uibModal'];

    /**
    * @name ManageDriverCtrl
    * @param $scope
    * @param $state
    * @param DriverFactory
    * @param BCAFactory
    * @param UserFactory
    * @param UtilsFactory
    * @param $stateParams
    * @param CONST
    * @param $filter
    * @param $uibModal
    */
    function ManageDriverCtrl($scope, $state, DriverFactory, BCAFactory, UserFactory, UtilsFactory, $stateParams, CONST, $filter, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.attachments = '';
        vm.DriverId = '';
        vm.countries = {};
        vm.country = '';
        vm.state = '';
        vm.states = {};
        vm.employeeCategoriesList = {};
        vm.statusLookupList = {};
        vm.getLicenseClassList = {};
        vm.employmentCategory = '';
        vm.employmentStatus = '';
        vm.licenseClass = '';
        vm.ProfilePic = CONST.CONFIG.BASE_URL + CONST.CONFIG.DEFAULT_IMG;        
        vm.licenseImage = '';
        vm.leaveCountError = false;
        vm.leaveHistoryCountError = false;
        vm.leaveCount = 0;
        vm.leaveHistoryList = '';
        vm.whiteCardError = false;
        vm.inductionError = false;
        vm.vocError = false;
        vm.anonymousFieldError = false;
        vm.attributes = {
            Attachments: '',
            AddressLine1: '',
            AddressLine2: '',
            Awards: '',
            BaseRate: 0,
            ImageBase64: '',
            CardNumber: 0,
            City: '',
            CountryId: '',
            CreatedDate: '',
            DriverId: '',
            Email: '',
            EmploymentCategoryId: '',
            ExpiryDate: new Date(),
            StatusLookupId: '',
            FirstName: '',
            FleetRegistrationId: '',
            LastName: '',
            LicenseClassId: '',
            LicenseNumber: '',
            SickLeaveBalance: 0,
            AnnualLeaveBalance: 0,
            LeaveFromDate: '',
            LeaveToDate: '',
            LeaveType: '',
            LeaveNote: '',
            IsLeaveChange: false,
            MobileNumber: 0,
            ZipCode: 0,
            Shift: '',
            StateId: '',
            TypeFromDate: new Date(),
            TypeToDate: new Date(),
            TypeNote: '',
            DriverWhiteCard: [],
            DriverWhiteCardCount: '',
            DriverInductionCard: [],
            DriverInductionCardCount: '',
            DriverVocCard: [],
            DriverVocCardCount: '',
            AnonymousField: [],
            AnonymousFieldCount: '',
            IsActive: true,
            isFieldsetDisabled: false
        };

        vm.leaveHistoryAttributes = {
            LeaveFromDate: new Date(),
            LeaveToDate: new Date(),
            LeaveType: '',
            LeaveNote: '',
            DriverId: '',
        };

        //white Cards Grid List Content with PUsh
        vm.whiteCards = [];
        vm.whiteCardsRow = {
            issueDate: new Date(),
            cardNumber: 0,
            note: ''
        };

        //Induction Cards Grid List Content with PUsh
        vm.inductionCards = [];
        vm.inductionRow = {
            siteCost: '',
            issueDate: new Date(),
            cardNumber: 0,
            expiryDate: new Date(),
            note: ''
        };

        //VOC Cards Grid List Content with PUsh
        vm.vocCards = [];
        vm.vocRow = {
            issueDate: new Date(),
            cardNumber: 0,
            rtoNumber: 0,
            note: ''
        }

        //VOC Cards Grid List Content with PUsh
        vm.anonymousFields = [];
        vm.anonymousFieldRow = {
            issueDate: new Date(),
            expiryDate: new Date(),
            title: '',
            otherOne: '',
            otherTwo: '',
            note: ''
        }

        //Others tab
        vm.othersList = [];
        vm.mutipleFiles = { File: [], FileName: [], OtherTabId: '' };
        vm.others = {};
        vm.othersError = false;

        vm.tabs = [{ active: true }, { active: false }, { active: false }, { active: false }, { active: false }];

        vm.tabError = {
            personInformation: false,
            sensitiveInformation: false
        }

        //Methods
        vm.getAllCountries = getAllCountries;
        vm.getStates = getStates;
        vm.updateDetails = updateDetails;
        vm.clearImage = clearImage;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.loadAttachmentFile = loadAttachmentFile;
        vm.getEmploymentCategory = getEmploymentCategory;
        vm.getLicenseClass = getLicenseClass;
        vm.getStatusLookup = getStatusLookup;
        vm.goDriverList = goDriverList;
        vm.loadOtherImageFileAsURL = loadOtherImageFileAsURL;
        vm.addOthersRow = addOthersRow;
        vm.deleteOtherImage = deleteOtherImage;
        vm.deleteOtherDetail = deleteOtherDetail;

        /**
           * @name goNextTab
           * @desc Tab Navigation          
           */
        vm.goNextTab = function (index) {

            for (var i = 0; i <= vm.tabs.length; i++) {
                if (i === index + 1) {
                    vm.tabs[index + 1].active = true;
                }
                else {
                    vm.tabs[index].active = false;
                }
            }
        }

        /**
          * @name goPreviousTab
          * @desc Tab Navigation         
          */
        vm.goPreviousTab = function (index) {
            for (var i = 0; i <= vm.tabs.length; i++) {
                if (i === index - 1) {
                    vm.tabs[index - 1].active = true;
                }
                else {
                    vm.tabs[index].active = false;
                }
            }
            vm.tabs[index - 1].active = true;
        }

        /**
        * @name getEmploymentCategory
        * @desc Retrieve factories listing from factory
        * @returns {*}
        */
        function getEmploymentCategory() {
            BCAFactory
            .getEmploymentCategory()
            .then(function () {
                vm.employeeCategoriesList = BCAFactory.employmentCategoryList.DataList;
            });
        }

        /**
          * @name getStatusLookup
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getStatusLookup() {
            BCAFactory
            .getStatusLookup()
            .then(function () {
                vm.statusLookupList = BCAFactory.statusLookupList.DataList;
            });
        }

        /**
          * @name getLicenseClass
          * @desc Retrieve factories listing from factory
          * @returns {*}
          */
        function getLicenseClass() {
            BCAFactory
            .getLicenseClass()
            .then(function () {
                vm.getLicenseClassList = BCAFactory.getLicenseClassList.DataList;
            });
        }

        /**
         * @name getAllCountries
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getAllCountries() {
            UserFactory
            .getAllCountry()
            .then(function () {
                vm.countries = UserFactory.countries;
            });
        }

        //Call on page load
        vm.getEmploymentCategory();
        vm.getStatusLookup();
        vm.getLicenseClass();
        vm.getAllCountries();


        /**
         * Reset License expiry date
         */
        vm.resetLicenseExpiryDate = function () {
            vm.attributes.ExpiryDate = "";
        }

        /**
         * Reset Leave date range
         */
        vm.resetLeaveDateRange = function () {
            vm.attributes.LeaveFromDate = "";
            vm.attributes.LeaveToDate = "";
            vm.leaveCount = 0;
        }

        /**
        * Reset Leave history date range
        */
        vm.resetLeaveHistoryDateRange = function () {
            vm.leaveHistoryAttributes.LeaveFromDate = "";
            vm.leaveHistoryAttributes.LeaveToDate = "";
            vm.leaveHistoryCount = 0;
        }

        /**
         * Reset White card issue date
         */
        vm.resetWhiteCardIssueDate = function () {
            vm.whiteCardsRow.issueDate = "";
        }

        /**
         * Reset Induction issue date
         */
        vm.resetInductionIssueDate = function () {
            vm.inductionRow.issueDate = "";
        }

        /**
         * Reset Induction expiry date
         */
        vm.resetInductionExpiryDate = function () {
            vm.inductionRow.expiryDate = "";
        }

        /**
         * Reset VOC card issue date
         */
        vm.resetVOCCardIssueDate = function () {
            vm.vocRow.issueDate = "";
        }

        /**
         * Reset Anonymous issue date
         */
        vm.resetAnonymousIssueDate = function () {
            vm.anonymousFieldRow.issueDate = "";
        }

        /**
         * Reset Anonymous expiry date
         */
        vm.resetAnonymousExpiryDate = function () {
            vm.anonymousFieldRow.expiryDate = "";
        }

        /**
        * Calculate days of applying leave
        */
        vm.countLeave = function (firstTimeCall) {
            console.log(firstTimeCall);
            var magicNumber = (1000 * 60 * 60 * 24);

            if (vm.attributes.LeaveToDate && vm.attributes.LeaveFromDate) {
                var dayDifference = Math.floor((vm.attributes.LeaveToDate - vm.attributes.LeaveFromDate) / magicNumber);
                if (angular.isNumber(dayDifference)) {
                    vm.leaveCount = dayDifference + 1;
                    vm.leaveCountError = (dayDifference >= 0) ? false : true;
                    if (typeof firstTimeCall == 'undefined') {
                        vm.attributes.IsLeaveChange = !vm.leaveCountError;
                    }
                }
            }
        }

        /**
        * Calculate days of history leave
        */
        vm.countHistoryLeave = function () {
            var magicNumber = (1000 * 60 * 60 * 24);

            if (vm.leaveHistoryAttributes.LeaveToDate && vm.leaveHistoryAttributes.LeaveFromDate) {
                var dayDifference = Math.floor((vm.leaveHistoryAttributes.LeaveToDate - vm.leaveHistoryAttributes.LeaveFromDate) / magicNumber);
                if (angular.isNumber(dayDifference)) {
                    vm.leaveHistoryCount = dayDifference + 1;
                    vm.leaveHistoryCountError = (dayDifference >= 0) ? false : true;
                    //vm.leaveHistoryAttributes.IsLeaveChange = !vm.leaveHistoryCountError;                    
                }
            }
        }

        //Get detail of the driver for Edit
        if (typeof $stateParams.DriverId !== 'undefined' && $stateParams.DriverId !== '') {

            vm.DriverId = $stateParams.DriverId;
            DriverFactory
            .getDriverDetail(vm.DriverId)
            .then(function () {

                //initialise variables
                vm.country = { Value: '' };
                vm.state = { Value: '' };
                vm.employmentCategory = { EmploymentCategoryId: '' };
                vm.employmentStatus = { StatusId: '' };
                vm.licenseClass = { LicenseClassId: '' };

                vm.attributes = DriverFactory.driverInfo.DataObject;
                vm.country.Value = vm.attributes.CountryId;
                vm.state.Value = vm.attributes.StateId;

                //getting date type
                vm.attributes.ExpiryDate = new Date(vm.attributes.ExpiryDate);
                //vm.attributes.LeaveFromDate = new Date(vm.attributes.LeaveFromDate);
                //vm.attributes.LeaveToDate = new Date(vm.attributes.LeaveToDate);
                vm.attributes.TypeFromDate = new Date(vm.attributes.TypeFromDate);
                vm.attributes.TypeToDate = new Date(vm.attributes.TypeToDate);

                vm.countLeave("firstTimeCall");
               
                //Parsing the values
                vm.attributes.MobileNumber = parseInt(vm.attributes.MobileNumber);
                vm.attributes.ZipCode = parseInt(vm.attributes.ZipCode);
                vm.attributes.BaseRate = parseFloat(vm.attributes.BaseRate);
                vm.attributes.CardNumber = parseInt(vm.attributes.CardNumber);
                vm.attributes.LicenseNumber = parseInt(vm.attributes.LicenseNumber);
                vm.attributes.AnnualLeaveBalance = parseInt(vm.attributes.AnnualLeaveBalance);
                vm.attributes.SickLeaveBalance = parseInt(vm.attributes.SickLeaveBalance);

                //vm.LeaveHistory = vm.attributes.LeaveHistory;
                vm.leaveHistoryTableParams = UtilsFactory.bcaTableOptions(vm.attributes.LeaveHistory);

                //Preset the dropdowns
                vm.employmentCategory = (vm.attributes.EmploymentCategoryId !== null) ? ($filter('filter')(vm.employeeCategoriesList, { EmploymentCategoryId: vm.attributes.EmploymentCategoryId })[0]) : { EmploymentCategoryId: '' };
                vm.employmentStatus = (vm.attributes.StatusLookupId !== null) ? ($filter('filter')(vm.statusLookupList, { StatusId: vm.attributes.StatusLookupId })[0]) : { StatusId: '' };
                vm.licenseClass = $filter('filter')(vm.getLicenseClassList, { LicenseClassId: vm.attributes.LicenseClassId })[0];

                //Array
                vm.whiteCards = vm.attributes.DriverWhiteCard;
                vm.inductionCards = vm.attributes.DriverInductionCard;
                vm.vocCards = vm.attributes.DriverVocCard;
                vm.anonymousFields = vm.attributes.AnonymousField;

                //Image
                vm.licenseImage = vm.attributes.LicenseImage.split(',');

                if (vm.attributes.ProfilePic !== '') {
                    vm.ProfilePic = CONST.CONFIG.IMG_URL + vm.attributes.ProfilePic;
                    $("#fileName").val(vm.attributes.ProfilePic);
                }
                $("#previewId").attr('src', vm.ProfilePic);
                vm.getStates(vm.attributes.CountryId);

                //Check others list is exist or not
                if (vm.attributes.OtherTabList.length > 0) {
                    vm.othersList = vm.attributes.OtherTabList;
                    vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
                }               
            });
        } else {
            $("#previewId").attr('src', vm.ProfilePic);
        }

        //Open popup with detail of selected leave history
        vm.leaveHistoryDetailPopup = function (leaveHistoryList) {
            vm.leaveHistoryAttributes = leaveHistoryList;
            vm.leaveHistoryAttributes.LeaveFromDate = new Date(vm.leaveHistoryAttributes.LeaveFromDate);
            vm.leaveHistoryAttributes.LeaveToDate = new Date(vm.leaveHistoryAttributes.LeaveToDate);
            vm.countHistoryLeave();
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/configuration/partial/UpdateDriverLeaveHistory.html',
                scope: $scope
            });
        }

        //Delete Driver leave history
        vm.deleteLeaveHistory = function (LeaveHistoryId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call BookingListFactory factory get all factories data
                    DriverFactory
                    .deleteDriverLeaveHistory(LeaveHistoryId)
                    .then(function () {
                        $state.reload();
                    });
                }
            });
        }

        //Hide edit leave history popup         
        vm.hideCancel = function () {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name updateDriverLeaveHistory
        * @desc Update history of driver leaves
        * @returns {*}
        */
        vm.updateDriverLeaveHistory = function () {
            //console.log(vm.leaveHistoryAttributes);
            DriverFactory
            .updateDriverLeaveHistory(vm.leaveHistoryAttributes)
            .then(function () {
                vm.hideCancel();
            });
        }

        /**
         * @name getAllStates
         * @desc Retrieve factories listing from factory
         * @returns {*}
         */
        function getStates(countryId) {
            if (typeof countryId != 'undefined') {
                UserFactory
                 .getAllState(countryId)
                 .then(function () {
                     vm.states = UserFactory.states;
                 });
            } else {
                vm.states = "";
            }
        }

        /**
         * @name loadImageFileAsURL
         * @desc Convert Image to base64
         * @returns {*}
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
                    $("#fileName").html(filesSelected[0].name);
                    $('#clearImageId').show();
                };

                fileReader.readAsDataURL(fileToLoad);
            }
        }

        /**
         * @name clearImage
         * @desc For clear image and set as default image
         * @returns {*}
         */
        function clearImage() {
            $("#imageBase64").val('');
            $("#fileName").html('');
            $("#previewId").attr('src', CONST.CONFIG.DEFAULT_IMG);
            $('#clearImageId').hide();
        }

        /**
         * @name loadOtherImageFileAsURL
         * @descDisplay and manage Image name and Objects
         * @returns {*}
         */
        function loadOtherImageFileAsURL() {

            //START mutiple objects of multifile uploads
            if (document.getElementById("inputOtherFileToLoad").files.length > 0) {

                //OtherTabId='': For temporary Image records
                vm.mutipleFiles = [];

                // Store file objects and file name into an array of objects                
                for (var i = 0; i < document.getElementById("inputOtherFileToLoad").files.length; i++) {

                    var imgObj = { File: [], FileName: [], OtherTabId: '' };
                    imgObj.FileName = (document.getElementById("inputOtherFileToLoad").files[i].name)
                    imgObj.File = vm.othersImage[i];
                    imgObj.OtherTabId = '';
                    vm.mutipleFiles.push(imgObj);
                }
            }
            //END  mutiple objects of multifile uploads
        }

        /**
        * @name addOthersRow
        * @desc Add new record into temporary object
        * @returns {*}
        */
        function addOthersRow() {

            //Image object file[] and Image[]            
            vm.others.OtherFile = vm.mutipleFiles;

            //Check required of subject and files
            if ((vm.others.Subject !== '' && typeof vm.others.Subject !== 'undefined')
                && (vm.others.OtherFile.length > 0)) {

                //This is main "Other" object and this will pass as a post param(Add/Update Fleet registration)
                vm.othersList.push(vm.others);
                vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);

                //Do empty objects 
                vm.others = {
                    Subject: '',
                    Note: '',
                    OtherFile: {},
                    OtherTabId: ''
                }

                vm.mutipleFiles = vm.mutipleFiles = [];;
                vm.othersError = false;
            } else {

                //Error message displayed for 2 second
                vm.othersError = true;
                setTimeout(function () {
                    vm.othersError = false;
                    $scope.$apply();

                }, 2000);
            }
        }

        /**
        * @name deleteOtherImage
        * @desc Remove other images from the record
        * @returns {*}
        */
        function deleteOtherImage(perentIndex, imageIndex, imageObj) {

            //Dynamic Deleted
            if (imageObj.OtherTabId !== '') {

                BCAFactory.deleteOtherTab(imageObj);
            }

            //Remove from list of image array
            vm.othersList[perentIndex].OtherFile.splice(imageIndex, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }

        /**
        * @name deleteOtherDetail
        * @desc Remove other tab complete records 
        * @returns {*}
        */
        function deleteOtherDetail(otherObj, index) {

            //Dynamic delete
            if (otherObj.OtherTabId !== '', typeof otherObj.OtherTabId !== 'undefined') {
               
                BCAFactory.deleteOtherTab(otherObj);
            }

            //Remove from list of array
            vm.othersList.splice(index, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }


        /**
          * @name loadAttachmentFile
          * @descDisplay multiple Images of Attachement 
          * @returns {*}
          */
        function loadAttachmentFile() {
            vm.licenseImage = '';
            vm.licenseImageSelected = document.getElementById("inputAttachmentFileToLoad").files;
        }

        /**
          * @name addWhiteCardRow          
          * @desc Temporary add WhiteCard Data into array               
          */
        vm.addWhiteCardRow = function () {

            if ((vm.whiteCardsRow.issueDate !== '' && typeof vm.whiteCardsRow.issueDate !== 'undefined')
                && (vm.whiteCardsRow.cardNumber !== null && typeof vm.whiteCardsRow.cardNumber !== 'undefined' && vm.whiteCardsRow.cardNumber !== 0)) {
                vm.whiteCards.push({
                    'IssueDate': vm.whiteCardsRow.issueDate,
                    'CardNumber': vm.whiteCardsRow.cardNumber,
                    'Notes': vm.whiteCardsRow.note,
                    'IsActive': true
                });
                vm.whiteCardsRow = {
                    issueDate: new Date(),
                    cardNumber: '',
                    note: ''
                };
            } else {
                vm.whiteCardError = true;
                setTimeout(function () {
                    vm.whiteCardError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
          * @name removeWhiteCardRow          
          * @desc Temporary remove WhiteCard Data into from array               
          */
        vm.removeWhiteCardRow = function (index) {
            vm.whiteCards.splice(index, 1);
        }

        /**
           * @name addInductionRow          
           * @desc Temporary add Induction Data into array               
           */
        vm.addInductionRow = function () {

            if ((vm.inductionRow.siteCost !== '' && typeof vm.inductionRow.siteCost !== 'undefined')
                && (vm.inductionRow.issueDate !== '' && typeof vm.inductionRow.issueDate !== 'undefined')
                && (vm.inductionRow.cardNumber !== null && typeof vm.inductionRow.cardNumber !== 'undefined' && vm.inductionRow.cardNumber !== 0)
                && (vm.inductionRow.expiryDate !== '' && typeof vm.inductionRow.expiryDate !== 'undefined')) {
                vm.inductionCards.push({
                    'SiteCost': vm.inductionRow.siteCost,
                    'IssueDate': vm.inductionRow.issueDate,
                    'CardNumber': vm.inductionRow.cardNumber,
                    'ExpiryDate': vm.inductionRow.expiryDate,
                    'Notes': vm.inductionRow.note,
                    'IsActive': true
                });
                vm.inductionRow = {
                    siteCost: '',
                    issueDate: new Date(),
                    cardNumber: '',
                    expiryDate: new Date(),
                    note: ''
                };
            } else {
                vm.inductionError = true;
                setTimeout(function () {
                    vm.inductionError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
          * @name removeInductionRow          
          * @desc Temporary remove Induction Data into from array               
          */
        vm.removeInductionRow = function (index) {
            vm.inductionCards.splice(index, 1);
        }

        /**
           * @name vocAddRow          
           * @desc Temporary add VOC Data into array               
           */
        vm.vocAddRow = function () {
            if ((vm.vocRow.issueDate !== '' && typeof vm.vocRow.issueDate !== 'undefined')
                && (vm.vocRow.cardNumber !== null && typeof vm.vocRow.cardNumber !== 'undefined' && vm.vocRow.cardNumber !== 0)
                && (vm.vocRow.rtoNumber !== null && typeof vm.vocRow.rtoNumber !== 'undefined' && vm.vocRow.rtoNumber !== 0)) {

                vm.vocCards.push({
                    'IssueDate': vm.vocRow.issueDate,
                    'CardNumber': vm.vocRow.cardNumber,
                    'RTONumber': vm.vocRow.rtoNumber,
                    'Notes': vm.vocRow.note,
                    'IsActive': true
                });
                vm.vocRow = {
                    issueDate: new Date(),
                    cardNumber: '',
                    rtoNumber: '',
                    note: ''
                }
            } else {
                vm.vocError = true;
                setTimeout(function () {
                    vm.vocError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
          * @name removeVocRow          
          * @desc Temporary remove VOC Data into from array               
          */
        vm.removeVocRow = function (index) {
            vm.vocCards.splice(index, 1);
        }

        /**
          * @name anonymousFieldAddRow          
          * @desc Temporary add nonymousField Data into array               
          */
        vm.anonymousFieldAddRow = function () {

            if ((vm.anonymousFieldRow.issueDate !== '' && typeof vm.anonymousFieldRow.issueDate !== 'undefined')
                && (vm.anonymousFieldRow.expiryDate !== '' && typeof vm.anonymousFieldRow.expiryDate !== 'undefined')
                && (vm.anonymousFieldRow.title !== '' && typeof vm.anonymousFieldRow.title !== 'undefined')
                && (vm.anonymousFieldRow.otherOne !== '' && typeof vm.anonymousFieldRow.otherOne !== 'undefined')
                && (vm.anonymousFieldRow.otherTwo !== '' && typeof vm.anonymousFieldRow.otherTwo !== 'undefined')) {
                vm.anonymousFields.push({
                    'IssueDate': vm.anonymousFieldRow.issueDate,
                    'ExpiryDate': vm.anonymousFieldRow.expiryDate,
                    'Title': vm.anonymousFieldRow.title,
                    'OtherOne': vm.anonymousFieldRow.otherOne,
                    'OtherTwo': vm.anonymousFieldRow.otherTwo,
                    'Notes': vm.anonymousFieldRow.note,
                    'IsActive': true
                });

                vm.anonymousFieldRow = {
                    issueDate: new Date(),
                    expiryDate: new Date(),
                    title: '',
                    otherOne: '',
                    otherTwo: '',
                    note: ''
                }
            } else {
                vm.anonymousFieldError = true;
                setTimeout(function () {
                    vm.anonymousFieldError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
         * @name removeAnonymousFieldRow          
         * @desc Temporary remove anonymousField Data into from array               
         */
        vm.removeAnonymousFieldRow = function (index) {
            vm.anonymousFields.splice(index, 1);
        }

        /**
         * @name checkFormValidation
         * @desc check validation and show message according to tab
         * @returns {*}
         */
        vm.checkFormValidation = function (formValid) {
            console.log(vm.leaveCountError, formValid);
            if (formValid.$invalid || vm.leaveCountError) {
                vm.tabError = [];
                console.log(vm.leaveCountError);
                if (formValid.firstName.$invalid
                    || formValid.lastName.$invalid
                    || formValid.email.$invalid
                    || formValid.mobileNumber.$invalid
                    || formValid.country.$invalid
                    || formValid.state.$invalid
                    || formValid.employmentCategory.$invalid
                    || formValid.employmentStatus.$invalid
                    || formValid.licenseNumber.$invalid
                    || formValid.licenseClass.$invalid
                    || formValid.expiryDate.$invalid
                    || formValid.annualLeaveBalance.$invalid
                    || formValid.sickLeaveBalance.$invalid
                    || vm.leaveCountError) {
                    vm.tabError.personInformation = true;
                } else {
                    vm.tabError.personInformation = false;
                }
                if (formValid.baseRate.$invalid || formValid.shift.$invalid) {
                    vm.tabError.sensitiveInformation = true;
                } else {
                    vm.tabError.sensitiveInformation = false;
                }
                console.log("form-invalid");
            }
        }

        /**
          * @name updateDetails
          * @desc Add/Update User detail
          * @returns {*}
          */
        function updateDetails(formValid) {
            if (!vm.leaveCountError) {
                console.log("form-submit");
                if (angular.element('#imageBase64')[0].value != '') {
                    vm.ImageBase64 = angular.element('#imageBase64')[0].value;
                    vm.attributes.ImageBase64 = vm.ImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
                } else {
                    vm.attributes.ImageBase64 = '';
                }

                vm.attributes.Attachments = vm.licenseImageSelected; //Multi images
                vm.attributes.CountryId = vm.country.Value;
                vm.attributes.StateId = vm.state.Value;
                vm.attributes.LicenseClassId = vm.licenseClass.LicenseClassId;
                vm.attributes.StatusLookupId = vm.employmentStatus.StatusId;
                vm.attributes.EmploymentCategoryId = vm.employmentCategory.EmploymentCategoryId;
                vm.attributes.DriverWhiteCard = vm.whiteCards;
                vm.attributes.DriverWhiteCardCount = (vm.whiteCards.length) ? vm.whiteCards.length : 0;
                vm.attributes.DriverInductionCard = vm.inductionCards;
                vm.attributes.DriverInductionCardCount = (vm.inductionCards.length) ? vm.inductionCards.length : 0;
                vm.attributes.DriverVocCard = vm.vocCards;
                vm.attributes.DriverVocCardCount = (vm.vocCards.length) ? vm.vocCards.length : 0;
                vm.attributes.AnonymousField = vm.anonymousFields;
                vm.attributes.AnonymousFieldCount = (vm.anonymousFields.length) ? vm.anonymousFields.length : 0;
                vm.attributes.Others = vm.othersList;
                if (typeof vm.DriverId !== 'undefined' && vm.DriverId !== '') {
                    DriverFactory
                     .updateDriver(vm.attributes)
                     .then(function () {
                         $state.go("configuration.DriverList");
                     });

                } else {
                    DriverFactory
                     .addDriver(vm.attributes)
                     .then(function () {
                         $state.go("configuration.DriverList");
                     });
                }
            }
        }

        /**
          * @name goDriverList
          * @desc Navigate to Driver list page         
          */
        function goDriverList() {
            $state.go('configuration.DriverList');
        }

        /**
         * @name removeRequired
         * @desc funtion to remove the required from the license fields      
         */
        vm.removeRequired = function () {
            vm.attributes.isFieldsetDisabled = true;
        }
    }

    //Inject required stuff as parameters to factories controller function
    FleetTypeListCtrl.$inject = ['$scope', 'ManageFleetTypeFactory', 'UtilsFactory', '$state'];

    /**
     * @name FleetTypeListCtrl
     * @param $scope    
     * @param ManageFleetTypeFactory
     * @param UtilsFactory  
     * @param $state
     */
    function FleetTypeListCtrl($scope, ManageFleetTypeFactory, UtilsFactory, $state) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.assetGroupList = '';
        vm.uiGrid = {};

        //methods
        vm.getFleetTypeList = getFleetTypeList;
        vm.deleteFleetType = deleteFleetType;


        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'Fleet',
                displayName: 'Type'
            },
            {
                name: 'Description'               
            },
          
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ui-sref="configuration.EditFleetType({FleetTypeId: row.entity.FleetTypeId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
                   
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
        * @name getAssetGroupList           
        * @desc Get all Asset Groups from db
        * @returns {*}         
        */
        function getFleetTypeList() {
            ManageFleetTypeFactory
            .getAllFleetType()
            .then(function () {
                vm.uiGrid.data = ManageFleetTypeFactory.fleetTypes.DataList;                
            });
        }

        //call on Page load
        getFleetTypeList();

        /**
       * @name getAssetGroupList           
       * @desc Get all Asset Groups from db
       * @returns {*}         
       */
        function deleteFleetType(fleetTypeId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageFleetTypeFactory
                        .deleteFleetType(fleetTypeId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }
    }

    //Inject required stuff as parameters to factories controller function
    ManageFleetTypeCtrl.$inject = ['$scope', 'ManageFleetTypeFactory', 'UtilsFactory', '$stateParams', '$state', 'CONST'];

    /**
     * @name ManageFleetTypeCtrl
     * @param $scope    
     * @param ManageFleetTypeFactory
     * @param UtilsFactory    
     * @param $stateParams
     * @param $state
     * @param CONST
     */
    function ManageFleetTypeCtrl($scope, ManageFleetTypeFactory, UtilsFactory, $stateParams, $state, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.assetGroupId = '';
        vm.assetGroupDetail = '';
        vm.Image = CONST.CONFIG.DEFAULT_IMG;
        vm.attributes = {
            Fleet: '',
            Description: '',
            ImageBase64: '',
            IsActive: true
        };

        //methods
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.clearImage = clearImage;
        vm.updateDetails = updateDetails;

        // Get detail of Asset Group by Id
        if (typeof $stateParams.FleetTypeId !== 'undefined' && $stateParams.FleetTypeId !== '') {
            vm.assetGroupId = $stateParams.FleetTypeId;

            ManageFleetTypeFactory
            .getFleetTypeDetail(vm.assetGroupId)
            .then(function () {
                vm.attributes = ManageFleetTypeFactory.fleetTypeInfo.DataObject;
                if (vm.attributes.Image != '') {
                    vm.Image = CONST.CONFIG.IMG_URL + vm.attributes.Image;
                    $("#fileName").val(vm.attributes.Image);
                    $("#previewId").attr('src', CONST.CONFIG.IMG_URL + vm.attributes.Image);
                }
            });
        }

        /**
         * @name loadImageFileAsURL
         * @desc Convert Image to base64
         * @returns {*}
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
         * @returns {*}
         */
        function clearImage() {
            $("#imageBase64").val('');
            $("#fileName").html('');
            $("#previewId").attr('src', CONST.CONFIG.DEFAULT_IMG);
            $('#clearImageId').hide();
        }

        /**
         * @name updateDetails           
         * @desc Save Asset Group Data into db
         * @returns {*}         
         */
        function updateDetails() {
            if (angular.element('#imageBase64')[0].value != '') {
                vm.ImageBase64 = angular.element('#imageBase64')[0].value;
                vm.attributes.ImageBase64 = vm.ImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
            } else {
                vm.attributes.ImageBase64 = '';
            }

            if (typeof vm.assetGroupId !== 'undefined' && vm.assetGroupId !== '') {
                ManageFleetTypeFactory
                 .updateFleetType(vm.attributes)
                 .then(function () {
                     $state.go("configuration.FleetTypeList");
                 });

            } else {
                ManageFleetTypeFactory
                 .addFleetType(vm.attributes)
                 .then(function () {
                     $state.go("configuration.FleetTypeList");
                 });
            }
        }

    }

    //Inject required stuff as parameters to factories controller function
    WorkTypeCtrl.$inject = ['$scope', 'ManageWorkTypeFactory', 'UtilsFactory', '$state', '$uibModal'];

    /**
     * @name WorkTypeCtrl
     * @param $scope    
     * @param ManageWorkTypeFactory
     * @param UtilsFactory  
     * @param $state
     * @param $uibModal
     */
    function WorkTypeCtrl($scope, ManageWorkTypeFactory, UtilsFactory, $state, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.workTypes = '';
        vm.type = '';
        vm.workTypeId = '';
        vm.attributes = {
            Type: '',
            IsActive: true
        };
        vm.uiGrid = {};

        //methods
        vm.getAllWorkTypeList = getAllWorkTypeList;
        vm.deleteWorkType = deleteWorkType;
        vm.addWorkType = addWorkType;
        $scope.editWorkType = editWorkType;
        vm.hideCancel = hideCancel;
        vm.saveWorkType = saveWorkType;

        //START UI-Grid Code
        vm.dataSetDocket = [
            {
                name: 'Type'              
            },           
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ng-click="grid.appScope.editWorkType(row.entity)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
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
        * @name getWorkTypeList           
        * @desc Get all WorkType from db
        * @returns {*}         
        */
        function getAllWorkTypeList() {
            ManageWorkTypeFactory
            .getAllWorkType()
            .then(function () {
                vm.uiGrid.data = ManageWorkTypeFactory.workTypes.DataList;                 
            });
        }

        //call on Page load
        vm.getAllWorkTypeList();

        /**
         * @name addWorkType
         * @desc callin popup
         */
        function addWorkType() {
            vm.type = '';
            vm.workTypeId = '';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateWorkType.html',
                scope: $scope,
                controller: 'WorkTypeCtrl',
                controllerAs: 'wtCtrl'
            });
        };

        /**
         * @name hideCancel
         * @desc Hide popup
         */
        function hideCancel() {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name editWorkType
        * @desc callin popup
        */
        function editWorkType(data) {
            vm.type = data.Type;
            vm.workTypeId = data.WorkTypeId;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateWorkType.html',
                scope: $scope
            });
        };

        /**
           * @name saveWorkType
           * @desc Save Data
           */
        function saveWorkType() {
            if (vm.workTypeId === '') {
                vm.attributes.Type = vm.type;
                ManageWorkTypeFactory
                .addWorkType(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            } else {
                vm.attributes.Type = vm.type;
                vm.attributes.WorkTypeId = vm.workTypeId;
                ManageWorkTypeFactory
                .updateWorkType(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            }

        }

        /**
           * @name deleteWorkType           
           * @desc Delete Record from db
           * @returns {*}         
           */
        function deleteWorkType(workTypeId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageWorkTypeFactory
                        .deleteWorkType(workTypeId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });

        }
    }

    //Inject required stuff as parameters to factories controller function
    CheckListCtrl.$inject = ['$scope', 'ManageCheckListFactory', 'UtilsFactory', '$state', '$uibModal'];

    /**
     * @name CheckListCtrl
     * @param $scope    
     * @param ManageCheckListFactory
     * @param UtilsFactory  
     * @param $state
     * @param $uibModal
     */
    function CheckListCtrl($scope, ManageCheckListFactory, UtilsFactory, $state, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.checkList = '';
        vm.title = '';
        vm.docketCheckListId = '';
        vm.attributes = {
            Title: '',
            IsActive: true
        };
        vm.uiGrid = {};

        //methods
        vm.getCheckList = getCheckList;
        vm.deleteCheckList = deleteCheckList;
        vm.addCheckList = addCheckList;
        $scope.editCheckList = editCheckList;
        vm.hideCancel = hideCancel;
        vm.saveCheckList = saveCheckList;

        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'Title'
            },           
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ng-click="grid.appScope.editCheckList(row.entity)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
        * @name getCheckList           
        * @desc Get all CheckList from db
        * @returns {*}         
        */
        function getCheckList() {
            ManageCheckListFactory
            .getAllCheckList()
            .then(function () {
                vm.uiGrid.data = ManageCheckListFactory.checkLists.DataList;                
            });
        }

        //call on Page load
        getCheckList();

        /**
         * @name addCheckList
         * @desc callin popup
         */
        function addCheckList() {
            vm.title = '';
            vm.docketCheckListId = '';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateCheckList.html',
                scope: $scope,
                controller: 'CheckListCtrl',
                controllerAs: 'clCtrl'
                //controller: ModalInstanceCtrl,
            });
        };

        /**
         * @name hideCancel
         * @desc Hide popup
         */
        function hideCancel() {
            $scope.modalInstance.dismiss();
        }

        /**
        * @name editCheckList
        * @desc callin popup
        */
        function editCheckList(data) {
            vm.title = data.Title;
            vm.docketCheckListId = data.DocketCheckListId;
            //vm.attributes = data;            
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateCheckList.html',
                scope: $scope
            });
        };

        /**
           * @name saveCheckList
           * @desc Save Data
           */
        function saveCheckList() {
            if (vm.docketCheckListId === '') {
                vm.attributes.Title = vm.title;
                ManageCheckListFactory
                .addCheckList(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            } else {
                vm.attributes.Title = vm.title;
                vm.attributes.DocketCheckListId = vm.docketCheckListId;
                ManageCheckListFactory
                .updateCheckList(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            }
        }

        /**
       * @name deleteCheckList           
       * @desc Get all Asset Groups from db
       * @returns {*}         
       */
        function deleteCheckList(checkListId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageCheckListFactory
                        .deleteCheckList(checkListId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });

        }
    }

    //Inject required stuff as parameters to factories controller function
    CustomerListCtrl.$inject = ['$scope', 'ManageCustomerFactory', 'UtilsFactory', '$state', '$uibModal'];

    /**
     * @name CustomerListCtrl
     * @param $scope    
     * @param ManageCustomerFactory
     * @param UtilsFactory  
     * @param $state
     * @param $uibModal
     */
    function CustomerListCtrl($scope, ManageCustomerFactory, UtilsFactory, BCAFactory, $state, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customerList = '';
        vm.uiGrid = {};

        //methods
        vm.getCustomerList = getCustomerList;
        vm.deleteCustomer = deleteCustomer;

        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'CustomerName'               
            },
            {
                name: 'ABN',
                displayName: 'ABN Number'                
            },
            {
                name: 'ContactName'                
            },
            {
                name: 'AccountName'
            },
            {
                name: 'EmailForInvoices'                
            },              
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ui-sref="configuration.EditCustomer({CustomerId: row.entity.CustomerId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
        * @name getCustomerList           
        * @desc Get all Customer from db
        * @returns {*}         
        */
        function getCustomerList() {
            ManageCustomerFactory
            .getAllCustomer()
            .then(function () {
                vm.uiGrid.data = ManageCustomerFactory.customerList.DataList;                
            });
        }

        //call on Page load
        getCustomerList();

        /**
       * @name deleteCustomer           
       * @desc Delete customer from db
       * @returns {*}         
       */
        function deleteCustomer(customerId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageCustomerFactory
                        .deleteCustomer(customerId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }
    }

    //Inject required stuff as parameters to factories controller function
    ManageCustomerCtrl.$inject = ['$scope', '$rootScope', 'ManageCustomerFactory', 'UtilsFactory', 'BCAFactory', '$stateParams', '$state', 'CONST'];

    /**
     * @name ManageCustomerCtrl
     * @param $scope 
     * @param $rootScope
     * @param ManageCustomerFactory
     * @param UtilsFactory
     * @param BCAFactory
     * @param $stateParams
     * @param $state
     * @param CONST
     */
    function ManageCustomerCtrl($scope, $rootScope, ManageCustomerFactory, UtilsFactory, BCAFactory, $stateParams, $state, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.siteTabDisabled = true;
        vm.fromState = '';
        vm.hideTab = false;
        vm.customerId = '';
        vm.customerDetail = '';
        vm.filesSelected = '';
        vm.urlSegmentArray = '';
        vm.lastPart = '';
        vm.lastSecondPart = '';
        vm.tabs = [{ activeTab1: true },
                   { activeTab1: false },
                   { activeTab2: false }];
        vm.tabError = { customerInformation: false };

        vm.attributes = {
            ABN: '',
            AccountsContact: '',
            AccountsNumber: '',
            ContactName: '',
            ContactNumber: '',
            CustomerId: '',
            CustomerName: '',
            EmailForInvoices: '',
            Fax: '',
            MobileNumber1: '',
            MobileNumber2: '',
            OfficePostalCode: '',
            OfficeState: '',
            OfficeStreet: '',
            OfficeSuburb: '',
            PhoneNumber1: '',
            PhoneNumber2: '',
            PostalPostCode: '',
            PostalStreetPoBox: '',
            PostalSuburb: '',
            SiteDetail: '',
            IsActive: true
        };

        //Site detail Attribute
        vm.siteDetails = {
            SiteName: '',
            PoNumber: '',
            SiteDetail: '',
            FuelIncluded: false,
            TollsIncluded: false,
            CreditTermsAgreed: '',
            SupervisorList: [],
            GateList: [],
            IsActive: true
        };

        //Supervisor object
        vm.supervisorRow = {
            supervisorName: '',
            supervisorEmail: '',
            supervisorMobile: '',
        }
        vm.supervisors = [];
        vm.supervisorError = false;

        //Gate object
        vm.gateRow = {
            gateNumber: '',
            // equipmentType: '',
            tipOffRate: '',
            tippingSite: '',
            contactPerson: [],
        }
        vm.gates = [];
        vm.gateError = false;

        vm.creditTermAgreedList = [30, 60, 90];

        //Others tab
        vm.mutipleFiles = { File: [], FileName: [], OtherTabId: '' };
        vm.others = {};
        vm.othersList = [];
        vm.othersError = false;

        //methods       
        vm.updateDetails = updateDetails;
        vm.goCustomerList = goCustomerList;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.updateSiteDetails = updateSiteDetails;
        vm.loadOtherImageFileAsURL = loadOtherImageFileAsURL;
        vm.addOthersRow = addOthersRow;
        vm.deleteOtherImage = deleteOtherImage;
        vm.deleteOtherDetail = deleteOtherDetail;

        // recognizing state for redirecting on the desired location
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            vm.fromState = fromState.name;
        });

        //If Page refresh then get state from segments of url
        vm.urlSegmentArray = window.location.href.split("/");
        vm.lastPart = vm.urlSegmentArray.pop();
        vm.lastSecondPart = vm.urlSegmentArray.pop();

        /**
          * @name goNextTab
          * @desc Tab Navigation          
          */
        vm.goNextTab = function (index) {
            console.log("next tab", index, vm.tabs.length);
            for (var i = 0; i <= vm.tabs.length; i++) {
                console.log("next tab", vm.tabs[index + 1].activeTab1);
                if (i === index + 1) {
                    vm.tabs[index + 1].activeTab1 = true;
                }
                else {
                    vm.tabs[index].activeTab1 = false;
                }
            }
        }

        /**
          * @name goPreviousTab
          * @desc Tab Navigation         
          */
        vm.goPreviousTab = function (index) {
            console.log("prev tab", index);

            for (var i = 0; i <= vm.tabs.length; i++) {
                console.log("prev tab", vm.tabs[index - 1].activeTab1, vm.tabs.length);
                if (i === index - 1) {
                    vm.tabs[index - 1].activeTab1 = true;
                }
                else {
                    vm.tabs[index].activeTab1 = false;
                }
            }
            vm.tabs[index - 1].activeTab1 = true;
        }

        /**
          * @name addSupervisorRow          
          * @desc Temporary add Supervisor Data into array               
          */
        vm.addSupervisorRow = function () {
            if ((vm.supervisorRow.supervisorName !== '' && typeof vm.supervisorRow.supervisorName !== 'undefined')
                && (vm.supervisorRow.supervisorEmail !== '' && typeof vm.supervisorRow.supervisorEmail !== 'undefined')
                && (vm.supervisorRow.supervisorMobile !== '' && typeof vm.supervisorRow.supervisorMobile !== 'undefined' || vm.supervisorRow.supervisorMobile)) {
                vm.supervisors.push({
                    'SupervisorName': vm.supervisorRow.supervisorName,
                    'SupervisorEmail': vm.supervisorRow.supervisorEmail,
                    'SupervisorMobile': vm.supervisorRow.supervisorMobile,
                    'IsActive': true
                });
                //Supervisor object
                vm.supervisorRow = {
                    supervisorName: '',
                    supervisorEmail: '',
                    supervisorMobile: ''
                }
                vm.supervisorError = false;
            } else {
                vm.supervisorError = true;
                setTimeout(function () {
                    vm.supervisorError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
         * @name changeSupervisorFields          
         * @desc Check Temporary add Supervisor fileds               
         */
        vm.changeSupervisorFields = function () {
            if (vm.supervisorRow.supervisorName == '' && vm.supervisorRow.supervisorEmail == '' && vm.supervisorRow.supervisorMobile == null) {
                vm.supervisorError = false;
            }
            else if ((vm.supervisorRow.supervisorName == '' || typeof vm.supervisorRow.supervisorName == 'undefined'),
                   (vm.supervisorRow.supervisorEmail == '' || typeof vm.supervisorRow.supervisorEmail == 'undefined'),
                   (vm.supervisorRow.supervisorMobile == '' || typeof vm.supervisorRow.supervisorMobile == 'undefined' || vm.supervisorRow.supervisorMobile == null)) {
                vm.supervisorError = true;
            }
            else {
                vm.supervisorError = false;
            }
        }

        /**
          * @name removeSupervisorRow          
          * @desc Temporary remove Supervisor Data into from array               
          */
        vm.removeSupervisorRow = function (index) {
            vm.supervisors.splice(index, 1);
        }

        /**
         * @name addGateRow          
         * @desc Temporary add Contact Data into array               
         */
        vm.addGateRow = function () {
            if ((vm.gateRow.gateNumber !== '' && typeof vm.gateRow.gateNumber !== 'undefined')
                && (vm.gateRow.tipOffRate !== '' && typeof vm.gateRow.tipOffRate !== 'undefined')
                && (vm.gateRow.tippingSite !== '' && typeof vm.gateRow.tippingSite !== 'undefined')) {
                vm.gates.push({
                    'GateNumber': vm.gateRow.gateNumber,
                    //'EquipmentType': vm.gateRow.equipmentType,
                    'TipOffRate': vm.gateRow.tipOffRate,
                    'TippingSite': vm.gateRow.tippingSite,
                    // 'contactPerson': vm.contactPersons,
                    'IsActive': true
                });

                vm.gateRow = {
                    gateNumber: '',
                    // equipmentType: '',
                    tipOffRate: '',
                    tippingSite: '',
                    // contactPerson: [],
                }
                vm.gateError = false;
            } else {
                vm.gateError = true;
                setTimeout(function () {
                    vm.gateError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
        * @name changeGateFields          
        * @desc Check Temporary add Gate fileds               
        */
        vm.changeGateFields = function () {

            if (vm.gateRow.gateNumber == '' && vm.gateRow.tipOffRate == null && vm.vm.gateRow.tippingSite == '') {
                vm.gateError = false;
            }
            else if ((vm.gateRow.gateNumber == '' || typeof vm.gateRow.gateNumber == 'undefined')
              && (vm.gateRow.tipOffRate == '' || typeof vm.gateRow.tipOffRate == 'undefined' || vm.gateRow.tipOffRate == null)
              && (vm.gateRow.tippingSite == '' || typeof vm.gateRow.tippingSite == 'undefined')) {
                vm.gateError = false;
            }
            else {
                vm.gateError = true;
            }
        }

        /**
          * @name removeGateRow          
          * @desc Temporary remove Gate Data into from array               
          */
        vm.removeGateRow = function (index) {
            vm.gates.splice(index, 1);
        }

        // Get detail of Customer by Id
        if (typeof $stateParams.CustomerId !== 'undefined' && $stateParams.CustomerId !== '') {
           
            vm.customerId = $stateParams.CustomerId;
            vm.siteTabDisabled = false;
            vm.hideTab = true;
            ManageCustomerFactory
            .getCustomerByCustomerId(vm.customerId)
            .then(function () {

                vm.attributes = ManageCustomerFactory.customerInfo.DataObject;
                vm.attributes.ABN = parseInt(vm.attributes.ABN);
                vm.attributes.ContactNumber = (vm.attributes.ContactNumber !== null) ? parseInt(vm.attributes.ContactNumber) : '';//Handle null value
                vm.attributes.AccountsNumber = parseInt(vm.attributes.AccountsNumber);
                vm.attributes.PhoneNumber1 = (vm.attributes.PhoneNumber1 !== null) ? parseInt(vm.attributes.PhoneNumber1) : '';//Handle null value
                vm.attributes.PhoneNumber2 = (vm.attributes.PhoneNumber2 !== null) ? parseInt(vm.attributes.PhoneNumber2) : '';//Handle null value
                vm.attributes.MobileNumber1 = (vm.attributes.MobileNumber1 !== null) ? parseInt(vm.attributes.MobileNumber1) : '';//Handle null value
                vm.attributes.MobileNumber2 = (vm.attributes.MobileNumber2 !== null) ? parseInt(vm.attributes.MobileNumber2) : '';//Handle null value
                vm.attributes.Fax = (vm.attributes.Fax !== null) ? parseInt(vm.attributes.Fax) : '';//Handle null value
                vm.attributes.OfficePostalCode = (vm.attributes.OfficePostalCode !== null) ? parseInt(vm.attributes.OfficePostalCode) : '';//Handle null value
                vm.attributes.PostalPostCode = (vm.attributes.PostalPostCode !== null) ? parseInt(vm.attributes.PostalPostCode) : ''; // Handle null value           

                //Check others list is exist or not
                if (vm.attributes.OtherTabList.length > 0) {
                    vm.othersList = vm.attributes.OtherTabList;
                    vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
                }
            });
        }

        /**
        * @name loadImageFileAsURL
        * @descDisplay Image name 
        * @returns {*}
        */
        function loadImageFileAsURL() {
            vm.filesSelected = document.getElementById("inputFileToLoad").files;
        }

        /**
         * @name loadOtherImageFileAsURL
         * @descDisplay and manage Image name and Objects
         * @returns {*}
         */
        function loadOtherImageFileAsURL() {

            //START mutiple objects of multifile uploads
            if (document.getElementById("inputOtherFileToLoad").files.length > 0) {

                //OtherTabId='': For temporary Image records
                vm.mutipleFiles = [];

                // Store file objects and file name into an array of objects                
                for (var i = 0; i < document.getElementById("inputOtherFileToLoad").files.length; i++) {

                    var imgObj = { File: [], FileName: [], OtherTabId: '' };
                    imgObj.FileName = (document.getElementById("inputOtherFileToLoad").files[i].name)
                    imgObj.File = vm.othersImage[i];
                    imgObj.OtherTabId = '';
                    vm.mutipleFiles.push(imgObj);
                }
            }
            //END  mutiple objects of multifile uploads
        }

        /**
        * @name addOthersRow
        * @desc Add new record into temporary object
        * @returns {*}
        */
        function addOthersRow() {

            //Image object file[] and Image[]            
            vm.others.OtherFile = vm.mutipleFiles;

            //Check required of subject and files
            if ((vm.others.Subject !== '' && typeof vm.others.Subject !== 'undefined')
                && (vm.others.OtherFile.length > 0)) {

                //This is main "Other" object and this will pass as a post param(Add/Update Fleet registration)
                vm.othersList.push(vm.others);
                vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);

                //Do empty objects 
                vm.others = {
                    Subject: '',
                    Note: '',
                    OtherFile: {},
                    OtherTabId: ''
                }

                vm.mutipleFiles = vm.mutipleFiles = [];;
                vm.othersError = false;
            } else {

                //Error message displayed for 2 second
                vm.othersError = true;
                setTimeout(function () {
                    vm.othersError = false;
                    $scope.$apply();

                }, 2000);
            }
        }

        /**
              * @name deleteOtherImage
              * @desc Remove other images from the record
              * @returns {*}
              */
        function deleteOtherImage(perentIndex, imageIndex, imageObj) {

            //Dynamic Deleted
            if (imageObj.OtherTabId !== '') {

                BCAFactory.deleteOtherTab(imageObj);
            }

            //Remove from list of image array
            vm.othersList[perentIndex].OtherFile.splice(imageIndex, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }

        /**
        * @name deleteOtherDetail
        * @desc Remove other tab complete records 
        * @returns {*}
        */
        function deleteOtherDetail(otherObj, index) {

            //Dynamic delete
            if (otherObj.OtherTabId !== '', typeof otherObj.OtherTabId !== 'undefined') {

                BCAFactory.deleteOtherTab(otherObj);
            }

            //Remove from list of array
            vm.othersList.splice(index, 1);

            //Refresh table object
            vm.othersTableParams = UtilsFactory.bcaTableOptions(vm.othersList);
        }

        /**
          * @name checkCustomerFormValidation
          * @desc check validation of customer tab and show message according to tab
          * If Valid true then will navigate to next tab
          * @returns {*}
          */
        vm.checkCustomerFormValidation = function (formValid) {
            if (formValid.$invalid) {
                return false;
            } else {
                vm.goNextTab(0);
            }
        }

        /**
        * @name checkFormValidation
        * @desc check validation and show message according to tab
        * @returns {*}
        */
        vm.checkFormValidation = function (formValid) {
            console.log(formValid, formValid.$invalid, vm.attributes);
            vm.tabError = [];
            if ((vm.attributes.CustomerName !== '' && typeof vm.attributes.CustomerName !== 'undefined')
                && (vm.attributes.ABN !== '' && typeof vm.attributes.ABN !== 'undefined')
                && (vm.attributes.ContactNumber !== '' && typeof vm.attributes.ContactNumber !== 'undefined')
                && (vm.attributes.AccountsNumber !== '' && typeof vm.attributes.AccountsNumber !== 'undefined')
                && (vm.attributes.AccountsContact !== '' && typeof vm.attributes.AccountsContact !== 'undefined')
                && (vm.attributes.EmailForInvoices !== '' && typeof vm.attributes.EmailForInvoices !== 'undefined')
                && (vm.attributes.OfficeStreet !== '' && typeof vm.attributes.OfficeStreet !== 'undefined')
                && (vm.attributes.OfficeSuburb !== '' && typeof vm.attributes.OfficeSuburb !== 'undefined')
                && (vm.attributes.OfficeState !== '' && typeof vm.attributes.OfficeState !== 'undefined')
                && (vm.attributes.OfficePostalCode !== '' && typeof vm.attributes.OfficePostalCode !== 'undefined')
                && (vm.attributes.PostalStreetPoBox !== '' && typeof vm.attributes.PostalStreetPoBox !== 'undefined')
                && (vm.attributes.PostalSuburb !== '' && typeof vm.attributes.PostalSuburb !== 'undefined')
                && (vm.attributes.PostalState !== '' && typeof vm.attributes.PostalState !== 'undefined')
                && (vm.attributes.PostalPostCode !== '' && typeof vm.attributes.PostalPostCode !== 'undefined')
                ) {

                vm.tabError.customerInformation = false;
                vm.updateDetails();

            } else {
                vm.tabError.customerInformation = true;
            }
          
        }

        /**
         * @name updateDetails          
         * @desc Save Customer Data into db
         * @returns {*}         
         */
        function updateDetails() {
            vm.supervisorError = false;
            vm.gateError = false;
            vm.attributes.Others = vm.othersList;
            console.log(vm.attributes);
            if (vm.customerId !== 'undefined' && vm.customerId !== '') {

                vm.attributes.CustomerId = vm.customerId;
                vm.attributes.IsActive = true;
                ManageCustomerFactory
                 .updateCustomer(vm.attributes)
                 .then(function () {
                     if ((vm.fromState != '' && vm.fromState === 'configuration.CustomerList') || vm.lastPart === "AddCustomer") {
                         $state.go("configuration.CustomerList");
                     } else {
                         if (vm.lastSecondPart === "EditCustomer") {
                             $state.go("booking.BookingDashboard");
                         }
                     }
                 });

            } else {
                ManageCustomerFactory
                 .addCustomer(vm.attributes)
                 .then(function (response) {
                     if (response.data.Id) {
                         vm.siteTabDisabled = false;
                         vm.customerId = response.data.Id;
                         vm.tabs[0].activeTab1 = false;
                         vm.tabs[1].activeTab1 = false;
                         vm.tabs[2].activeTab2 = true;
                     }
                 });
            }
        }

        /**
        * @name updateSiteDetails          
        * @desc Save SiteDetail Data into db
        * @returns {*}         
        */
        function updateSiteDetails() {
            if (vm.customerId !== 'undefined' && vm.customerId !== '') {
                vm.siteDetails.files = vm.filesSelected;
                vm.siteDetails.CustomerId = vm.customerId;
                vm.siteDetails.SupervisorList = vm.supervisors;
                vm.siteDetails.GateList = vm.gates;
                vm.siteDetails.SupervisorCount = vm.supervisors.length;
                vm.siteDetails.GateCount = vm.gates.length;

                ManageCustomerFactory
                .addCustomerSite(vm.siteDetails)
                .then(function () {
                    $state.go("configuration.CustomerList");
                });
            }
        }

        /**
        * @name goCustomerList          
        * @desc Navigate to customer list page
        * @returns {*}         
        */
        function goCustomerList() {
            $state.go("configuration.CustomerList");
        }
    }

    //Inject required stuff as parameters to factories controller function
    SiteListCtrl.$inject = ['$scope', 'ManageSiteFactory', 'BCAFactory', 'UtilsFactory', '$stateParams', '$state', 'CONST', 'uiGridConstants'];

    /**
     * @name SiteListCtrl
     * @param $scope    
     * @param ManageSiteFactory
     * @param BCAFactory
     * @param UtilsFactory    
     * @param $stateParams
     * @param $state
     * @param CONST
     * @param uiGridConstants
     */
    function SiteListCtrl($scope, ManageSiteFactory, BCAFactory, UtilsFactory, $stateParams, $state, CONST, uiGridConstants) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customer = '';
        vm.siteList = '';
        vm.customerList = '';
        //vm.bcaTableParams = UtilsFactory.bcaTableOptions('');
        vm.uiGrid = {};

        //methods
        vm.getCustomerList = getCustomerList;
        vm.changeCustomer = changeCustomer;
        vm.getSiteList = getSiteList;
        vm.deleteSite = deleteSite;


        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'CustomerName'
            },
            {
                name: 'PoNumber',
                displayName: 'PO#'
            },
            {
                name: 'SiteDetail',
                field: 'SiteDetail',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.SiteDetail | words:10}}</div>'
            },
            {
                
                field: 'FuelIncluded',
                filter: {                    
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }]
                },               
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{(row.entity.FuelIncluded)?\'Yes\':\'No\'}}</div>'
            },
            {
                field: 'TollTax',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }]
                },
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{(row.entity.TollTax)?\'Yes\':\'No\'}}</div>'
            },
            {
                name: 'CreditTermAgreed'
            },
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ui-sref="configuration.EditSite({SiteId: row.entity.SiteId,CheckRoute: \'2\'})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

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

        //call On page load
        vm.getCustomerList();

        /**
        * @name changeCustomer           
        * @desc Get list of Site according to selected customer from db
        * @returns {*}         
        */
        function changeCustomer(coustomerId) {
           
            if (typeof coustomerId !== 'undefined') {
                vm.getSiteList(coustomerId);
            } else {
                vm.getSiteList(0);
            }
        }

        /**
        * @name getSiteList           
        * @desc Get all Site from db
        * @returns {*}         
        */
        function getSiteList(coustomerId) {
            ManageSiteFactory
            .getAllSite(coustomerId)
            .then(function () {
                vm.uiGrid.data = ManageSiteFactory.siteList.DataList;
                //vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.siteList);
            });
        }

        //Call on page load for default all Site listing
        vm.getSiteList(0);

        /**
       * @name deleteSite           
       * @desc delete Site from db
       * @returns {*}         
       */
        function deleteSite(siteId) {

            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageSiteFactory
                        .deleteSite(siteId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    CreateSiteCtrl.$inject = ['$scope', '$rootScope', 'ManageCustomerFactory', 'UtilsFactory', 'BCAFactory', '$stateParams', '$state', 'CONST', '$filter'];

    /**
     * @name CreateSiteCtrl
     * @param $scope    
     * @param ManageCustomerFactory
     * @param UtilsFactory 
     * @param BCAFactory
     * @param $stateParams
     * @param $state
     * @param CONST
     * @param $filter
     */
    function CreateSiteCtrl($scope, $rootScope, ManageCustomerFactory, UtilsFactory, BCAFactory, $stateParams, $state, CONST, $filter) {
        //Assign controller scope pointer to a variable
        var vm = this;
        vm.siteDetail = '';
        vm.customerId = '';
        vm.attributes = {
            SiteName: '',
            PoNumber: '',
            SiteDetail: '',
            FuelIncluded: false,
            TollsIncluded: false,
            CreditTermAgreed: '',
            SupervisorList: [],
            GateList: [],
            ImageBase64: '',
            Image: '',
            files: '',
            IsActive: true
        };
        vm.customerAttribute = '';

        vm.filesSelected = '';
        vm.CreditTermAgreedList = [30, 60, 90];
        vm.customerList = [];

        //Supervisor object
        vm.supervisorRow = {
            supervisorName: '',
            supervisorEmail: '',
            supervisorMobile: '',
        }
        vm.supervisors = [];
        vm.supervisorError = false;

        //Gate object
        vm.gateRow = {
            gateNumber: '',
            // equipmentType: '',
            tipOffRate: '',
            tippingSite: '',
            contactPerson: [],
        }
        vm.gates = [];
        vm.gateError = false;

        //methods   
        vm.getCustomerList = getCustomerList;
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.updateSiteDetails = updateSiteDetails;
        vm.cancel = cancel;

        /**
         * @name getCustomerList           
         * @desc Get all Customer from db
         * @returns {*}         
         */
        function getCustomerList() {
            BCAFactory.getCustomersDDL()
            .then(function () {

                vm.customerList = BCAFactory.customerList.DataList;
                //If param come from customer Dashboard
                if (typeof $stateParams.CustomerId !== 'undefined' && $stateParams.CustomerId !== '') {
                    vm.customerAttribute = $filter('filter')(vm.customerList, { CustomerId: $stateParams.CustomerId })[0];
                    // vm.customerAttribute = { 'CustomerId': $stateParams.CustomerId };
                }
            });
        }

        // Call on page load
        vm.getCustomerList();

        /**
           * @name loadImageFileAsURL
           * @descDisplay Image name 
           * @returns {*}
           */
        function loadImageFileAsURL() {
            vm.filesSelected = '';
            vm.filesSelected = document.getElementById("inputFileToLoad").files;

            if (typeof vm.filesSelected.length !== 0) {

                vm.attributes.Image = vm.filesSelected[0].name;
            }
        }

        /**
        * @name addSupervisorRow          
        * @desc Temporary add Supervisor Data into array               
        */
        vm.addSupervisorRow = function () {
            if ((vm.supervisorRow.supervisorName !== '' && typeof vm.supervisorRow.supervisorName !== 'undefined')
                && (vm.supervisorRow.supervisorEmail !== '' && typeof vm.supervisorRow.supervisorEmail !== 'undefined')
                && (vm.supervisorRow.supervisorMobile !== '' && typeof vm.supervisorRow.supervisorMobile !== 'undefined')) {
                vm.supervisors.push({
                    'SupervisorName': vm.supervisorRow.supervisorName,
                    'SupervisorEmail': vm.supervisorRow.supervisorEmail,
                    'SupervisorMobile': vm.supervisorRow.supervisorMobile,
                    'IsActive': true
                });
                //Supervisor object
                vm.supervisorRow = {
                    supervisorName: '',
                    supervisorEmail: '',
                    supervisorMobile: '',
                }
                vm.supervisorError = false;
            } else {
                vm.supervisorError = true;
                setTimeout(function () {
                    vm.supervisorError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
         * @name changeSupervisorFields          
         * @desc Check Temporary add Supervisor fileds               
         */
        vm.changeSupervisorFields = function () {
            if ((vm.supervisorRow.supervisorName !== '' && typeof vm.supervisorRow.supervisorName !== 'undefined')
                && (vm.supervisorRow.supervisorEmail !== '' && typeof vm.supervisorRow.supervisorEmail !== 'undefined')
                && (vm.supervisorRow.supervisorMobile !== '' && typeof vm.supervisorRow.supervisorMobile !== 'undefined')) {
                vm.supervisorError = false;
            } else if ((vm.supervisorRow.supervisorName == '' || typeof vm.supervisorRow.supervisorName == 'undefined')
                && (vm.supervisorRow.supervisorEmail == '' || typeof vm.supervisorRow.supervisorEmail == 'undefined')
                && (vm.supervisorRow.supervisorMobile == '' || typeof vm.supervisorRow.supervisorMobile == 'undefined')) {
                vm.supervisorError = false;
            } else {
                vm.supervisorError = true;
            }
        }

        /**
          * @name removeSupervisorRow          
          * @desc Temporary remove Supervisor Data into from array               
          */
        vm.removeSupervisorRow = function (index) {
            vm.supervisors.splice(index, 1);
        }

        /**
         * @name addGateRow          
         * @desc Temporary add Contact Data into array               
         */
        vm.addGateRow = function () {
            console.log("add gate");
            if ((vm.gateRow.gateNumber !== '' && typeof vm.gateRow.gateNumber !== 'undefined')
                && (vm.gateRow.tipOffRate !== '' && typeof vm.gateRow.tipOffRate !== 'undefined' && vm.gateRow.tipOffRate !== null)
                && (vm.gateRow.tippingSite !== '' && typeof vm.gateRow.tippingSite !== 'undefined')) {
                vm.gates.push({
                    'GateNumber': vm.gateRow.gateNumber,
                    //'EquipmentType': vm.gateRow.equipmentType,
                    'TipOffRate': vm.gateRow.tipOffRate,
                    'TippingSite': vm.gateRow.tippingSite,
                    // 'contactPerson': vm.contactPersons,
                    'IsActive': true
                });

                vm.gateRow = {
                    gateNumber: '',
                    // equipmentType: '',
                    tipOffRate: '',
                    tippingSite: '',
                    // contactPerson: [],
                }
                vm.gateError = false;
            } else {
                vm.gateError = true;
                setTimeout(function () {
                    vm.gateError = false;
                    $scope.$apply();

                }, 2000);
            }
        };

        /**
        * @name changeGateFields          
        * @desc Check Temporary add Gate fileds               
        */
        vm.changeGateFields = function () {
            console.log("change gate");
            if ((vm.gateRow.gateNumber !== '' && typeof vm.gateRow.gateNumber !== 'undefined')
              && (vm.gateRow.tipOffRate !== '' && typeof vm.gateRow.tipOffRate !== 'undefined')
              && (vm.gateRow.tippingSite !== '' && typeof vm.gateRow.tippingSite !== 'undefined')) {
                vm.gateError = false;
            } else if ((vm.gateRow.gateNumber == '' || typeof vm.gateRow.gateNumber == 'undefined')
              && (vm.gateRow.tipOffRate == '' || typeof vm.gateRow.tipOffRate == 'undefined')
              && (vm.gateRow.tippingSite == '' || typeof vm.gateRow.tippingSite == 'undefined')) {
                vm.gateError = false;
            } else {
                vm.gateError = true;
            }
        }

        /**
          * @name removeGateRow          
          * @desc Temporary remove Gate Data into from array               
          */
        vm.removeGateRow = function (index) {
            vm.gates.splice(index, 1);
        }

        /**
            * @name updateSiteDetails          
            * @desc Save SiteDetail Data into db
            * @returns {*}         
            */
        function updateSiteDetails() {
            vm.supervisorError = false;
            vm.gateError = false;
            vm.attributes.files = vm.filesSelected;
            vm.attributes.CustomerId = vm.customerAttribute.CustomerId;
            vm.attributes.SupervisorList = vm.supervisors;
            vm.attributes.GateList = vm.gates;
            vm.attributes.SupervisorCount = vm.supervisors.length;
            vm.attributes.GateCount = vm.gates.length;

            //Add new Site
            ManageCustomerFactory
            .addCustomerSite(vm.attributes)
            .then(function () {
                $state.go("configuration.SiteList");
            });
        }

        /**
         * @name hideCancel          
         * @desc Go to list page
         * @returns {*}         
         */
        function cancel() {
            $state.go('configuration.SiteList');
        }
    }

    //Inject required stuff as parameters to factories controller function
    UpdateSiteCtrl.$inject = ['$scope', 'ManageSiteFactory', 'UtilsFactory', '$stateParams', '$state', 'CONST', '$filter', '$location'];

    /**
     * @name UpdateSiteCtrl
     * @param $scope    
     * @param ManageSiteFactory
     * @param UtilsFactory    
     * @param $stateParams
     * @param $state
     * @param CONST
     * @param $filter
     * @param $location
     */
    function UpdateSiteCtrl($scope, ManageSiteFactory, UtilsFactory, $stateParams, $state, CONST, $filter, $location) {
        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customerId = '';
        vm.siteId = '';
        vm.siteDetail = '';
        vm.attributes = {
            CustomerId: '',
            SiteName: '',
            PoNumber: '',
            SiteDetail: '',
            FuelIncluded: false,
            TollTax: false,
            CreditTermAgreed: '',
            ImageBase64: '',
            Image: '',
            files: '',
            IsActive: true,
            CreatedBy: '',
            EditedBy: '',
        };
        vm.filesSelected = '';
        vm.CreditTermAgreedList = [30, 60, 90];

        //methods   
        vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.updateDetails = updateDetails;
        vm.cancel = cancel;

        // Get detail of Site by Id
        if (typeof $stateParams.SiteId !== 'undefined' && $stateParams.SiteId !== '') {
            vm.siteId = $stateParams.SiteId;
            ManageSiteFactory
            .getSiteDetail(vm.siteId)
            .then(function () {
                vm.attributes = ManageSiteFactory.siteInfo.DataObject;
                vm.attributes.CreditTermAgreed = parseInt(vm.attributes.CreditTermAgreed);
            });
        }

        /**
           * @name loadImageFileAsURL
           * @descDisplay Image name 
           * @returns {*}
           */
        function loadImageFileAsURL() {
            vm.filesSelected = '';
            vm.filesSelected = document.getElementById("inputFileToLoad").files;

            if (typeof vm.filesSelected.length !== 0) {

                vm.attributes.Image = vm.filesSelected[0].name;
            }
        }

        /**
         * @name updateDetails          
         * @desc Save Site Data into db
         * @returns {*}         
         */
        function updateDetails() {
            vm.attributes.files = vm.filesSelected;
            vm.attributes.CreatedBy = '';
            vm.attributes.EditedBy = '';
            if (typeof $stateParams.SiteId !== 'undefined' && $stateParams.SiteId !== '') {
                vm.attributes.SiteId = $stateParams.SiteId;
                vm.attributes.IsActive = true;
                ManageSiteFactory
                 .updateSite(vm.attributes)
                 .then(function () {
                     // condition 1 to redirect on customerDashboard
                     if ($stateParams.CheckPage == '1')
                         $location.path('booking/CustomerDashboard/' + vm.attributes.CustomerId);
                     else
                         $state.go("configuration.SiteList");
                 });

            } else {
                ManageSiteFactory
                 .addSite(vm.attributes)
                 .then(function () {
                     $state.go("configuration.SiteList");
                 });
            }
        }

        /**
         * @name hideCancel          
         * @desc Go to list page
         * @returns {*}         
         */
        function cancel() {
            $state.go('configuration.SiteList');
        }
    }

    //Inject required stuff as parameters to factories controller function
    SupervisorCtrl.$inject = ['$scope', 'ManageSupervisorFactory', 'BCAFactory', 'UtilsFactory', '$stateParams', '$state', 'CONST', '$uibModal'];

    /**
     * @name SupervisorCtrl
     * @param $scope    
     * @param ManageSupervisorFactory
     * @param BCAFactory
     * @param UtilsFactory    
     * @param $stateParams
     * @param $state
     * @param CONST
     * @param $uibModal
     */
    function SupervisorCtrl($scope, ManageSupervisorFactory, BCAFactory, UtilsFactory, $stateParams, $state, CONST, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customer = '';
        vm.site = '';
        vm.customerPopup = '';
        vm.sitePopup = '';
        vm.customerList = '';
        vm.siteList = '';
        vm.customerPopupList = '';
        vm.sitePopupList = '';
        vm.supervisorList = '';
        vm.attributes = {
            SupervisorName: '',
            Email: '',
            MobileNumber: '',
            IsActive: true
        }
        //vm.bcaTableParams = UtilsFactory.bcaTableOptions('');
        vm.uiGrid = {};

        //methods
        vm.getCustomerList = getCustomerList;
        vm.getSiteList = getSiteList;
        vm.changeCustomer = changeCustomer;
        vm.changeSite = changeSite;
        vm.addSupervisor = addSupervisor;
        $scope.editSupervisor = editSupervisor;
        vm.getSupervisorList = getSupervisorList;
        vm.saveSupervisor = saveSupervisor;
        vm.deleteSupervisor = deleteSupervisor;
        vm.hideCancel = hideCancel;

        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'CustomerName'
            },
            {
                name: 'SiteName'
            },
            {
                name: 'SupervisorName'
            },
            {
                name: 'Email',
                displayName: 'Supervisor Email'
            },
            {
                name: 'MobileNumber',
                displayName: 'Supervisor Mobile No.'
            },               
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0);" ng-click="grid.appScope.editSupervisor(row.entity);"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

        /**
           * @name getCustomerList           
           * @desc Get all Customer from db
           * @returns {*}         
           */
        function getCustomerList() {
            BCAFactory.getCustomersDDL()
            .then(function () {
                vm.customerList = BCAFactory.customerList.DataList;
                vm.customerPopupList = BCAFactory.customerList.DataList;
            });
        }

        /**
          * @name getSiteList           
          * @desc Get list of site by customer Id from db
          * @returns {*}         
          */
        function getSiteList(customerId, action) {
            BCAFactory.getSitesByCustomerIdDDL(customerId)
            .then(function () {
                if (action == 'list') {
                    vm.siteList = BCAFactory.siteList.DataList;
                } else {
                    vm.sitePopupList = BCAFactory.siteList.DataList;
                }
            });
        }

        /**
         * @name getSupervisorList           
         * @desc Get list of supervisor by site Id from db
         * @returns {*}         
         */
        function getSupervisorList(siteId) {
            ManageSupervisorFactory.getAllSupervisor(siteId)
            .then(function () {
                vm.supervisorList = ManageSupervisorFactory.supervisorList.DataList;
                vm.uiGrid.data = vm.supervisorList;                
            });
        }

        /**
        * @name changeCustomer           
        * @desc Get list of Site according to selected customer from db
        * @returns {*}         
        */
        function changeCustomer(coustomerId, action) {
            console.log("coustomerId", coustomerId);
            if (action == 'list') {
                vm.uiGrid.data = [];
            }
            if (typeof coustomerId !== 'undefined') {
                vm.getSiteList(coustomerId, action);
            } else {
                vm.siteList = '';
                vm.getSupervisorList(0);
            }
        }

        /**
           * @name changeSite           
           * @desc Get list of changeSite according to selected site from db
           * @returns {*}         
           */
        function changeSite(siteId) {
            if (typeof siteId !== 'undefined') {
                vm.getSupervisorList(siteId);
            } else {
                vm.uiGrid.data = [];
            }
        }

        //call On page load
        vm.getCustomerList();

        //call on page load for default listing of supervisor
        vm.getSupervisorList(0);

        /**
       * @name editSupervisor
       * @desc calling popup
       */
        function editSupervisor(data) {
            vm.supervisorName = data.SupervisorName;
            vm.email = data.Email;
            vm.mobileNumber = parseInt(data.MobileNumber);
            vm.supervisorId = data.SupervisorId;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateSupervisor.html',
                scope: $scope
            });
        };

        /**
           * @name addSupervisor
           * @desc calling popup
           */
        function addSupervisor() {
            vm.supervisorName = '';
            vm.email = '';
            vm.mobileNumber = '';
            vm.supervisorId = '';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateSupervisor.html',
                scope: $scope
            });
        };

        /**
           * @name saveSupervisor
           * @desc Save Data
           */
        function saveSupervisor() {

            vm.attributes.SupervisorName = vm.supervisorName;
            vm.attributes.Email = vm.email;
            vm.attributes.MobileNumber = vm.mobileNumber;
            if (vm.supervisorId != '') {
                vm.attributes.SupervisorId = vm.supervisorId;
                ManageSupervisorFactory
                .updateSupervisor(vm.attributes)
                .then(function () {
                    $state.reload();
                });
            } else {
                vm.attributes.CustomerId = vm.customerPopup.CustomerId;
                vm.attributes.SiteId = vm.sitePopup.SiteId;
                ManageSupervisorFactory
               .addSupervisor(vm.attributes)
               .then(function () {
                   $state.reload();
               });
            }

        }

        /**
       * @name deleteSupervisor           
       * @desc delete Supervisor from db
       * @returns {*}         
       */
        function deleteSupervisor(supervisorId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageSupervisorFactory
                        .deleteSupervisor(supervisorId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });

        }

        /**
          * @name hideCancel
          * @desc Hide popup
          */
        function hideCancel() {
            $scope.modalInstance.dismiss();
        }
    }

    //Inject required stuff as parameters to factories controller function
    GateListCtrl.$inject = ['$scope', 'ManageGateFactory', 'BCAFactory', 'UtilsFactory', '$state', 'CONST'];

    /**
     * @name GateListCtrl
     * @param $scope    
     * @param ManageGateFactory
     * @param BCAFactory
     * @param UtilsFactory     
     * @param $state
     * @param CONST
     */
    function GateListCtrl($scope, ManageGateFactory, BCAFactory, UtilsFactory, $state, CONST) {
        //Assign controller scope pointer to a variable
        var vm = this;
        vm.gateList = '';
        vm.attributes = {
            SupervisorName: '',
            Email: '',
            MobileNumber: '',
            IsActive: true
        }
        vm.uiGrid = {};
        vm.uiGrid.data = [];

        //methods
        vm.getGateList = getGateList;
        vm.getCustomerList = getCustomerList;
        vm.getSiteList = getSiteList;
        vm.changeCustomer = changeCustomer;
        vm.changeSite = changeSite;
        vm.deleteGate = deleteGate;
        vm.addContactModal = addContactModal;


        //START UI-Grid Code
        vm.dataSet = [
            {
                name: 'GateNumber'
            },
            {
                name: 'TipOffRate'
            },
            {
                name: 'TippingSite'
            },           
            {
                name: 'Action',
                cellClass: "overflow-visible",
                cellTemplate: ['<div class="btn-group ui-grid-cell-contents ng-binding ng-scope">' +
                                    '<a class="dropdown-toggle" id="dLabel" href="javascript:void(0);" data-toggle="dropdown">' +
                                        '<i class="fa pe-7s-more action-icon" aria-hidden="true"></i>' +
                                    '</a>' +
                                    '<ul class="dropdown-menu hdropdown notification dropdown-menu-right" role="menu">' +
                                                '<li><a href="javascript:void(0)" ui-sref="configuration.EditGate({GateId: row.entity.GateId})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</a></li>' +
                                    '</ul>' +
                                '</div>'
                ].join('')
            }
        ];

        vm.uiGrid = UtilsFactory.uiGridOptionsWithoutExport(vm.dataSet);

        vm.uiGrid.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        }

        //END UI-Grid Code

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

        /**
         * @name getGateList           
         * @desc Get all Gate from db
         * @returns {*}         
         */
        function getGateList(siteId) {
            ManageGateFactory.getAllGate(siteId)
            .then(function () {
                vm.gateList = ManageGateFactory.gateList.DataList;
                vm.uiGrid.data = vm.gateList;
            });
        }

        /**
        * @name changeCustomer           
        * @desc Get list of Site according to selected customer from db
        * @returns {*}         
        */
        function changeCustomer(coustomerId) {
            vm.uiGrid.data = [];
            if (typeof coustomerId !== 'undefined') {
                vm.getSiteList(coustomerId);
            } else {
                vm.siteList = '';
                vm.getGateList(0);
            }
        }

        /**
           * @name changeSupervisor           
           * @desc Get list of changeSite according to selected site from db
           * @returns {*}         
           */
        function changeSite(siteId) {
            if (typeof siteId !== 'undefined') {
                vm.getGateList(siteId);
            } else {
                vm.uiGrid.data = [];
            }
        }

        /**
        * @name addContactModal
        * @desc calling popup
        */
        function addContactModal() {
            // vm.contact.GateContactPersonId = '';
            vm.fromGateList = true;
            vm.contactAttributes.GateId = '';
            vm.contactAttributes.ContactPerson = '';
            vm.contactAttributes.MobileNumber = '';
            vm.contactAttributes.Email = '';
            vm.contactAttributes.IsActive = true;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/configuration/partial/CreateContact.html',
                scope: $scope
                //controller: ModalInstanceCtrl,
            });
        };

        //call On page load
        vm.getCustomerList();

        //Call on page Load
        vm.getGateList(0);

        /**
           * @name deleteGate           
           * @desc delete Gate from db
           * @returns {*}         
           */
        function deleteGate(gateId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageGateFactory
                        .deleteGate(gateId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    ManageGateCtrl.$inject = ['$scope', 'ManageGateFactory', 'ManageBookingSiteFactory', 'UtilsFactory', 'BCAFactory', '$stateParams', '$state', '$uibModal'];

    /**
     * @name ManageGateCtrl
     * @param $scope    
     * @param ManageGateFactory
     * @param ManageBookingSiteFactory
     * @param UtilsFactory  
     * @param BCAFactory 
     * @param $stateParams
     * @param $state
     * @param $uibModal
     */
    function ManageGateCtrl($scope, ManageGateFactory, ManageBookingSiteFactory, UtilsFactory, BCAFactory, $stateParams, $state, $uibModal) {
        //Assign controller scope pointer to a variable
        var vm = this;
        vm.customerId = '';
        vm.siteId = '';
        vm.gateId = '';
        vm.gateDetail = '';
        vm.addContact = [];
        vm.customer = '';
        vm.site = '';

        // Gate Attributes
        vm.attributes = {
            GateNumber: '',
            TipOffRate: '',
            TippingSite: '',
            GateContactPerson: '',
            IsActive: true,
            CreatedBy: '',
            EditedBy: ''
        };

        //Contact Attributes
        vm.contactAttributes = {
            ContactPerson: '',
            MobileNumber: '',
            Email: '',
            IsActive: true,
            CreatedBy: '',
            EditedBy: ''
        };


        //methods   
        //vm.loadImageFileAsURL = loadImageFileAsURL;
        vm.getCustomerList = getCustomerList;
        vm.getSiteList = getSiteList;
        vm.changeCustomer = changeCustomer;
        vm.updateDetails = updateDetails;
        vm.addContactModal = addContactModal;
        vm.editContactModal = editContactModal;
        vm.saveContact = saveContact;
        vm.cancelGate = cancelGate;
        vm.hideCancel = hideCancel;

        // Get detail of Site by Id
        if (typeof $stateParams.GateId !== 'undefined' && $stateParams.GateId !== '') {
            vm.gateId = $stateParams.GateId;
            ManageGateFactory
            .getGateDetail(vm.gateId)
            .then(function () {
                vm.attributes = ManageGateFactory.gateInfo.DataObject;
                vm.addContact = vm.attributes.GateContactPerson;
            });
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

        //call on page load
        vm.getCustomerList();

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

        /**
        * @name changeCustomer           
        * @desc Get list of Site according to selected customer from db
        * @returns {*}         
        */
        function changeCustomer(coustomerId) {
            vm.uiGrid.data = [];
            if (typeof coustomerId !== 'undefined') {
                vm.getSiteList(coustomerId);
            } else {
                vm.siteList = "";
            }
        }


        /**
         * @name addContactModal
         * @desc calling popup
         */
        function addContactModal() {
            // vm.contact.GateContactPersonId = '';
            vm.contactAttributes.GateId = vm.gateId;
            vm.contactAttributes.ContactPerson = '';
            vm.contactAttributes.MobileNumber = '';
            vm.contactAttributes.Email = '';
            vm.contactAttributes.IsActive = true;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/configuration/partial/CreateContact.html',
                scope: $scope
                //controller: ModalInstanceCtrl,
            });
        };

        /**
        * @name editContactModal
        * @desc calling popup
        */
        function editContactModal(contactData) {
            vm.contactAttributes.GateContactPersonId = contactData.GateContactPersonId;
            vm.contactAttributes.GateId = contactData.GateId;
            vm.contactAttributes.ContactPerson = contactData.ContactPerson;
            vm.contactAttributes.MobileNumber = parseInt(contactData.MobileNumber);
            vm.contactAttributes.Email = contactData.Email;
            vm.contactAttributes.IsActive = true;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'Views/configuration/partial/CreateContact.html',
                scope: $scope
                //controller: ModalInstanceCtrl,
            });
        }

        /**
         * @name updateDetails          
         * @desc Save Site Data into db
         * @returns {*}         
         */
        function updateDetails() {
            vm.attributes.GateContactPerson = vm.addContact;
            vm.attributes.CreatedBy = '';
            vm.attributes.EditedBy = '';
            if (typeof $stateParams.GateId !== 'undefined' && $stateParams.GateId !== '') {
                vm.attributes.GateId = $stateParams.GateId;
                vm.attributes.IsActive = true;
                ManageGateFactory
                 .updateGate(vm.attributes)
                 .then(function () {
                     $state.go("configuration.GateList");
                 });

            } else {
                vm.attributes.CustomerId = vm.customer.CustomerId;
                vm.attributes.SiteId = vm.site.SiteId;
                ManageGateFactory
                 .addGate(vm.attributes)
                 .then(function () {
                     $state.go("configuration.GateList");
                 });
            }
        }

        /**
         * @name saveContact          
         * @desc Save Contact Data into DB               
         */
        function saveContact() {
            if (typeof vm.contactAttributes.GateContactPersonId !== 'undefined') {
                ManageBookingSiteFactory
               .updateGateContactPerson(vm.contactAttributes)
               .then(function () {
                   $state.reload();
               });
            } else {
                ManageBookingSiteFactory
               .addGateContactPerson(vm.contactAttributes)
               .then(function () {
                   $state.reload();
               });
            }

            //vm.addContact.push({                
            //    'ContactPerson': vm.contactAttributes.ContactPerson,
            //    'Email': vm.contactAttributes.Email,
            //    'MobileNumber': vm.contactAttributes.MobileNumber,
            //    'IsActive': vm.contactAttributes.IsActive,
            //    'CreatedBy': '',
            //    'EditedBy': ''
            //});

            //Dismiss modal after storing data into a temp array
            vm.hideCancel();
        }

        /**
       * @name updateContact          
       * @desc Update Contact Data into DB               
       */
        function updateContact() {

            ManageBookingSiteFactory
            .updateGateContactPerson(vm.contactAttributes)
            .then(function () {
                $scope.reload();
            });

            //Dismiss modal after storing data into a temp array
            vm.hideCancel();
        }

        /**
        * @name removeContactRow          
        * @desc Temporary remove Contact Data into from array               
        */
        vm.removeContactRow = function (index) {
            vm.addContact.splice(index, 1);
        }

        /**
        * @name cancelGate          
        * @desc Go Back to list page
        * @returns {*}         
        */
        function cancelGate() {
            $state.go("configuration.GateList");
        }

        /**
         * @name hideCancel          
         * @desc Dismiss contact popup
         * @returns {*}         
         */
        function hideCancel() {
            $scope.modalInstance.dismiss();
        }
    }

    //Inject required stuff as parameters to factories controller function
    TaxCtrl.$inject = ['$scope', 'ManageTaxFactory', 'BCAFactory', 'UtilsFactory', '$state', 'CONST', '$uibModal'];

    /**
     * @name TaxCtrl
     * @param $scope    
     * @param ManageTaxFactory
     * @param BCAFactory
     * @param UtilsFactory     
     * @param $state
     * @param CONST
     * @param $uibModal
     */
    function TaxCtrl($scope, ManageTaxFactory, BCAFactory, UtilsFactory, $state, CONST, $uibModal) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.taxList = '';
        vm.taxId = '';
        vm.bcaTableParams = UtilsFactory.bcaTableOptions('');
        vm.attributes = {
            TaxType: '',
            Rate: '',
            IsActive: true
        };

        //methods
        vm.getTaxList = getTaxList;
        vm.addTax = addTax;
        vm.editTax = editTax;
        vm.saveTax = saveTax;
        vm.deleteTax = deleteTax;
        vm.hideCancel = hideCancel;

        /**
         * @name getTaxList           
         * @desc Get all Tax from db
         * @returns {*}         
         */
        function getTaxList() {
            ManageTaxFactory.getAllTax()
            .then(function () {
                vm.taxList = ManageTaxFactory.taxList.DataList;
                vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.taxList);
            });
        }

        //call On page load
        vm.getTaxList();

        /**
         * @name addTax
         * @desc calling popup
         */
        function addTax() {
            vm.type = '';
            vm.taxId = '';
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateTax.html',
                scope: $scope               
            });
        };

        /**
         * @name hideCancel
         * @desc Hide popup
         */
        function hideCancel() {
            $scope.modalInstance.dismiss();
        }
       
        /**
       * @name editTax
       * @desc callin popup
       */
        function editTax(data) {
            vm.taxType = data.TaxType;
            vm.rate = data.Rate;
            vm.taxId = data.TaxId;
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/configuration/partial/CreateTax.html',
                scope: $scope
            });
        };

        /**
         * @name saveTax
         * @desc Save Data
         */
        function saveTax() {
           
            vm.attributes.TaxType = vm.taxType;
            vm.attributes.Rate = vm.rate;
           
            // Add/Edit Tax
            if (vm.taxId === '') {
               
                ManageTaxFactory
                .addTax(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            } else {

                vm.attributes.TaxId = vm.taxId;                
                ManageTaxFactory
                .updateTax(vm.attributes)
                .then(function () {
                    $scope.modalInstance.dismiss();
                    $state.reload();
                });
            }

        }

        /**
           * @name deleteTax       
           * @desc delete Tax from db
           * @returns {*}         
           */
        function deleteTax(taxId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {
                    //Call UserFactory factory get all factories data
                    ManageTaxFactory
                        .deleteTax(taxId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    RateListCtrl.$inject = ['$scope', 'ManageRateFactory', 'BCAFactory', 'UtilsFactory', '$state', 'CONST'];
 
    /**
    * @name RateListCtrl
    * @param $scope    
    * @param ManageRateFactory
    * @param BCAFactory
    * @param UtilsFactory     
    * @param $state
    * @param CONST
    */
    function RateListCtrl($scope, ManageRateFactory, BCAFactory, UtilsFactory, $state, CONST) {

        //Assign controller scope pointer to a variable
        var vm = this;
        vm.rateList = '';
        vm.bcaTableParams = UtilsFactory.bcaTableOptions('');

        //methods
        vm.getRateList = getRateList;
        vm.deleteRate = deleteRate;

        /**
         * @name getRateList           
         * @desc Get all Rate from db
         * @returns {*}         
         */
        function getRateList() {
            ManageRateFactory.getAllRate()
            .then(function () {
                vm.rateList = ManageRateFactory.rateList.DataList;
                vm.bcaTableParams = UtilsFactory.bcaTableOptions(vm.rateList);
            });
        }

        //call On page load
        vm.getRateList();

        /**
           * @name deleteRate     
           * @desc delete Rate from db
           * @returns {*}         
           */
        function deleteRate(rateId) {
            UtilsFactory.confirmBox('Confirm', 'Are you sure to delete record?', function (isConfirm) {
                if (isConfirm) {

                    //Call UserFactory factory get all factories data
                    ManageTaxFactory
                        .deleteRate(rateId)
                        .then(function () {
                            $state.reload();
                        });
                }
            });
        }

    }

    //Inject required stuff as parameters to factories controller function
    ManageRateCtrl.$inject = ['$scope', 'ManageRateFactory', 'UtilsFactory', 'BCAFactory', '$stateParams', '$state', '$uibModal'];

    /**
     * @name ManageRateCtrl
     * @param $scope    
     * @param ManageRateFactory
     * @param UtilsFactory    
     * @param $stateParams
     * @param $state
     * @param $uibModal
     */
    function ManageRateCtrl($scope, ManageRateFactory, UtilsFactory, BCAFactory, $stateParams, $state, $uibModal) {
        //Assign controller scope pointer to a variable
        var vm = this;
        vm.rateId = '';

        // Rate Attributes
        vm.attributes = {
            CustomerId: '',
            FleetTypeId: '',
            FleetRegistrationId: '',
            WorkTypeId: '',
            RateType: '',
            Rate: '',
            IsActive: true
        };

        //Array type
        vm.rateTypeList = ['Hourly', 'daily', 'monthly'];
        vm.customerList = [];
        vm.fleetTypeList = [];
        vm.fleetRegistrationList = [];
        vm.workTypeList = [];


        //objectType
        vm.customerObj = '';
        vm.fleetTypeObj = '';
        vm.fleetRegistrationObj = '';
        vm.workTypeObj = '';

        //methods 
        vm.updateDetails = updateDetails;
        vm.getCustomers = getCustomers;
        vm.getFleetType = getFleetType;
        vm.getFleetRegistrations = getFleetRegistrations;
        vm.getWorkType = getWorkType;
        
        /**
          * @name getCustomers     
          * @desc Get customer list from db
          * @returns {*}         
          */
        function getCustomers() {
            BCAFactory.getCustomersDDL()
             .then(function () {
                 vm.customerList = BCAFactory.customerList.DataList;
                 console.log(vm.customerList);
             });            
        }

        /**
        * @name getFleetType          
        * @desc Get Fleet type list from db
        * @returns {*}         
        */
        function getFleetType() {

            BCAFactory.getFleetTypesDDL()
             .then(function () {
                 vm.fleetTypeList = BCAFactory.fleetTypeList.DataList;
                 console.log(vm.fleetTypeList);
             });
        }

        /**
        * @name getFleetRegistration          
        * @desc Get Fleet Registration list from db
        * @returns {*}         
        */
        function getFleetRegistrations() {

            if (vm.fleetTypeObj != '' && vm.fleetTypeObj.hasOwnProperty('FleetTypeId')) {

                BCAFactory.getFleetRegistrationsByFleetTypeIdDDL(vm.fleetTypeObj.FleetTypeId)
                .then(function () {
                    vm.fleetRegistrationList = BCAFactory.fleetRegistrationList.DataList;
                    console.log(vm.fleetRegistrationList);
                });

            } else {
                vm.fleetRegistrationList = [];
            }
            
        }

        // method call on change of fleet dropdown
        vm.fleetChange = function (change, FleetTypeId) {
            
            // change: true for first default call for getBookingFleetDetail function
            if (!change) {

                vm.attributes.FleetRegistrationId = '';              
            }

            //calling funtion of getFleetRegistrationDropDownListing
            if (FleetTypeId != "") {

                getFleetRegistrations();
            } else {

                vm.fleetRegistrationList = '';               
            }
        }

        /**
        * @name getWorkType          
        * @desc Get Work Type list from db
        * @returns {*}         
        */
        function getWorkType() {

            BCAFactory.getWorkTypesDDL()
             .then(function () {
                 vm.workTypeList = BCAFactory.workTypeList.DataList;
                 console.log(vm.workTypeList);
             });

        }

        //Call on page load
        vm.getFleetType();
        vm.getCustomers();
        vm.getWorkType();

        // Get detail of Rate by Id
        if (typeof $stateParams.RateId !== 'undefined' && $stateParams.RateId !== '') {
            vm.rateId = $stateParams.RateId;
            ManageRateFactory
            .getRateDetail(vm.rateId)
            .then(function () {
                vm.attributes = ManageRateFactory.rateInfo.DataObject;
            });
        }


        /**
         * @name updateDetails          
         * @desc Save Rate Data into db
         * @returns {*}         
         */
        function updateDetails() {
            vm.attributes = vm.attributes;
            vm.attributes.CustomerId = vm.customerObj.CustomerId;
            vm.attributes.FleetTypeId = vm.fleetTypeObj.FleetTypeId;
            vm.attributes.FleetRegistrationId = vm.fleetRegistrationObj.FleetRegistrationId;
            vm.attributes.WorkTypeId = vm.workTypeObj.Value;
            console.log(vm.attributes);
            if (typeof $stateParams.RateId !== 'undefined' && $stateParams.RateId !== '') {
                vm.attributes.RateId = $stateParams.RateId;

                //Update Rate
                ManageRateFactory
                 .updateRate(vm.attributes)
                 .then(function () {
                     $state.go("configuration.RateList");
                 });

            } else {

                //Add new Rate
                ManageRateFactory
                  .addRate(vm.attributes)
                  .then(function () {
                      $state.go("configuration.RateList");
                  });
            }
        }


        /**
        * @name cancelGate          
        * @desc Go Back to list page
        * @returns {*}         
        */
        function cancelRate() {
            $state.go("configuration.RateList");
        }
    }

}());