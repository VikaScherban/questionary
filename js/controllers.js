'use strict';

/* Controllers */
var questApp = angular.module('questApp', ['ngRoute', 'ngResource']);

questApp.config(['$routeProvider', '$locationProvider', function ($routeProvide) {
    $routeProvide
        .when('/', {
            templateUrl: 'templates/first.html',
            controller: 'FirstStepCtrl'
        })
        .when('/second', {
            templateUrl: 'templates/second.html',
            controller: 'SecondStepCtrl'
        })
        .when('/third', {
            templateUrl: 'templates/third.html',
            controller: 'ThirdStepCtrl'
        })
        .when('/fourth', {
            templateUrl: 'templates/fourth.html',
            controller: 'FourthStepCtrl'
        })
        .when('/fifth', {
            templateUrl: 'templates/last.html',
            controller: 'LastStepCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

questApp.controller('AppCtrl', ['$scope', '$http', '$location', 'CustomerService',
    function ($scope, $http, $location, CustomerService) {
        $scope.customer = {
            Name: '',
            Email: '',
            Country: '',
            City: '',
            fb: '',
            vk: '',
            twitter: '',
            odnoklassniki: '',
            avatar: ''
        };

        $http.get('resources/countries.json').success(function (data) {
            $scope.countries = data;
        });

        var citylist;
        $http.get('resources/cities.json').success(function (data) {
            citylist = data;
        });

        $scope.getCountryCities = function () {
            if ($scope.customer.Country == "Ukraine") $scope.cities = CustomerService.getCountryCity(1, citylist, $scope.customer.Country);
            else  $scope.cities = CustomerService.getCountryCity(0, citylist, '');
        };

        $scope.Return = function () {
            $location.path('/');
            $scope.customer = {
                Name: '',
                Email: '',
                Country: '',
                City: '',
                fb: '',
                vk: '',
                twitter: '',
                odnoklassniki: '',
                avatar: ''
            };
            document.getElementById('navigation').style.display = 'block';
        };

    }]);

questApp.factory("CustomerService", [
    function () {

        var service = {};

        service.getCountryCity = function (country, citylist, countryname) {
            var items = {};
            for (var index in citylist) {
                if (citylist[index].country == country && citylist[index].name != countryname) {
                    items[index] = citylist[index];
                }
            }
            return items;
        };

        return service;
    }]);


questApp.factory('NextBackBasicService', function ($route, $location) {
    //array for keeping defined routes
    var routes = [];

    angular.forEach($route.routes, function (config, route) {
        //not to add same route twice
        if (angular.isUndefined(config.redirectTo)) {
            routes.push(route);
        }
    });

    return {
        goNext: function () {
            var nextIndex = routes.indexOf($location.path()) + 1;
            if (nextIndex !== routes.length) {
                $location.path(routes[nextIndex]);
            }
            if (nextIndex === 4) {
                document.getElementById('navigation').style.display = 'none';
            }
        },
        goBack: function () {
            var backIndex = routes.indexOf($location.path()) - 1;
            if (backIndex !== -1) {
                $location.path(routes[backIndex]);
            }
        }
    };

});

questApp.run(function ($rootScope, NextBackBasicService) {
    $rootScope.goNext = function () {
        NextBackBasicService.goNext();
    };

    $rootScope.goBack = function () {
        NextBackBasicService.goBack();
    };
});


questApp.controller('FirstStepCtrl', ['$scope', '$location', '$rootScope', 'NextBackBasicService',
    function ($scope, $location, $rootScope, NextBackBasicService) {
        $rootScope.goNext = function () {
            if ($scope.userForm.$valid) {
                NextBackBasicService.goNext();
            }
        }
    }]);

questApp.controller('SecondStepCtrl', ['$scope', '$location', '$rootScope', 'NextBackBasicService',
    function ($scope, $location, $rootScope, NextBackBasicService) {
        $rootScope.goNext = function () {
            if ($scope.secondForm.$valid) {
                NextBackBasicService.goNext();
            }
        }
    }]);

questApp.controller('ThirdStepCtrl', ['$scope', '$location', '$rootScope', 'NextBackBasicService',
    function ($scope, $location, $rootScope, NextBackBasicService) {
        $rootScope.goNext = function () {
            NextBackBasicService.goNext();
        };
    }]);

questApp.controller('FourthStepCtrl', ['$scope', '$location', '$rootScope', 'NextBackBasicService',
    function ($scope, $location, $rootScope, NextBackBasicService) {
        $rootScope.goNext = function () {
            if ($scope.customer.avatar != 'av4' || $location.path() != "/fourth") {
                NextBackBasicService.goNext();
            }
        }
    }]);

questApp.controller('LastStepCtrl', function ($scope, $location) {
});








