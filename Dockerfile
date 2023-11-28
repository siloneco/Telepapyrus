# Install pnpm
FROM node:21-alpine AS base

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
FROM base AS runner

WORKDIR /app

COPY --from=build /work/node_modules ./node_modules
COPY --from=build /work/package.json ./package.json
COPY --from=build /work/.next ./.next

EXPOSE 3000

CMD ["pnpm", "start"]