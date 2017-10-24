(function() {
    'use strict';
    /**
     * Client Factory
     * Created by: Kapil Chhabra (SIPL)
     * Created On: 21-07-2016
     */

    //Inject required modules to factory method
    UtilsFactory.$inject = ['CONST', '$http', 'NotificationFactory', 'SweetAlertFactory', 'notify', 'NgTableParams'];

    /**
     * @name UtilsFactory
     * @desc Contains all notification methods to be used in whole application
     * @param notify
     * @constructor
     */
    function UtilsFactory(CONST, $http, NotificationFactory, SweetAlertFactory, notify, NgTableParams)
    {
        var bcaUtilities = {
            confirmBox : function (title, message, callback) {
                return SweetAlertFactory.swal({
                        title: title,
                        text: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Ok",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        closeOnCancel: true },

                function (isConfirm) {
                    callback(isConfirm);
                });
            },

            oops : function (title, message) {
                return SweetAlertFactory.swal({
                    title: title,
                    text: message,
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    closeOnConfirm: false
                });
            },

            range : function(min, max, step){
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) input.push(i);
                return input;
            },

            capitalizeFirstLetter : function(string){
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            /* jshint ignore:start */
            createNgTable : function(data) {
                return new NgTableParams({}, { dataset: data});
            },

            bcaTableOptions : function (dataset) {
                var per_page = 10;
                if(arguments.length > 1){
                    per_page = arguments[1];
                }
                var initialParams = {
                    count: per_page // initial page size
                };
                var initialSettings = {
                    // page size buttons (right set of buttons in demo)
                    counts: [10,20,30,50,100,500,1000],
                    // determines the pager buttons (left set of buttons in demo)
                    paginationMaxBlocks: 5,
                    paginationMinBlocks: 2,
                    dataset: dataset
                };
                return new NgTableParams(initialParams, initialSettings);
            },

            bcaGroupTableOptions : function (dataset, group) {
                var per_page = 10;
                if(arguments.length > 2){
                    per_page = arguments[2];
                }
                var initialParams = {
                    count: per_page, // initial page size
                    group: group
                };
                var initialSettings = {
                    // page size buttons (right set of buttons in demo)
                    counts: [10,20,30,50],
                    // determines the pager buttons (left set of buttons in demo)
                    paginationMaxBlocks: 5,
                    paginationMinBlocks: 2,
                    dataset: dataset
                };
                return new NgTableParams(initialParams, initialSettings);
            },

            /* jshint ignore:end */
            uniqueArraybyKey : function (collection, keyname) {
                var output = [], 
                          keys = [];

                      angular.forEach(collection, function(item) {
                          var key = item[keyname];
                          if(keys.indexOf(key) === -1) {
                              keys.push(key);
                              output.push(item);
                          }
                      });
                return output;
            },

            serverPagination: function(url,attr){
                var per_page = 10;
                if(arguments.length > 2){
                    per_page = arguments[2];
                }
                return new NgTableParams({
                    page: 1,
                    count: per_page
                }, {
                    counts: [10,20,30,50],
                    getData: function($defer, params) {
                        var param =  {pageNumber:params.page() - 1, limit: params.count(), sorting: params.sorting() };
                        angular.extend(param, attr);
                        $http.post(CONST.CONFIG.API_URL + url, param)
                            .success(function(response) {
                                params.total(response.result.total);
                                $defer.resolve(response.result.ezData);
                            });
                    }
                })
            },

            //get object size
            objectSize: function (obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            },

            //UI-GRID for movable column features for the booking module
            uiGridOptionsWithExport: function (dataCols) {
                var vm = this;
                var gridOptions = {                  

                    enableFiltering: true,
                    enableColumnResizing: true,
                    flatEntityAccess: true,
                    showGridFooter: true,
                    fastWatch: true,
                    paginationPageSizes: [10, 25, 50, 75],
                    paginationPageSize: 10,
                    enableGridMenu: true,
                    enableSelectAll: true,
                    exporterCsvFilename: 'myFile.csv',
                    exporterPdfDefaultStyle: { fontSize: 9 },
                    exporterPdfTableStyle: { margin: [0, 30, 30, 30] },
                    exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                    exporterPdfHeader: { text: "Booking List", style: 'headerStyle' },
                    exporterPdfFooter: function (currentPage, pageCount) {
                        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
                        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                        return docDefinition;
                    },
                    exporterPdfOrientation: 'portrait',
                    exporterPdfPageSize: 'LETTER',
                    exporterPdfMaxGridWidth: 500,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                   // data: dataSet,
                    importerDataAddCallback: function (grid, newObjects) {
                        console.log(newObjects);
                        $scope.data = $scope.data.concat(newObjects);
                    },
                    columnDefs: dataCols                   
                   
                }
                return gridOptions;
            },
             
            //UI-GRID for movable column features for the configuration module
            uiGridOptionsWithoutExport: function (dataCols) {
                //var vm = this;
                var gridOptions = {                  

                    enableFiltering: true,
                    enableColumnResizing: true,
                    flatEntityAccess: true,
                    showGridFooter: true,
                    fastWatch: true,
                    paginationPageSizes: [10, 25, 50, 100, 500],
                    paginationPageSize: 10,
                    enableGridMenu: true,                   
                    columnDefs: dataCols                   
                   
                }
                return gridOptions;
            },

            printTableHTML: function (gridColumnData, gridData) {
                var columnTitle = '', columnData = '', innerContents = '';

                //If column are moved then store updated column ordered object into var moveColumns 
                //Else stored default ordered object into var moveColumns  
                if (gridColumnData.grid.moveColumns.orderCache.length > 0) {
                    var moveColumns = gridColumnData.grid.moveColumns.orderCache;

                } else {
                    var moveColumns = gridColumnData.grid.columns;
                }

                //Binding dynamic heading into table HTML for print
                columnTitle += '<tr>';

                for (var i = 0; i < moveColumns.length; i++) {
                    if (moveColumns[i].displayName !== '' && moveColumns[i].displayName !== 'Action') {
                        columnTitle += '<td><b>' + moveColumns[i].displayName + '</b></td>';
                    }
                }
                columnTitle += '</tr>';

                //Binding dynamic data into table HTML for print
                if (gridData.length > 0) {
                    for (var j = 0; j < gridData.length; j++) {

                        columnData += '<tr>';
                        for (var i = 0; i < moveColumns.length; i++) {

                            console.log(moveColumns[i].field, moveColumns[i].displayName);

                            // Ignore Blank and Action field for print
                            if (moveColumns[i].displayName !== '' && moveColumns[i].displayName !== 'Action') {

                                console.log(gridData[j]);
                                columnData += '<td>' + gridData[j][moveColumns[i].field] + '</td>';
                            }

                        }
                        columnData += '</tr>';
                    }
                } else {
                    columnData += '<tr><td colspan="' + moveColumns.length + '" align="center">No records found</td></tr>';
                }

                //binding complete HTML for print                 
                innerContents += '<table width="100%" border="1" cellpadding="0" cellspacing="0" align="center" style="border:1px solid #b5b5b5;width:100%;"><thead>';
                innerContents += columnTitle;
                innerContents += '</thead>';

                innerContents += '<tbody style="background-color:#fff;">';
                innerContents += columnData;
                innerContents += '</tbody></table>';

                return innerContents;
            },

            // multiple formats (e.g. yyyy/mm/dd or mm-dd-yyyy etc.)
            tryParseDateFromString: function (dateStringCandidateValue) {
            var format = "ymd";
            if (!dateStringCandidateValue) { return null; }
            let mapFormat = format
                    .split("")
                    .reduce(function (a, b, i) { a[b] = i; return a; }, {});
            const dateStr2Array = dateStringCandidateValue.split(/[ :\-\/]/g);
            const datePart = dateStr2Array.slice(0, 3);
            let datePartFormatted = [
                    +datePart[mapFormat.y],
                    +datePart[mapFormat.m] - 1,
                    +datePart[mapFormat.d]];
                              
                // test date validity according to given [format]
            const dateTrial = new Date(Date.UTC.apply(null, datePartFormatted));
            return dateTrial && dateTrial.getFullYear() === datePartFormatted[0] &&
                   dateTrial.getMonth() === datePartFormatted[1] &&
                   dateTrial.getDate() === datePartFormatted[2]
                      ? dateTrial :
                      null;
        },

        //convert datetime string to date object
        convertDateTimeStringToDate: function (dateString) {
            return moment(dateString.replace(/-/g, "/"), 'DD/MM/YYYY hh:mm a')._d;
        }
        }

        return bcaUtilities;
    }

    //Inject required modules to factory method
    NotificationFactory.$inject = ['CONST', 'toaster', '$http'];

    /**
     * @name NotificationFactory
     * @desc Contains all notification methods to be used in whole application
     * @param notify
     * @constructor
     */
    function NotificationFactory(CONST, toaster, $http)
    {
        var bcaNotification = {
            /**
             * @name success
             * @desc Show success message
             * @param message
             */
            success: function (message) {
                //console.log('message'+message)
                toaster.success('Success', message);
            },

            /**
             * @name error
             * @desc Show common error message
             */
            error : function(err) {
                if(!err || err == ''){
                    err = CONST.MSG.COMMON_ERROR;
                }
                toaster.error('Failed', err);
            },

            /**
             * @name warning
             * @desc Show warning message
             * @param message
             */
            warning : function(message) {
                toaster.clear();
                toaster.pop('warning', 'Info', message);
            },

            /**
             * @name waiting
             * @desc Show custom waiting message
             * @param message
             */
            waiting : function(message) {
                toaster.pop('wait', '', null, null);
            },

            /**
             * @name requestWaiting
             * @desc Show request waiting message
             * @param message
             */
            requestWaiting : function() {
                toaster.pop('wait', CONST.MSG.WAITING_REQUEST, null, null);
            },

            /**
             * @name dataRetrievalWaiting
             * @desc Show data retrieval waiting message
             * @param message
             */
            dataRetrievalWaiting : function() {
                toaster.pop('wait', CONST.MSG.WAITING_DATA_RETRIEVAL, null, null);
            },

            /**
             * for clear all toaster messages
             */
            clear : function() {
                toaster.clear();
            }
        };

        return bcaNotification;
    }

   
//Inject required modules to factory method
SweetAlertFactory.$inject = ['$timeout', '$window'];

/**
 * @name SweetAlertFactory
 * @desc Contains all common methods to be used for sweet alert
 * @param notify
 * @constructor
 */
function SweetAlertFactory($timeout, $window) {
    var swal = $window.swal;
    return {
        swal: function (arg1, arg2, arg3) {
            $timeout(function () {
                if (typeof(arg2) === 'function') {
                    swal(arg1, function (isConfirm) {
                        $timeout(function () {
                            arg2(isConfirm);
                        });
                    }, arg3);
                } else {
                    swal(arg1, arg2, arg3);
                }
            }, 200);
        },
        success: function (title, message) {
            $timeout(function () {
                swal(title, message, 'success');
            }, 200);
        },
        error: function (title, message) {
            $timeout(function () {
                swal(title, message, 'error');
            }, 200);
        },
        warning: function (title, message) {
            $timeout(function () {
                swal(title, message, 'warning');
            }, 200);
        },
        info: function (title, message) {
            $timeout(function () {
                swal(title, message, 'info');
            }, 200);
        }

    };
};

    /**
     * Associate factory with BCA module
     */
    angular
        .module('borgcivil')
        .factory('UtilsFactory', UtilsFactory)
        .factory('NotificationFactory', NotificationFactory)
        .factory('SweetAlertFactory', SweetAlertFactory);
})();