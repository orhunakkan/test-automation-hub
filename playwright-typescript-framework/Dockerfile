# Same image for local full-suite runs and CI. Browsers come with the base image,
# matched to @playwright/test 1.65.1. Keep the tag in sync with package.json.
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["node_modules/.bin/playwright", "test"]
