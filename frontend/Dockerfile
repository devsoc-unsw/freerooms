# Grab the Node base image
FROM node:16-bullseye

# Set the current working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install node modules inside the container using the copied package.json
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose the port to the outside world
EXPOSE 8080

# Run the server
CMD ["npm", "run", "serve"]