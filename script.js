// Function to get color based on stability estimate
function getColorForStability(stabilityEstimate) {
    if (stabilityEstimate > 1) return "#1a9850"; // Very Stable (Dark Green)
    if (stabilityEstimate > 0.5) return "#66bd63"; // Stable (Light Green)
    if (stabilityEstimate > 0) return "#a6d96a"; // Moderate (Yellow-Green)
    if (stabilityEstimate > -0.5) return "#fdae61"; // Low Stability (Orange)
    if (stabilityEstimate > -1) return "#f46d43"; // Very Low (Light Red)
    return "#d73027"; // Unstable (Dark Red)
}

// Function to color countries on the map based on stability data
function colorCountries(data) {
    data.forEach(country => {
        const stabilityEstimate = country.StabilityEstimate;
        const color = stabilityEstimate !== undefined ? getColorForStability(stabilityEstimate) : "#cccccc"; // Gray for no data
        // Apply color to the country on the map, assuming each country has an element with id `country-<code>`
        const countryElement = document.getElementById(`country-${country.code}`);
        if (countryElement) {
            countryElement.style.fill = color;
        }
    });
}

// Function to plot or show "Insufficient Data" on the stability graph
function plotStabilityGraph(countryData) {
    const chartContainer = document.getElementById("chartContainer");

    // Clear any previous content
    chartContainer.innerHTML = "";

    // Check if the countryData contains stability data
    if (!countryData || countryData.length === 0) {
        // Display "Insufficient Data" message
        chartContainer.innerText = "Insufficient Data";
        return;
    }

    // Continue with existing graph plotting code if data is available
    const ctx = document.createElement("canvas"); // Assuming you're using a canvas for charting
    chartContainer.appendChild(ctx);
    const stabilityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: countryData.map(entry => entry.year),
            datasets: [{
                label: 'Political Stability',
                data: countryData.map(entry => entry.StabilityEstimate),
                borderColor: "#3e95cd",
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Political Stability Over Time'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: -2,
                        suggestedMax: 2
                    }
                }]
            }
        }
    });
}

// Function to handle clicks on countries
function onCountryClick(countryCode) {
    // Fetch country data based on the countryCode
    const countryData = fetchCountryData(countryCode);

    // Plot the stability graph for this country or show "Insufficient Data"
    plotStabilityGraph(countryData);
}

// Function to fetch data for a specific country
// Replace this with actual data fetching logic, such as querying your CSV data
function fetchCountryData(countryCode) {
    const data = [
        // Example data for testing; replace with actual data retrieval logic
        { code: 'USA', StabilityEstimate: 0.5, year: 2020 },
        { code: 'USA', StabilityEstimate: 0.6, year: 2021 },
        { code: 'USA', StabilityEstimate: 0.4, year: 2022 }
    ];

    // Filter data by country code
    return data.filter(entry => entry.code === countryCode);
}

// Example usage: Assuming `data` is loaded from your CSV file with consolidated data
const data = [
    { code: 'USA', StabilityEstimate: 0.5 },
    { code: 'CAN', StabilityEstimate: 1.2 },
    { code: 'MEX', StabilityEstimate: -0.8 },
    { code: 'RUS', StabilityEstimate: -0.7 } // Example row for Russia
];

// Color countries based on stability
colorCountries(data);

// Add event listeners to countries on the map (replace with your map setup)
document.querySelectorAll(".country").forEach(country => {
    country.addEventListener("click", function() {
        const countryCode = country.id.replace("country-", "");
        onCountryClick(countryCode);
    });
});
