FROM public.ecr.aws/lambda/nodejs:14 as build
WORKDIR /build
COPY package-lock.json package.json ./
COPY prisma ./prisma
COPY client.js ./
RUN npm ci
COPY node_modules ./node_modules
COPY . .

FROM public.ecr.aws/lambda/nodejs:14
WORKDIR ${LAMBDA_TASK_ROOT}
COPY package-lock.json package.json ./
COPY prisma ./prisma
COPY node_modules ./node_modules
RUN npm ci --production
# IMPORTANT, must be bundled to asset
COPY --from=build /build/prisma/ /asset/prisma
COPY --from=build /build/node_modules /asset/node_modules
COPY --from=build /build/package.json /asset
COPY --from=build /build/package-lock.json /asset
COPY --from=build /build/client.js /asset
COPY . .

CMD ["client.run"]
