import { expect } from 'chai';

const lambda = require("../../src/<%= lambdaName %>");

describe("Tests <%= lambdaName %>", function () {
    it("verifies successful response", async () => {
        const result = await lambda.handler()

        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an("string");

        let response = JSON.parse(result.body);

        expect(response).to.be.an("object");
        expect(response.message).to.be.equal("hello world");
    });
});
