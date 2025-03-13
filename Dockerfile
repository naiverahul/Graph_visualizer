# Use an OpenJDK 17 base image (adjust if you need a different version)
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from build/libs into the container
# If you have multiple JARs, you can copy a specific one or use *.jar
COPY build/libs/visualizer-0.0.1-SNAPSHOT.jar app.jar

# Expose port 9090 (or whichever port you use by default)
EXPOSE 9090

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
