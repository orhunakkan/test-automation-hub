FROM cypress/included:16.3.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["node_modules/.bin/cypress", "run"]
CMD ["--browser", "chrome"]
