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
    $scope.cities = getCities($scope.deals);
    var dealReferenceMap = getDealReferenceMap($scope.deals);
    $scope.trips;

    $scope.submitForm = function() {

        validate($scope.fromCity, $scope.toCity);

        $scope.trips = findTrips($scope.deals, 'Cheapest', $scope.fromCity, $scope.toCity);
    };

    function validate(fromCity, toCity) {
        //TODO: need to update UI for input validation
        if (!fromCity || !toCity)
            throw 'Please select from and to cities';
    }

    function findTrips(deals, sortingType, source, dest) {
        // Run Dijkstra's shortest path algo
        var shortestPathObj = $dijkstra.run(deals, sortingType, source, dest);

        // Now extract the shortest path from source -> dest
        var trips = [];
        var arrivalCity = dest;
        var departureCity = shortestPathObj.prev[arrivalCity];
        while (departureCity != undefined) {
            console.log('departureCity: ' + departureCity);
            console.log('arrivalCity: ' + arrivalCity);

            trips.push(dealReferenceMap[shortestPathObj.referenceDealMap[departureCity + arrivalCity]]);
            arrivalCity = departureCity;
            departureCity = shortestPathObj.prev[arrivalCity];
        }

        trips.reverse();

        console.log('dat final destination doe');
        console.log(trips);

        return trips;
    }

    function getCities(deals) {
        var citiesHashmap = {};
        var cities = [];
        for (var i in deals) {
            var deal = deals[i];

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

    function getDealReferenceMap(deals) {
        var dealsMap = [];
        for (var i in deals) {
            dealsMap[deals[i].reference] = deals[i];
        }

        return dealsMap;
    }

}]);
