/**
 * Created by khanc on 2/8/2016.
 */

$dijkstra = new Dijkstra();

// TODO: change this to use whatever the user selects
var CHEAPEST = true;

function Dijkstra() {

    this.run = function(deals, source, dest) {

        var adjacencyMatrix = this.createAdjacencyMatrix(deals);

        // Find shortest path
        return $dijkstra.findShortestPath(adjacencyMatrix, source, dest);
    };

    this.findShortestPath = function(graph, source, dest) {
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

                var minTransport = findMinTransportType(graph[u][v]);
                console.log('we da best: ');
                console.log(minTransport);

                var alt = dist[u] + minTransport.length;

                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                    referenceDealMap[u+v] = graph[u][v][minTransport.transport].referenceDeal;

                    unvisitedQueue.updatePriority(v, alt);
                }

            }

            console.log('dat u: ' + u);
        }

        return {dist:dist, prev:prev, referenceDealMap:referenceDealMap};
    };

    function findMinTransportType(trip) {
        var minTransportType;
        var minLength = Infinity;

        for (var transport in trip) {
            console.log('dat transport: ' + transport);

            var e = trip[transport];

            var length;
            if (CHEAPEST)
                length = e.lengthCost;
            else
                length = e.lengthTime;

            if (length < minLength) {
                minTransportType = transport;
                minLength = length;
            }
        }

        return {transport:minTransportType, length:minLength};
    }

    this.createAdjacencyMatrix = function(dataList) {

        var matrix = []; // this will be a 3D array to store adjacencies

        for (var i in dataList) {
            var node = dataList[i];

            var from = node.departure;
            //var to = node.arrival + '|' + node.transport;
            var to = node.arrival;
            var transport = node.transport;
            var lengthCost = node.cost * (1 - (node.discount *.01)); // using cost as weight
            var lengthTime = parseInt(node.duration.h + node.duration.m); // using cost as weight
            var referenceDeal = node.reference;

            //console.log('from: ' + from + ', to: ' + to + ', weight: ' + weight);

            if (!matrix[from])
                matrix[from] = [];

            if (!matrix[from][to])
                matrix[from][to] = [];

            matrix[from][to][transport] = {lengthCost:lengthCost, lengthTime:lengthTime, referenceDeal:referenceDeal};
        }

        return matrix;
    };

}