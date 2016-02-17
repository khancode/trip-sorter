/**
 * Created by khanc on 2/8/2016.
 */

$shortestPathFinderInjected = new ShortestPathFinder();

function ShortestPathFinder() {

    this.run = function(deals, dealReferenceMap, sortingType, source, dest) {
        // Create adjacency matrix of all vertices (cities)
        var adjacencyMatrix = createAdjacencyMatrix(deals, sortingType);

        // Run Dijkstra's shortest path algorithm
        var dijkstraResult = runDijkstra(adjacencyMatrix, source, dest);

        // Now extract the shortest path from source -> dest
        return extractShortestPath(dijkstraResult, dealReferenceMap, dest);
    };

    function extractShortestPath(dijkstraResult, dealReferenceMap, dest) {
        var trips = [];
        var arrivalCity = dest;
        var departureCity = dijkstraResult.prev[arrivalCity];
        while (departureCity != undefined) {
            console.log('departureCity: ' + departureCity);
            console.log('arrivalCity: ' + arrivalCity);

            trips.push(dealReferenceMap[dijkstraResult.referenceDealMap[departureCity + arrivalCity]]);
            arrivalCity = departureCity;
            departureCity = dijkstraResult.prev[arrivalCity];
        }

        trips.reverse();

        console.log('dat final destination doe');
        console.log(trips);

        return trips;
    }

    function runDijkstra(graph, source, dest) {
        var dist = [];
        var prev = [];
        var referenceDealMap = [];
        var unvisitedQueue = new MinPriorityQueue();

        dist[source] = 0;

        for (var cityVertex in graph) {
            if (cityVertex != source)
                dist[cityVertex] = Infinity;

            prev[cityVertex] = undefined;

            unvisitedQueue.add(cityVertex, dist[cityVertex]);
        }

        while (!unvisitedQueue.isEmpty()) {
            var u = unvisitedQueue.extractMin();

            if (u === dest) // terminate search early if we reach destination vertex
                break;

            // u (from city), v (to city)
            // so this iterates all adjacent trips u -> v
            for (var v in graph[u]) {
                if (!unvisitedQueue.inQueue(v))
                    continue;

                console.log('dat v of u: ' + v + ' of ' + u);

                var alt = dist[u] + graph[u][v].weight;

                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                    referenceDealMap[u+v] = graph[u][v].referenceDeal;

                    unvisitedQueue.updatePriority(v, alt);
                }
            }

            console.log('dat u: ' + u);
        }

        return {dist:dist, prev:prev, referenceDealMap:referenceDealMap};
    }

    function createAdjacencyMatrix(dataList, sortingType) {

        var matrix = []; // this will be a 2D array to store city adjacencies

        for (var i in dataList) {
            var node = dataList[i];

            var from = node.departure;
            var to = node.arrival;
            var transport = node.transport;

            var cost = node.cost * (1 - (node.discount *.01));
            var time = parseInt(node.duration.h + node.duration.m);
            var weight;
            if (sortingType == 'Cheapest')
                weight = cost;
            else if (sortingType == 'Fastest')
                weight = time;
            else
                throw 'Incorrect sortingType value: ' + sortingType;

            var referenceDeal = node.reference;

            //console.log('from: ' + from + ', to: ' + to + ', weight: ' + weight);

            if (!matrix[from])
                matrix[from] = [];

            if (!matrix[from][to] || weight < matrix[from][to].weight)
                matrix[from][to] = {weight:weight, referenceDeal: referenceDeal};
        }

        return matrix;
    }

}