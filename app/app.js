/**
 * Created by Omar Khan
 */

var myApp = angular.module('tripSorter', []);

myApp.value('SORTING_TYPES', ['Cheapest', 'Fastest']);

myApp.service('apiResponse', function() {
    this.get = function() {
        // This is where a http request would be made to get the API response
        return $apiResponseInjected.getResponse();
    };
});

myApp.service('shortestPathFinder', function() {
    this.find = function(deals, dealReferenceMap, sortingType, fromCity, toCity) {
        return $shortestPathFinderInjected.run(deals, dealReferenceMap, sortingType, fromCity, toCity);
    };
});

myApp.controller('mainController', ['$scope', 'SORTING_TYPES', 'apiResponse', 'shortestPathFinder', function($scope, SORTING_TYPES, apiResponse, shortestPathFinder) {
    var response = apiResponse.get();
    var dealReferenceMap = getDealReferenceMap(response.deals);

    $scope.deals = response.deals;
    $scope.SORTING_TYPES = SORTING_TYPES;
    $scope.cities = getCities($scope.deals);
    $scope.sortingType = $scope.SORTING_TYPES[0];
    $scope.fromCity;
    $scope.toCity;
    $scope.trips;
    $scope.unitTotals;

    $scope.changeSortingType = function(sortingType) {
        $scope.sortingType = sortingType;
    };

    $scope.submitForm = function() {
        if (!validate($scope.fromCity, $scope.toCity))
            return;

        $scope.trips = shortestPathFinder.find($scope.deals, dealReferenceMap, $scope.sortingType, $scope.fromCity, $scope.toCity);

        $scope.unitTotals = getUnitTotals($scope.trips);
    };

    function validate(fromCity, toCity) {
        var isValid = true;
        var invalidAnimation = 'animated jello';

        if (!fromCity) {
            $('#fromCitySelect')
                .addClass(invalidAnimation)
                .popover({
                    placement: 'left',
                    content: 'Please select from city'
                })
                .popover('show')
                .on('click', function(e) {
                    $(this)
                        .popover('hide')
                        .removeClass(invalidAnimation);
                });

            isValid = false;
        }

        if (!toCity) {
            $('#toCitySelect')
                .addClass(invalidAnimation)
                .popover({
                    placement:'left',
                    content:'Please select to city'
                })
                .popover('show')
                .on('click', function(e) {
                    $(this)
                        .popover('hide')
                        .removeClass(invalidAnimation);
                });

            isValid = false;
        }

        if (fromCity && toCity && fromCity == toCity) {
            $scope.trips = null;
            $('#fromToCityContainer')
                .addClass(invalidAnimation)
                .popover({
                    placement:'left',
                    content:'Please select different from and to cities'
                })
                .popover('show')
                .on('click', function(e) {
                    $(this)
                        .popover('hide')
                        .removeClass(invalidAnimation);
                });

            isValid = false;
        }

        return isValid;
    }

    function getUnitTotals(trips) {
        var unitTotals = {tripsCount:trips.length, cost:0, savings:0, time:{h:0, m:0}, transportCount:{bus:0, car:0, train:0}};
        for (var i in trips) {
            var trip = trips[i];
            unitTotals.cost += trip.cost * (1 - (trip.discount * .01));
            unitTotals.savings += trip.cost * (trip.discount * .01);
            unitTotals.time.h += parseInt(trip.duration.h);
            unitTotals.time.m += parseInt(trip.duration.m);
            unitTotals.transportCount[trip.transport] += 1;
        }

        if (unitTotals.time.m >= 60) {
            var newMinutes = unitTotals.time.m % 60;
            var addHours = parseInt(unitTotals.time.m / 60);
            unitTotals.time.h += addHours;
            unitTotals.time.m = newMinutes;
        }

        if (unitTotals.time.h < 10)
            unitTotals.time.h = '0' + unitTotals.time.h;

        if (unitTotals.time.m < 10)
            unitTotals.time.m = '0' + unitTotals.time.m;

        return unitTotals;
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
