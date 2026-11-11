import jwt from "jsonwebtoken";


// If using TypeScript
export const createTokenFromData = (
    data,
    expiresIn,
) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: expiresIn ?? "1d" });
};

export const getTokenData = (token) => {
    try {
        if (!token) return null;
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
        
    }
};
