FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Client output is gitignored (see .gitignore -> generated/), so it must
# be generated at build time rather than committed.
RUN npx prisma generate

RUN chmod +x docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]
