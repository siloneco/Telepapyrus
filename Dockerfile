# Install pnpm
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Run pnpm install and build Next.js project
FROM base AS build

WORKDIR /work

COPY package.json package-lock.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm run -r build

# create runner image
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner

WORKDIR /app

# Uncomment this when you have at least one public asset.
# COPY --from=build /app/public ./public

COPY --from=build --chown=65532:65532 /work/.next/standalone ./
COPY --from=build --chown=65532:65532 /work/.next/static ./.next/static

ARG PORT=3000

ENV NODE_ENV production

ENV HOSTNAME "0.0.0.0"
ENV PORT $PORT

EXPOSE $PORT

CMD [ "server.js" ]