#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const request = require("request-promise");
const { execSync } = require("child_process");

const secrets = require("../src/config/secrets");

const ASSET_DIR = path.resolve(__dirname, "..", "dist", "assets");
const API_URL = `https://${secrets.host}/api/versionable_assets/upload`;

const ASSETS = {
    client: {
        assetId: "resonators-client",
        assetFile: "app.js",
    },
    sw: {
        assetId: "service-worker",
        assetFile: "serviceWorker.js",
    },
    manifest: {
        assetId: "manifest",
        assetFile: "manifest.webmanifest",
    },
};

function getCommitHash() {
    return execSync("git rev-parse --verify HEAD");
}

function getCommitTime() {
    return execSync("git show -s --format=%ci HEAD");
}

function gzipAsset(assetPath) {
    execSync(`gzip -9 ${assetPath} -k -f`);
    return `${assetPath}.gz`;
}

function disableCertificateValidation() {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

function uploadAsset(assetId, assetPath) {
    disableCertificateValidation();
    return request.post(API_URL, {
        formData: {
            asset_id: assetId,
            contentEncoding: "gzip",
            secret: secrets.uploadClientVersionSecret,
            media_data: fs.createReadStream(assetPath),
            tag: `${getCommitHash()} | ${getCommitTime()}`,
        },
    });
}

function assetExists(assetName) {
    return assetName in ASSETS;
}

function processAsset(assetName) {
    console.log(`Processing ${assetName}...`);
    const { assetId, assetFile } = ASSETS[assetName];
    let assetPath = path.resolve(ASSET_DIR, assetFile);
    if (!fs.existsSync(assetPath)) {
        console.error(`Couldn't find ${assetFile} in assets directory`);
        return Promise.resolve();
    }
    console.log(`Gzipping ${assetFile}...`);
    try {
        assetPath = gzipAsset(assetPath);
    } catch (error) {
        console.error(`Gzipping failed: ${error}`);
    }
    console.log(`Uploading ${assetName} (${path.basename(assetPath)})`);
    return uploadAsset(assetId, assetPath)
        .then((body) => console.log(`Successfully uploaded ${assetName}! Link: ${JSON.parse(body).link}`))
        .catch((error) => console.error(`Failed uploading ${assetName}: ${error}`));
}

function main() {
    console.log("Initiating asset upload!");
    const requestedAssets = process.argv.slice(2);
    const assets = requestedAssets.filter(assetExists);
    const ignoredOptions = requestedAssets.filter((asset) => !assetExists(asset));
    if (ignoredOptions.length) {
        console.warn(`Ignoring unknown options ${ignoredOptions.join(", ")}`);
    }
    if (!assets.length) {
        console.log("Nothing to do ¯\\_(ツ)_/¯");
    }
    Promise.all(assets.map(processAsset)).finally(() => console.log("Finished asset upload."));
}

main();
