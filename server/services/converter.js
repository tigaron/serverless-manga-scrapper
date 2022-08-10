import createHmac from "create-hmac";
import got from "got";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../configs/s3client";
import logger from "./logger";

const { IMGPROXY_URL, IMGPROXY_KEY, IMGPROXY_SALT, BUCKET_MANGA } = process.env;

export const urlSafeBase64 = (url) => {
	return Buffer.from(url)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

export const hexDecode = (hex) => Buffer.from(hex, "hex");

export const sign = (salt, target, key) => {
	const hmac = createHmac("sha256", hexDecode(key));
	hmac.update(hexDecode(salt));
	hmac.update(target);
	return urlSafeBase64(hmac.digest());
};

export const urlConverter = (
	url,
	api = IMGPROXY_URL,
	salt = IMGPROXY_SALT,
	key = IMGPROXY_KEY
) => {
	const path = `/${urlSafeBase64(url)}`;
	const signature = sign(salt, path, key);
	const result = `${api}/${signature}${path}`;
	return result;
};

export const imgConverter = async (url, bucketName = BUCKET_MANGA) => {
	try {
		const proxyUrl = urlConverter(url);
		const fileName = url.split("/").pop();
		const response = await got(proxyUrl).buffer();
		const params = {
			Bucket: bucketName,
			Key: fileName,
			Body: response
		}
		const data = await s3client.send(new PutObjectCommand(params));
		return data.Location;
	} catch (error) {
		logger.debug(`Upload fail: ${url}`);
		logger.warn(error.message);
	}
}

export const convertService = {
	urlConverter,
	imgConverter,
};
