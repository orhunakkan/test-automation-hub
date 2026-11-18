FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["node_modules/.bin/playwright", "test"]
