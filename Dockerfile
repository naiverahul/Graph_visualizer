# Use whichever JDK version you need
FROM openjdk:17-jdk-alpine

# Copy the JAR from the 'target' folder (Maven) or 'build/libs' folder (Gradle).
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose 8080 in the container
EXPOSE 9090

# Run the jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
