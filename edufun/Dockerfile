# EduFun — image de production (construction Maven puis exécution Java 21)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package && cp target/edufun-portal-*.jar /src/app.jar

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --create-home edufun && mkdir -p /app/data && chown edufun /app/data
COPY --from=build /src/app.jar /app/app.jar
USER edufun
ENV EDUFUN_DB_PATH=/app/data/edufun \
    JAVA_OPTS="-Xmx384m -XX:+UseSerialGC"
EXPOSE 8082
CMD ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
