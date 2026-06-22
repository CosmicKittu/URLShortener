import Url from "../model/url.js";
import generateShortCode from "../utils/generateShortCode.js";
import { redisClient } from "../config/redis.js";
export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, withUsername = false } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
    }

    const shortCode = customAlias || generateShortCode();
    const isCustom = Boolean(customAlias);

    const existingUrl = await Url.findOne({ shortCode });

    if (existingUrl) {
      return res.status(409).json({
        success: false,
        message: "Short code already exists",
      });
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      isCustom,
      withUsername,
      createdBy: req.user.userID,
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const shortUrl = withUsername
      ? `${baseUrl}/username/${shortCode}`
      : `${baseUrl}/${shortCode}`;

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl,
        isCustom: url.isCustom,
        withUsername: url.withUsername,
        createdBy: url.createdBy,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create short URL",
      error: error.message,
    });
  }
};


export const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const cachedUrl = await redisClient.get(`url:${shortCode}`);


    if (cachedUrl) {

      console.log(`from redis ${cachedUrl}`)
      return res.redirect(cachedUrl);
    }
    const now1 = new Date();


    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }
    await redisClient.setEx(`url:${shortCode}`, 3600, url.originalUrl);

    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Short URL has expired",
      });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to redirect URL",
      error: error.message,
    });
  }
};


export const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        isCustom: url.isCustom,
        withUsername: url.withUsername,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get URL stats",
      error: error.message,
    });
  }
};



export const getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.user.userID }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user URLs",
      error: error.message,
    });
  }
};