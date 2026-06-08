const fs = require("fs");

describe("Portfolio Pages", () => {

    test("index.html exists", () => {
        expect(fs.existsSync("public/index.html")).toBe(true);
    });

    test("Contact page exists", () => {
        expect(fs.existsSync("public/Contact/contactpg.html")).toBe(true);
    });

    test("Projects page exists", () => {
        expect(fs.existsSync("public/Projects_/projectspg.html")).toBe(true);
    });

    test("Blogs page exists", () => {
        expect(fs.existsSync("public/Blogpg/blogpg.html")).toBe(true);
    });

    test("Journey page exists", () => {
        expect(fs.existsSync("public/Journey/journeypg.html")).toBe(true);
    });

});