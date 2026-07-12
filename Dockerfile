FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/hostel-booking-platform-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8822

CMD ["java", "-jar", "app.jar"]
