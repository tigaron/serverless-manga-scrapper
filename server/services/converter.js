import got from "got";
import createHmac from "create-hmac";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../configs";
import logger from "./logger";

const { IMGPROXY_URL, IMGPROXY_KEY, IMGPROXY_SALT, BUCKET_MANGA, REGION } =
	process.env;

const urlSafeBase64 = (url) => {
	return Buffer.from(url)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

const hexDecode = (hex) => Buffer.from(hex, "hex");

const sign = (salt, target, key) => {
	const hmac = createHmac("sha256", hexDecode(key));
	hmac.update(hexDecode(salt));
	hmac.update(target);
	return urlSafeBase64(hmac.digest());
};

const urlConverter = (
	url,
	api = IMGPROXY_URL,
	salt = IMGPROXY_SALT,
	key = IMGPROXY_KEY
) => {
	const path = `/${urlSafeBase64(url)}`;
	const signature = sign(salt, path, key);
	return `${api}/${signature}${path}`;
};

const imgConverter = async (
	source,
	slug,
	parent,
	url,
	bucketName = BUCKET_MANGA,
	region = REGION
) => {
	try {
		const proxyUrl = urlConverter(url);
		const fileName = `${source}/${parent}/${slug}/` + url.split("/").pop();
		const response = await got(proxyUrl).buffer();
		const params = {
			Bucket: bucketName,
			Key: fileName,
			Body: response,
		};
		const { $metadata } = await s3client.send(new PutObjectCommand(params));
		if ($metadata.httpStatusCode !== 200)
			throw new Error(`Unable to convert ${url}`);
		return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(fileName)}`;
	} catch (error) {
		logger.debug(`Upload fail: ${url}`);
		logger.debug(error.message);
	}
};

export default imgConverter;
