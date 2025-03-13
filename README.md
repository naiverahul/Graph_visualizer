# Graph Visualizer (Java)

This is a Spring Boot web application that provides an interactive graph visualizer. It supports both edge input and adjacency list input modes (with support for weighted/unweighted graphs), a directed/undirected toggle, and a dark mode option. The UI includes fixed footer links to GitHub and LinkedIn.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App from Terminal](#running-the-app-from-terminal)
- [Running the App with IntelliJ IDEA](#running-the-app-with-intellij-idea)
- [Deployment](#deployment)
- [License](#license)

## Features

- Input graph data via edge inputs or adjacency list format.
- Supports weighted and unweighted graphs (default weight is 1).
- Option to toggle between directed and undirected graph visualizations.
- Dark mode with custom styling (nodes become sky blue, labels adjust accordingly).
- Responsive layout with a fixed footer showing GitHub and LinkedIn links.

## Prerequisites

- Java JDK 11 (or later)
- Maven (or Gradle, if preferred)  
- Git
- IntelliJ IDEA (or your favorite Java IDE)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/naiverahul/Graph_visualizer
   cd Graph_visualizer
   ```

2. **Build the application:**

   Using IntelliJ IDEA:
   - Open the project in IntelliJ IDEA.
   - Build the project using Maven or Gradle.
   - Run the application and open the following link in your browser:
     
     ```
     http://localhost:9090
     ```

   Using Maven:
   
   ```bash
   mvn clean package
   ```

   This will compile the code and package the application as a JAR file (e.g., in the `target/` directory).

## Running the App from Terminal

After building the application, you can start it from the terminal.

1. **Using Maven Spring Boot plugin:**

   ```bash
   mvn spring-boot:run
   ```

2. **Using the packaged JAR:**

   ```bash
   java -jar target/Graph_visualizer.jar
   ```

3. **Access the application:**

   Open your browser and navigate to:

   ```
   http://localhost:9090
   ```

## Running the App with IntelliJ IDEA

1. **Import the project:**
   - Open IntelliJ IDEA.
   - Click on **File > Open...** and select the project’s root directory.
   - IntelliJ will detect the Maven (or Gradle) configuration and import the project.

2. **Locate the main class:**
   - In the Project Explorer, find the main application class (e.g., `GraphVisualizerApplication.java` in the package `com.example.graphvisualizer`).

3. **Run the application:**
   - Right-click the main class and select **Run 'GraphVisualizerApplication'**.
   - The application console will display startup logs indicating that the Spring Boot app is running.

4. **Access the application:**

   Open your browser and go to:

   ```
   http://localhost:9090
   ```

## Deployment

This application can be deployed to various platforms. For free hosting of a dynamic Java app, consider the following options:

- **Render**: Deploy your Spring Boot app using their free web service tier.
- **Railway**: Offers free deployments for containerized applications.
- **Fly.io**: Provides a free tier for running containerized applications.

You can containerize your application with a Dockerfile if needed. See the [official Spring Boot documentation](https://spring.io/guides/gs/spring-boot-docker/) for guidance on containerization.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

