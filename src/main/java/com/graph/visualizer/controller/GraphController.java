package com.graph.visualizer.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class GraphController {

    // Accept graph data via POST and echo it back
    @PostMapping("/api/graph")
    public GraphData createGraph(@RequestBody GraphData graphData) {
        return graphData;
    }

    // Sample GET endpoint (optional)
    @GetMapping("/api/graph/sample")
    public GraphData getSampleGraph() {
        GraphData sample = new GraphData();
        sample.setVertices(List.of(
                new GraphData.Vertex("A", "Node A"),
                new GraphData.Vertex("B", "Node B"),
                new GraphData.Vertex("C", "Node C")
        ));
        sample.setEdges(List.of(
                new GraphData.Edge("A", "B", 5),
                new GraphData.Edge("B", "C", 3)
        ));
        return sample;
    }

    // Graph data container
    public static class GraphData {
        private List<Vertex> vertices;
        private List<Edge> edges;

        public List<Vertex> getVertices() { return vertices; }
        public void setVertices(List<Vertex> vertices) { this.vertices = vertices; }
        public List<Edge> getEdges() { return edges; }
        public void setEdges(List<Edge> edges) { this.edges = edges; }

        public static class Vertex {
            private String id;
            private String label;

            public Vertex() {}
            public Vertex(String id, String label) {
                this.id = id;
                this.label = label;
            }
            public String getId() { return id; }
            public void setId(String id) { this.id = id; }
            public String getLabel() { return label; }
            public void setLabel(String label) { this.label = label; }
        }

        public static class Edge {
            private String source;
            private String target;
            private double weight;

            public Edge() {}
            public Edge(String source, String target, double weight) {
                this.source = source;
                this.target = target;
                this.weight = weight;
            }
            public String getSource() { return source; }
            public void setSource(String source) { this.source = source; }
            public String getTarget() { return target; }
            public void setTarget(String target) { this.target = target; }
            public double getWeight() { return weight; }
            public void setWeight(double weight) { this.weight = weight; }
        }
    }
}
