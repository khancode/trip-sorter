/**
 * Created by Omar Khan
 */

function MinPriorityQueue() {
    var queue = [];
    var indexHashmap = []; // a hashmap that maps id -> index in queue

    this.add = function(id, value) {
        queue.push({id:id, value:value});

        var index = queue.length - 1;
        indexHashmap[id] = index;

        sortUpwards(index);
    };

    this.extractMin = function() {
        var root = queue[0];
        indexHashmap[root.id] = undefined;
        var lastElement = queue[queue.length - 1];
        indexHashmap[lastElement.id] = 0;

        queue[0] = lastElement;
        queue.pop();

        var index = 0;
        sortDownwards(index);

        return root.id;
    };

    this.updatePriority = function(id, newValue) {
        var index = indexHashmap[id];

        var originalValue = queue[index].value;

        queue[index].value = newValue;

        if (newValue < originalValue)
            sortUpwards(index);
        else if (newValue > originalValue)
            sortDownwards(index);
    };

    this.isEmpty = function() { return queue.length == 0; };
    this.inQueue = function(id) { return indexHashmap[id] != undefined; };

    /* Recursive function */
    function sortDownwards(index) {
        var leftChildIndex = 2*index + 1;
        var rightChildIndex = 2*index + 2;

        var smallestChildIndex;
        if (!queue[leftChildIndex] && !queue[rightChildIndex]) // Base Case
            return;
        else if (!queue[leftChildIndex])
            smallestChildIndex = rightChildIndex;
        else if (!queue[rightChildIndex])
            smallestChildIndex = leftChildIndex;
        else
            smallestChildIndex = queue[leftChildIndex].value < queue[rightChildIndex].value ? leftChildIndex : rightChildIndex;

        if (queue[smallestChildIndex].value < queue[index].value) {
            // Swap elements
            swap(index, smallestChildIndex);

            sortDownwards(smallestChildIndex);
        }
    }

    /* Recursive function */
    function sortUpwards(index) {
        // Base case
        if (index == 0)
            return;

        var parent = Math.floor((index - 1) / 2);

        if (queue[index].value < queue[parent].value) {
            // Swap elements
            swap(parent, index);

            sortUpwards(parent);
        }
    }

    /* This swaps queue elements i, j and updates their indices in indexHashmap */
    function swap(i, j) {
        // Update indexHashmap
        indexHashmap[queue[i].id] = j;
        indexHashmap[queue[j].id] = i;

        // Swap elements in queue
        var temp = queue[i];
        queue[i] = queue[j];
        queue[j] = temp;
    }
}