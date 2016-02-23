App: TripSorter
Author: Omar Khan
email: khancodegt@gmail.com

1. How to run this app:
    - Open index.html in a browser (preferably chrome/firefox) to run this web app.

2. Important things to note:
    - Importing a local json file is restricted by cross browser domain error. Inorder to overcome this problem, one would have to run the web app on a local server by using Node.js or another tool. However, for simplicity sake in running this web app without having to create a local server, I inserted the json file data into a javascript file as 'response-json-wrapper.js' and use this js file to import the json data.
    - I implemented my own version of Dijkstra's algorithm to find the shortest path (depending on sorting type) from one city to another. Also, I implemented a min-priority queue along with it to get the best efficiency out of Dijkstra's algorithm. These files can be found in assets/js folder.
    - The response.json data file had business logic errors in it. The json value "reference" in the API response is defined in the pdf instructions file to be a "deal UNIQUE reference number." From my understanding, being unique means it should only be used once but there are 3 reference values being used more than once. I corrected these errors and put them in a new file 'response-json-wrapper-corrected.js' to be used by the app. Below are the details of these errors and the fixes I made for them.

3. response.json errors:
    - "reference" API response value errors:
        1. reference value BBP0545 is found in two trips.
            - "transport": "bus",
                  "departure": "Brussels",
                  "arrival": "Paris",
            - "transport": "bus",
                  "departure": "Brussels",
                  "arrival": "Prague",

            For correction, I replaced one value with BBP0546 for bus:Brussels->Paris inside response_corrected.json file.


        2. reference value TAB0530 is found in two trips:
            - "transport": "train",
                  "departure": "Athens",
                  "arrival": "Budapest",
            - "transport": "train",
                  "departure": "Amsterdam",
                  "arrival": "Brussels",

            For correction, I replaced one value with TAB0531 for train:Athens->Budapest inside response_corrected.json file.


        3. reference value CGB0500 is found in two trips
            - "transport": "car",
                  "departure": "Geneva",
                  "arrival": "Brussels",
            - "transport": "car",
                  "departure": "Geneva",
                  "arrival": "Budapest",

            For correction, I replaced one value with CGB0501 for car:Geneva->Budapest inside response_corrected.json file.
