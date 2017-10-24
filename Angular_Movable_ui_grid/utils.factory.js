(function() {
    'use strict';
    /**
     * Client Factory
     * Created by: Kapil Chhabra (SIPL)
     * Created On: 21-07-2016
     */

    //Inject required modules to factory method
    UtilsFactory.$inject = ['$http'];

    /**
     * @name UtilsFactory
     * @desc Contains all notification methods to be used in whole application
     * @param notify
     * @constructor
     */
    function UtilsFactory($http)
    {
        var bcaUtilities = {

            //UI-GRID for movable column features for the booking module
            uiGridOptions: function (dataCols) {
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
                    exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                    exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
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
            }        
        }
        return bcaUtilities;
    }

    /**
     * Associate factory with BCA module
     */
    angular
        .module('app')
        .factory('UtilsFactory', UtilsFactory)    
})();