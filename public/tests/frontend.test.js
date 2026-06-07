const fs = require("fs");

describe("Portfolio Pages", () => {

    test("index.html exists", () => {
        expect(fs.existsSync("index.html")).toBe(true);
    });

    test("Contact page exists", () => {
        expect(fs.existsSync("Contact/contactpg.html")).toBe(true);
    });

    test("Projects page exists", () => {
        expect(fs.existsSync("Projects_/projectspg.html")).toBe(true);
    });

});