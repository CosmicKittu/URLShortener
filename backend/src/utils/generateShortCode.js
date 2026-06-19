const generateShortCode = (length = 6) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let shortCode = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }

  return shortCode;
};

export default generateShortCode;