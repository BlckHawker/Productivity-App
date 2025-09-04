# Use node version 22 as our base image
FROM node:22

WORKDIR /backend

# Copy the package.json package-lock.json (if available)
COPY package*.json ./

#Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY . .

# Expose database port so our computer can access it
EXPOSE 3000

# build the application
RUN npm run build

# Run the app
# Run expand-env at container startup, then start app
CMD ["sh", "-c", "npm run expand-env && npm start"]