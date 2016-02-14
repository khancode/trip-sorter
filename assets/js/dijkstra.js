/**
 * Created by khanc on 2/8/2016.
 */

$dijkstra = new Dijkstra();

function Dijkstra() {

    this.run = function(deals, sortingType, source, dest) {

        // Create adjacency matrix of all vertices (cities)
        var adjacencyMatrix = this.createAdjacencyMatrix(deals, sortingType);

        // Find shortest path
        return this.findShortestPath(adjacencyMatrix, source, dest);
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
    };

    this.createAdjacencyMatrix = function(dataList, sortingType) {

        var matrix = []; // this will be a 3D array to store adjacencies

        for (var i in dataList) {
            var node = dataList[i];

            var from = node.departure;
            var to = node.arrival;
            var transport = node.transport;

            var cost = node.cost * (1 - (node.discount *.01)); // using cost as weight
            var time = parseInt(node.duration.h + node.duration.m); // using cost as weight
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
    };

}