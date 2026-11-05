FROM node:22-bookworm AS browser

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx --yes playwright@1.63.0 install --with-deps chromium

FROM node:22-bookworm AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM browser AS runtime

WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./package.json
COPY src/ ./src/
RUN mkdir -p /app/out
CMD ["node", "src/scrape.js"]
