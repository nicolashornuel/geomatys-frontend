FROM nginx:alpine
COPY ./dist/geomatys-frontend/ /usr/share/nginx/html
EXPOSE 80
#FROM --platform=linux/amd64 image:tag
#linux/amd64, linux/arm64, or darwin/amd64
#docker build . --tag europe-west9-docker.pkg.dev/cloudrun-java/cloud-run-source-deploy/geomatys-frontend:latest --platform=linux/amd64
#docker push europe-west9-docker.pkg.dev/cloudrun-java/cloud-run-source-deploy/geomatys-frontend:latest