const swaggerJSDoc =require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Aenoxy Online learning platform",
            version: "1.0.0",
            description: "Backend APIs",
            license: {
                name: "Licensed Under MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "JSONPlaceholder",
                url: "https://jsonplaceholder.typicode.com",
            },
        },
        
        
        servers: [
            {
                url: "https://aenoxy.onrender.com",
                description: "Development server",
            },
        ],
    },
    apis: ["./swagger/*.js"],
};
const specs = swaggerJSDoc(options);
module.exports =specs;
