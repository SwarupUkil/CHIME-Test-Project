// const dataURL = "https://chimeclinic.com/front-end-task/front-end-task.json";
const dataURL = "./data.json";
let data, matched;

document.addEventListener('DOMContentLoaded', fetchData);
document.getElementById("search").addEventListener("input", updateQuery);
document.querySelector("svg").addEventListener("click", clear);

async function fetchData() {
    try {
        const response = await fetch(dataURL)

        if (!response.ok) {
            // Handle error.
        }

        data = await response.json()
    } catch (error) {
        console.log("Failure fetching data")
    }
}

// Manage states as user inputs/deletes letters from searchbar.
function updateQuery(event) {
    const searchText = event.target.value;
    const results = document.getElementById("search-results");
    const line = document.getElementById("line");
    line.classList.add("hidden");

    // Delete all children the current "results" children elements.
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }

    // Edge case of string empty.
    if (searchText.length === 0) {
        return;
    }

    matched = getTargets(searchText);

    // Arbitrarily set threshold of results to be at most 10.
    if (matched.length === 0 || matched.length > 10 ){
        return;
    }

    line.classList.remove("hidden");
    for (let i = 0; i < matched.length; i++){
        let newResult = document. createElement("div");
        newResult.textContent = matched[i][1];
        newResult.classList.add("results");
        newResult.index = i;
        newResult.addEventListener("click", printData);
        results.append(newResult);
    }
}

// Attain every object that contains the user inputted text as substring.
function getTargets(text) {
    const matched = [];
    data.forEach((obj) => {
        for (const [key, value] of Object.entries(obj)) {
            let index;
            if (typeof(value) === "string" && (index = value.indexOf(text)) !== -1) {
                matched.push([obj, value, index]);
                break; // Exit the loop after finding the first match.
            }
        }
    });
    return matched;
}

// After user searches and clicks on a suggestion, print to screen the specific information.
function printData(event) {
    const index = event.target.index;
    const resultant = matched[index][0];
    const resultData = document.getElementById("result-data-container");
    clearResultData();

    for (const [key, value] of Object.entries(resultant)) {
        let attr = document.createElement("div");
        attr.textContent = String(key) + " : " + String(value);
        resultData.append(attr);
    }

    document.getElementById("line").classList.add("hidden");
    clearSearchResults();
}

// Clear searchbar, the list of results to choose from,
// and any currently posted result data.
function clear(event){
    document.getElementById("search-bar").value = "";
    clearSearchResults()
    document.getElementById("line").classList.add("hidden");
    clearResultData();
}

// Clear the list of "suggestions" when a user searches.
function clearSearchResults(){
    const resultData = document.getElementById("result-data-container");
    while (resultData.firstChild) {
        resultData.removeChild(resultData.firstChild);
    }
}

// Delete all children the current "results" children elements.
function clearResultData(){
    const resultData = document.getElementById("result-data-container");
    while (resultData.firstChild) {
        resultData.removeChild(resultData.firstChild);
    }
}