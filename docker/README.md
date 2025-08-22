# Archivist App Docker images

## Description

 We are shipping Archivist App as a Docker image as well.

 [Dockerfile](Dockerfile) is using multi-stage build and we use `alpine` image to speed up the build and to minimize the final Docker image size we are using a lightweight Nginx image.


## Build locally

 We can build image locally in the following way
 1. [Install Docker](https://docs.docker.com/engine/install)

 2. Clone repository
    ```shell
    git clone https://github.com/durability-labs/archivist-app
    cd archivist-app
    ```

 3. Build the image
    ```shell
    # Variables
    VITE_ARCHIVIST_API_URL=<Default Archivist API URL>
    VITE_GEO_IP_URL=<GeoIP API URL>

    # Build
    docker build \
      --build-arg VITE_ARCHIVIST_API_URL=${VITE_ARCHIVIST_API_URL} \
      --build-arg VITE_GEO_IP_URL=${VITE_GEO_IP_URL} \
      --no-cache \
      -f docker/Dockerfile \
      -t archivist-app:local .
    ```


## How to run

 Base [Nginx image](https://hub.docker.com/_/nginx) is [exposing](https://docs.docker.com/reference/dockerfile/#expose) port 80 and we can [publish](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/) it to a custom local port
 ```shell
 docker run \
   --rm \
   --name archivist-app \
   -p 3000:80 \
   durabilitylabs/archivist-app:latest
 ```

 Access UI on http://localhost:3000.

 And we also can set Nginx custom port using `APP_PORT` variable. That is useful when use the `host` network mode for a container
 ```shell
 docker run \
   --rm \
   --name archivist-app \
   --net=host \
   -e 'APP_PORT=3000' \
   durabilitylabs/archivist-app:latest
 ```
