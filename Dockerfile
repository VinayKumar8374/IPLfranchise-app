FROM node
WORKDIR /IPLfranchise-app
COPY . .
RUN npm install
CMD ["npm", "start"]
