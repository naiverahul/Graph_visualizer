document.addEventListener("DOMContentLoaded", function() {
    const width = 800;
    const height = 600;

    // --- Dark mode toggle ---
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    darkModeToggle.addEventListener("change", function() {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    // --- Input Mode Toggle ---
    const edgeInputContainer = document.getElementById("graph-input");
    const adjacencyInputContainer = document.getElementById("adjacency-input");

    const inputModeRadios = document.querySelectorAll('input[name="inputMode"]');
    inputModeRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            if (this.value === "edge") {
                edgeInputContainer.style.display = "block";
                adjacencyInputContainer.style.display = "none";
            } else {
                edgeInputContainer.style.display = "none";
                adjacencyInputContainer.style.display = "block";
            }
        });
    });

    // --- Edge Input Mode Data Arrays ---
    const vertices = [];
    const edges = [];

    // Vertex input management (Edge Input Mode)
    const addVertexBtn = document.getElementById("add-vertex");
    const vertexIdInput = document.getElementById("vertex-id");
    const vertexLabelInput = document.getElementById("vertex-label");
    const vertexList = document.getElementById("vertex-list");

    addVertexBtn.addEventListener("click", function() {
        const id = vertexIdInput.value.trim();
        const label = vertexLabelInput.value.trim();
        if (id && label) {
            if (!vertices.find(v => v.id === id)) {
                vertices.push({ id: id, label: label });
                const li = document.createElement("li");
                li.textContent = `ID: ${id}, Label: ${label}`;
                vertexList.appendChild(li);
            }
            vertexIdInput.value = "";
            vertexLabelInput.value = "";
        }
    });

    // Edge input management (Edge Input Mode)
    const addEdgeBtn = document.getElementById("add-edge");
    const edgeSourceInput = document.getElementById("edge-source");
    const edgeTargetInput = document.getElementById("edge-target");
    const edgeWeightInput = document.getElementById("edge-weight");
    const edgeList = document.getElementById("edge-list");

    addEdgeBtn.addEventListener("click", function() {
        const source = edgeSourceInput.value.trim();
        const target = edgeTargetInput.value.trim();
        const weight = parseFloat(edgeWeightInput.value) || 1;
        if (source && target) {
            edges.push({ source: source, target: target, weight: weight });
            const li = document.createElement("li");
            li.textContent = `Source: ${source}, Target: ${target}, Weight: ${weight}`;
            edgeList.appendChild(li);
            edgeSourceInput.value = "";
            edgeTargetInput.value = "";
            edgeWeightInput.value = "";
        }
    });

    // --- Visualize Graph ---
    const visualizeBtn = document.getElementById("visualize-graph");
    visualizeBtn.addEventListener("click", function() {
        const graphType = document.querySelector('input[name="graphType"]:checked').value;
        const inputMode = document.querySelector('input[name="inputMode"]:checked').value;

        let graphData = { vertices: [], edges: [], graphType: graphType };

        if (inputMode === "edge") {
            // Use data from Edge Input Mode
            graphData.vertices = vertices;
            graphData.edges = edges;
        } else {
            // Process Adjacency List Input
            // Expected unweighted format example:
            // 0: [1, 2, 3, 4, 5],
            // 1: [0, 2, 4, 6],
            // 2: [0, 1, 3, 5, 7],
            // ... or weighted using tuple format: 0: [(1, 2), 3, 4]
            const adjacencyText = document.getElementById("adjacency-text").value.trim();
            const adjVertices = [];
            const adjEdges = [];

            const lines = adjacencyText.split("\n");
            lines.forEach(line => {
                line = line.trim();
                if (!line) return;
                if (line.endsWith(",")) line = line.slice(0, -1);
                const colonIndex = line.indexOf(":");
                if (colonIndex === -1) return;
                const vertexId = line.slice(0, colonIndex).trim();
                if (!adjVertices.find(v => v.id === vertexId)) {
                    adjVertices.push({ id: vertexId, label: vertexId });
                }
                let neighborsPart = line.slice(colonIndex + 1).trim();
                if (neighborsPart.startsWith("[") && neighborsPart.endsWith("]")) {
                    neighborsPart = neighborsPart.slice(1, -1).trim();
                }
                const neighbors = neighborsPart.split(",");
                neighbors.forEach(nbr => {
                    nbr = nbr.trim();
                    if (!nbr) return;
                    // Check if the neighbor is in tuple format e.g., "(1, 2)"
                    if (nbr.startsWith("(") && nbr.endsWith(")")) {
                        let content = nbr.slice(1, -1).trim();
                        let parts = content.split(",");
                        if (parts.length >= 2) {
                            let neighborId = parts[0].trim();
                            let weight = parseFloat(parts[1].trim()) || 1;
                            if (!adjVertices.find(v => v.id === neighborId)) {
                                adjVertices.push({ id: neighborId, label: neighborId });
                            }
                            adjEdges.push({ source: vertexId, target: neighborId, weight: weight });
                        }
                    } else {
                        // If neighbor is a bare number, default weight is 1
                        let neighborId = nbr;
                        if (!adjVertices.find(v => v.id === neighborId)) {
                            adjVertices.push({ id: neighborId, label: neighborId });
                        }
                        adjEdges.push({ source: vertexId, target: neighborId, weight: 1 });
                    }
                });
            });

            graphData.vertices = adjVertices;
            graphData.edges = adjEdges;
        }

        // Send graph data to backend
        fetch("/api/graph", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(graphData)
        })
            .then(response => response.json())
            .then(data => {
                renderGraph(data, graphType);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    // --- Graph Rendering Function (using D3.js) ---
    function renderGraph(data, graphType) {
        d3.select("#graph").select("svg").remove();

        const svg = d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // If directed, add arrow marker definition
        if (graphType === "directed") {
            svg.append("defs").append("marker")
                .attr("id", "arrowhead")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#999");
        }

        const nodes = data.vertices;
        const links = data.edges;

        // Custom gravity effect: Adjust node target Y based on extra weight from connected edges
        nodes.forEach(node => {
            let extra = 0;
            links.forEach(link => {
                if (node.id === link.source || node.id === link.target) {
                    extra += (link.weight - 1);
                }
            });
            node.targetY = height / 2 + extra * 20;
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(d => d.targetY).strength(0.1));

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#999")
            .attr("marker-end", d => graphType === "directed" ? "url(#arrowhead)" : "");

        const edgeLabels = svg.append("g")
            .attr("class", "edge-labels")
            .selectAll("text")
            .data(links)
            .enter().append("text")
            .attr("font-size", "12px")
            .attr("fill", "#555")
            .text(d => d.weight);

        const nodeElems = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 15)
            .attr("fill", "#69b3a2")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const nodeLabels = svg.append("g")
            .attr("class", "node-labels")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .text(d => d.label)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#000");

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            edgeLabels.attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2);

            nodeElems.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            nodeLabels.attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
});
