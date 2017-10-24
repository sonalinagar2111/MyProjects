(function () {
    'use strict';

    /**
     * Booking Controller
     * Created by: (SIPL)
     */
    angular
        .module('app')
        .controller('MovableGridCtrl', MovableGridCtrl)
        //Inject required stuff as parameters to factories controller function
    MovableGridCtrl.$inject = ['$scope', '$http', 'UtilsFactory'];

   
    function MovableGridCtrl( $scope, $http, UtilsFactory ) {

    	//Assign controller scope pointer to a variable
	   var vm = this;
	   vm.uiGrid = {};
	   vm.print = print;
	   $scope.showMe = showMe;
	   //START UI-Grid Code
	       
	        vm.dataSet = [
	            { name: 'id'},
	            { name: 'name'},
	            { name: 'age'},
	            { name: 'gender'},
	            { name: 'email'},
	            { name:'Action',
	              cellTemplate:'<button class="btn primary" ng-click="grid.appScope.showMe(\'Alert1\')">Click Me</button>'+
								'<button class="btn primary" ng-click="grid.appScope.showMe(\'Alert2\')">Click Me</button>'
	            },
	           
	        ];
	       
	        vm.uiGrid = UtilsFactory.uiGridOptions(vm.dataSet);

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

	        function showMe(param){
	       		alert(param);
	        }

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
	        //END UI-Grid Code

	 

		$http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
		    .success(function(data) {
		      vm.uiGrid.data = data;
		      console.log($scope.gridOptions);
		    });
	}
})();