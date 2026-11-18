# Same image for local full-suite runs and CI. The base image includes the Cypress 16.3.0
# binary, Google Chrome and Firefox. Keep the tag in sync with package.json.
FROM cypress/included:16.3.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["node_modules/.bin/cypress", "run"]
CMD ["--browser", "chrome"]
