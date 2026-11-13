import "dotenv/config";
import chokidar from 'chokidar';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { HeadBucketCommand } from "@aws-sdk/client-s3";

async function verifyCredentials() {
    console.log("Verifying AWS credentials...");

    // 1. Are the keys themselves valid? (STS needs no IAM permissions)
    try {
        const sts = new STSClient({
            region: process.env.AWS_REGION,
            credentials: s3Client.config.credentials
        });
        const identity = await sts.send(new GetCallerIdentityCommand({}));
        console.log(`✔ Credentials valid. Identity: ${identity.Arn} (account ${identity.Account})`);
    } catch (err) {
        console.error(`✘ Credentials are INVALID (${err.name}): ${err.message}`);
        console.error("  Check for typos, extra spaces/quotes in the values, deactivated keys, or expired temporary keys.");
        return false;
    }

    // 2. Does the bucket exist, and is the region right?
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        console.log(`✔ Bucket "${bucketName}" is reachable.`);
    } catch (err) {
        const status = err.$metadata?.httpStatusCode;
        if (status === 404) console.error(`✘ Bucket "${bucketName}" does not exist.`);
        else if (status === 301) console.error(`✘ Wrong region. Bucket is in: ${err.$response?.headers?.["x-amz-bucket-region"]}`);
        else if (status === 403) console.error(`✘ Bucket access denied (403). Keys are valid, but this identity lacks s3:ListBucket on the bucket.`);
        else console.error(`✘ HeadBucket failed (${err.name}): ${err.message}`);
        return false;
    }

    // 3. Can it list under the project prefix specifically?
    try {
        await s3Client.send(new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: `${projectId}/`,
            MaxKeys: 1
        }));
        console.log(`✔ Can list s3://${bucketName}/${projectId}/`);
    } catch (err) {
        console.error(`✘ Cannot list prefix "${projectId}/" (${err.name}). Likely a missing s3:ListBucket permission or a prefix condition in the policy.`);
        return false;
    }

    return true;
}
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const projectId = process.env.PROJECT_ID;
const bucketName = process.env.AWS_BUCKET_NAME;
const localDirectory = '/workspace';

const requiredEnv = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "PROJECT_ID"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

async function checkS3ForFiles() {
    console.log(`Checking S3 for existing files in project: ${projectId}`);
    const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${projectId}/`
    });
    const listResponse = await s3Client.send(listCommand);
    return listResponse.Contents || [];
}

async function downloadFilesFromS3(s3Objects) {
    console.log("Found existing files in S3. Syncing to local directory...");
    for (const file of s3Objects) {
        // Skip if it is a directory placeholder
        if (file.Key.endsWith('/')) continue;

        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: file.Key
        });
        const getResponse = await s3Client.send(getCommand);

        const relativePath = file.Key.replace(`${projectId}/`, '');
        const localFilePath = path.join(localDirectory, relativePath);

        // Ensure the local directory structure exists
        fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

        const writeStream = fs.createWriteStream(localFilePath);
        getResponse.Body.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log(`Downloaded ${file.Key} to ${localFilePath}`);
    }
}

async function uploadFileToS3(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const relativePath = path.relative(localDirectory, filePath);

        if (filePath.includes('node_modules') || filePath.includes('.env')) {
            return; // Skip syncing node_modules and .env files
        }

        console.log(filePath)
        // Files will have the prefix of projectId
        const s3Key = `${projectId}/${relativePath}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: fileContent
        });

        await s3Client.send(command);
        console.log(`Successfully synced ${filePath} to s3://${bucketName}/${s3Key}`);
    } catch (err) {
        console.error(`Error syncing ${filePath} to S3:`, err);
    }
}

function startWatcher(hasFiles) {
    console.log("Starting chokidar watch...");
    chokidar.watch(localDirectory, {
        ignored: [
            /(^|[\/\\])\../, // ignore dotfiles
            /node_modules/,  // ignore node_modules completely
            /\.env/          // ignore .env files
        ],
        persistent: true,
        ignoreInitial: hasFiles // if S3 is empty (hasFiles is false), upload all existing local files
    }).on('all', async (event, filePath) => {
        if (event === 'add' || event === 'change') {
            if (filePath.includes('node_modules') || filePath.includes('.env')) {
                return; // Skip syncing node_modules and .env files
            }
            await uploadFileToS3(filePath);
        }
    });
}

async function init() {
    try {
        const s3Objects = await checkS3ForFiles();
        const hasFiles = s3Objects.length > 0;

        if (hasFiles) {
            await downloadFilesFromS3(s3Objects);
        } else {
            console.log("No files found in S3. Local files will be synced to S3 automatically.");
        }

        startWatcher(hasFiles);
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}
await verifyCredentials()
init();