/**
 * Created by khanc on 2/13/2016.
 */

var myApp = angular.module('tripSorter', []);

myApp.value('SORTING_TYPES', ['Cheapest', 'Fastest']);

myApp.service('apiResponse', function() {
    this.get = function() {
        return $apiResponseInjected.getResponse();
    };
});

myApp.service('shortestPathFinder', function() {
    this.find = function(deals, dealReferenceMap, sortingType, fromCity, toCity) {
        return $shortestPathFinderInjected.run(deals, dealReferenceMap, sortingType, fromCity, toCity);
    };
});

myApp.controller('mainController', ['$scope', 'SORTING_TYPES', 'apiResponse', 'shortestPathFinder', function($scope, SORTING_TYPES, apiResponse, shortestPathFinder) {
    console.log('inside mainController');

    var response = apiResponse.get();
    var dealReferenceMap = getDealReferenceMap(response.deals);

    $scope.deals = response.deals;
    $scope.SORTING_TYPES = SORTING_TYPES;
    $scope.cities = getCities($scope.deals);
    $scope.sortingType = $scope.SORTING_TYPES[0];
    $scope.fromCity = 'London'; //TODO: remove default value
    $scope.toCity = 'Athens'; //TODO: remove default value
    $scope.trips;

    $scope.changeSortingType = function(sortingType) {
        $scope.sortingType = sortingType;
    };

    $scope.submitForm = function() {
        validate($scope.fromCity, $scope.toCity);

        $scope.trips = shortestPathFinder.find($scope.deals, dealReferenceMap, $scope.sortingType, $scope.fromCity, $scope.toCity);
    };

    function validate(fromCity, toCity) {
        //TODO: need to update UI for input validation
        if (!fromCity || !toCity)
            throw 'Please select from and to cities';
    }

    function getCities(deals) {
        var cityHashmap = {};
        var cities = [];
        for (var i in deals) {
            var deal = deals[i];

            if (!cityHashmap[deal.departure]) {
                cityHashmap[deal.departure] = 1;
                cities.push(deal.departure);
            }

            if (!cityHashmap[deal.arrival]) {
                cityHashmap[deal.arrival] = 1;
                cities.push(deal.arrival);
            }
        }

        cities.sort(); // alphabetical order
        return cities;
    }

    function getDealReferenceMap(deals) {
        var dealsMap = [];
        for (var i in deals) {
            dealsMap[deals[i].reference] = deals[i];
        }

        return dealsMap;
    }

}]);
