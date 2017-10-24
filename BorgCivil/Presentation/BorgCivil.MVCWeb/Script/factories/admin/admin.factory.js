(function () {
    'use strict';

    /**
     * Associate booking factory, booking  info factory with BCA module
     */
    angular
		.module('borgcivil')
		//.factory('AdminFactory', AdminFactory)
        .factory('LoginFactory', LoginFactory)
        .factory('rememberMe', rememberMe)
        .factory('forgetMe', forgetMe)
        //.factory('changePasswordFactory', changePasswordFactory)

    //Inject required modules to factory method
    LoginFactory.$inject = ['$http', '$q', 'CONST', 'NotificationFactory'];

    /**
     * @name AdminFactory
     * @desc Login users
     * @returns {{loginObj}}
     * @constructor
     */
    function LoginFactory($http, $q, CONST, NotificationFactory) {
        var loginObj = {
            loginObject: {},
            forgetPasswordResponse: true,

            /**
            * @name userLogin
            * @desc login user from db
            * @returns {response message}
            */
            userLogin: function (loginData) {
               
                return $http.post(CONST.CONFIG.API_URL + 'Configuration/EmployeeLogin', loginData, {

                })
                .then(function (response) {                
                    
                    if (response.status == 200 && response.data.Succeeded) {

                        //case of success/with no error.
                        //NotificationFactory.success(CONST.MSG.SUCCESS_LOGGED_IN);
                        loginObj.loginObject = response.data.DataObject;
                       
                    } else if (response.status == 204) {

                        console.log(response);
                        //case of success/with error.
                        loginObj.loginObject = response.data.Succeeded;
                        NotificationFactory.error("Error: " + CONST.MSG.LOGIN_ERROR);
                        // NotificationFactory.error(CONST.MSG.LOGIN_ERROR);                       

                    }

                }, function (response) {
                    NotificationFactory.error("Error: " + response.data.Message);
                    return $q.reject(response.data);                 

                });
               
            },

            /**
           * @name ForgotPassword
           * @desc Reset user password from db
           * @returns {response message}
           */
            forgotPassword: function (emailId) {

                return $http.post(CONST.CONFIG.API_URL + 'Configuration/ForgotPassword', emailId, { })
                    .then(function (response) {
                       
                        if (response.status == 200) {

                            NotificationFactory.success(CONST.MSG.PASSWROD_CHANGE_EMAIL_SENT);
                        }
                        else if (response.status == 204) {

                            NotificationFactory.error(CONST.MSG.UNREGISTERED_EMAIL);
                            loginObj.forgetPasswordResponse = false;
                        } else {

                            NotificationFactory.error(response.data);
                        }

                    }, function (response) {

                        return $q.reject(response.data);
                        NotificationFactory.error(false);

                    });
            },
            
        }
        return loginObj;
    }

    /**
    * @name rememberMe
    * @desc Remember cookie of user password
    * @returns *
    * @constructor
    */
    function rememberMe() {
        return function (name, values) {
            var cookie = name + '=';

            cookie += values + ';';

            var date = new Date();
            date.setDate(date.getDate() + 365);

            cookie += 'expires=' + date.toString() + ';';

            document.cookie = cookie;
        }
    }

    /**
    * @name forgetMe
    * @desc Remove cookies of user password
    * @returns {{loginObj}}
    * @constructor
    */
    function forgetMe() {
        return function (name) {
            var cookie = name + '=;';
            cookie += 'expires=' + (new Date()).toString() + ';';

            document.cookie = cookie;
        }
    }
})();