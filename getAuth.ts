import fs from "fs";

interface AuthData {
    prodToken: string;
    stagingToken: string;
    prefix: string;
}

export const {
    prodToken = process.env.PROD_TOKEN || "",
    stagingToken = process.env.STAGING_TOKEN || "",
    prefix = process.env.PREFIX || "",
}: AuthData = JSON.parse(fs.readFileSync("./auth.json", { encoding: "UTF8" }));
