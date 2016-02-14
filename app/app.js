/**
 * Created by khanc on 2/13/2016.
 */

var myApp = angular.module('tripSorter', []);

myApp.value('SORTING_TYPES', ['Cheapest', 'Fastest']);

myApp.controller('mainController', ['$scope', 'SORTING_TYPES', function($scope, SORTING_TYPES) {
    console.log('inside mainController');

    var response = $api.getResponse();

    $scope.deals = response.deals;
    $scope.SORTING_TYPES = SORTING_TYPES;
    $scope.cities = setCities();

    function setCities() {
        var citiesHashmap = {};
        var cities = [];
        for (var i in $scope.deals) {
            var deal = $scope.deals[i];

            if (!citiesHashmap[deal.departure]) {
                citiesHashmap[deal.departure] = 1;
                cities.push(deal.departure);
            }

            if (!citiesHashmap[deal.arrival]) {
                citiesHashmap[deal.arrival] = 1;
                cities.push(deal.arrival);
            }
        }

        cities.sort();
        return cities;
    }



}]);
