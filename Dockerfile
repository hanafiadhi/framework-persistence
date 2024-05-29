# Stage 1: Development
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ./user-per/package.json ./user-per/package-lock.json ./
COPY ./user-per/tsconfig.json ./user-per/tsconfig.build.json ./user-per/nest-cli.json ./
RUN npm install

# Copy all source files
COPY ./user-per .

# Build the application
RUN npm run build

# Stage 2: Production
# FROM node:20-alpine AS production

# WORKDIR /usr/src/app

# # Copy package files and install only production dependencies
# COPY ./user-per/package.json ./user-per/package-lock.json ./
# RUN npm install --prod7

# # Copy the built files from the development stage
# COPY --from=development /usr/src/app/dist ./dist

# # Set the command to run the application
# CMD ["node", "dist/main"]
