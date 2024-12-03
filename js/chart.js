// Define data arrays for each page
const dataArrays = {
    p1: [
        { axis: "Accuracy", value: 80, description: "ChatGPT achieves a high level of accuracy in natural language understanding and generation tasks. Its accuracy is driven by extensive training on diverse datasets, though it may sometimes provide overly generic or incorrect responses in niche scenarios." },
        { axis: "Speed", value: 90, description: "ChatGPT processes input data and generates output quickly, making it suitable for real-time interactions. Its streamlined architecture ensures low latency during inference." },
        { axis: "Training Data", value: 85, description: "ChatGPT was trained on a massive dataset of books, websites, and conversations, which enables it to provide contextually rich responses. However, the dataset is curated, so it may lack certain domain-specific details." },
        { axis: "Complexity", value: 70, description: "ChatGPT's architecture balances complexity and efficiency, with enough parameters to produce coherent outputs but simplified layers compared to larger models like GPT-4." },
        { axis: "Scalability", value: 75, description: "ChatGPT scales well across various deployment environments, including APIs, embedded systems, and cloud services, but requires substantial computational resources for high-traffic applications." },
        { axis: "Robustness", value: 60, description: "ChatGPT handles many common inputs effectively but may struggle with ambiguous, adversarial, or highly technical queries, reflecting its moderate robustness in handling edge cases." }
    ],
    
    p2: [
        { axis: "Accuracy", value: 85, description: "Gemini excels in fine-tuning tasks and overall accuracy due to its enhanced training dataset." },
        { axis: "Speed", value: 88, description: "Processes input data quickly while maintaining a high response quality." },
        { axis: "Training Data", value: 90, description: "Gemini is trained on a vast and diverse dataset, ensuring broad coverage." },
        { axis: "Complexity", value: 65, description: "Features an optimized architecture with fewer layers for faster inference." },
        { axis: "Scalability", value: 80, description: "Designed to scale well across various deployment environments." },
        { axis: "Robustness", value: 70, description: "Handles noise and edge cases effectively, ensuring reliable outputs." }
    ],

    p3: [
        { axis: "Accuracy", value: 75, description: "Stability AI balances accuracy and creativity for generating artistic content." },
        { axis: "Speed", value: 80, description: "Delivers outputs at an acceptable speed for artistic rendering tasks." },
        { axis: "Training Data", value: 95, description: "Utilizes an extensive dataset of creative works and artistic resources." },
        { axis: "Complexity", value: 85, description: "Complex architecture optimized for artistic and generative use cases." },
        { axis: "Scalability", value: 70, description: "Can scale to creative teams or individuals depending on resources." },
        { axis: "Robustness", value: 75, description: "Performs well in diverse artistic scenarios but may struggle with technical queries." }
    ],

    p4: [
        { axis: "Accuracy", value: 78, description: "Runway AI ensures accuracy in generating creative video and image outputs." },
        { axis: "Speed", value: 85, description: "Provides fast responses suitable for real-time collaboration." },
        { axis: "Training Data", value: 88, description: "Trained on video and image-specific datasets tailored for creators." },
        { axis: "Complexity", value: 75, description: "Features an architecture optimized for video and image generation." },
        { axis: "Scalability", value: 85, description: "Scales seamlessly for individual creators or large teams." },
        { axis: "Robustness", value: 80, description: "Reliable in creative applications but less suitable for general-purpose tasks." }
    ]
};

// Get the current page filename
const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

// Select the appropriate data array
const data = dataArrays[currentPage] || dataArrays.p1; // Default to p1 if no match

// Append the SVG container to the #chart section
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "radar-chart-svg")
    .append("g")
    .attr("id", "radar-chart-group");

// Create a tooltip
const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "10px")
    .style("display", "none")
    .style("font-size", "12pt")
    .style("font-family", "Arial");

// Function to draw the radar chart
function drawChart() {
    // Clear any previous elements in the group
    svg.selectAll("*").remove();

    // Get the shortest side of the window
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    const margin = 65;
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 - margin;

    // Update the SVG size
    d3.select("#radar-chart-svg")
        .attr("width", width)
        .attr("height", height);

    svg.attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Scales and axes
    const angleSlice = (2 * Math.PI) / data.length;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Create grid circles
    const gridLevels = 5;
    const gridStep = 100 / gridLevels;

    for (let i = 0; i <= gridLevels; i++) {
        const level = i * gridStep;
        svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", rScale(level))
            .attr("fill", "none")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 2);
    }

    // Create the axes (spokes)
    svg.selectAll(".axis")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("stroke", "lightgray")
        .attr("stroke-width", 2);

    // Add labels to axes
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d, i) => rScale(110) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(110) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(d => d.axis)
        .style("font-size", "14pt")
        .style("font-family", "Arial");

    // Append first point to close the polygon
    const closedData = [...data, data[0]];

    // Create radar polygon
    const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => angleSlice * i);

    svg.append("path")
        .datum(closedData)
        .attr("d", radarLine)
        .attr("fill", "rgba(0, 123, 255, 0.3)") // Blue fill with transparency
        .attr("stroke", "#0077ff")
        .attr("stroke-width", 5);

    // Add data points with hover interactions
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("r", 10)
        .attr("fill", "#0077ff")
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(
                    `<strong>${d.axis}</strong><br>
                     <span>${d.value}</span><br>
                     <span>${d.description}</span>`
                );
        })
        .on("mousemove", (event) => {
            tooltip.style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
}

// Draw the chart initially
drawChart();

// Add a resize event listener to redraw the chart on window resize
window.addEventListener("resize", drawChart);
