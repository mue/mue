FROM oven/bun:1.1.42

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 5173

CMD ["bun", "run", "dev:host"]