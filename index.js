const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(morgan("common"));

var movies = require("./routes/movies");
var users = require("./routes/users");

app.use("/movies", movies);
app.use("/users", users);

const options = {
      definition: {
            openapi: "3.0.0",
            info: {
                  title: "Express API with Swagger",
                  version: "1.0.0",
                  description: "This is a simpe crud API aplication made with express and documented with swagger",
            },
            server: [
                  {
                        url: "http://localhost:3000",
                  },
            ],
      },
      apis: ["./routes/*"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
      console.log("Server is running on port 3000");
});
