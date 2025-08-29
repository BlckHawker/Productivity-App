# Use node verison 22 as our base image
FROM node:22

# Copy the package.json and package-lock.json
COPY package*.json ./

#Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY . .

# Expose database port so our computer acn access it
EXPOSE 3000

# build the application
RUN npm run build

# Run the app
CMD ["npm", "start"]