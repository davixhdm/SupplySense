import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

const generateDeviceToken = (deviceId, userId) => {
  return jwt.sign({ deviceId, userId }, env.JWT_SECRET, { expiresIn: '30d' });
};

const generateAdminToken = (adminId, role) => {
  return jwt.sign({ id: adminId, role, isAdmin: true }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const generateClientToken = (clientId, orgId, role) => {
  return jwt.sign({ id: clientId, orgId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export {
  generateToken,
  verifyToken,
  generateDeviceToken,
  generateAdminToken,
  generateClientToken
};