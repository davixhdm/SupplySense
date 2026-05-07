import SibApiV3Sdk from 'sib-api-v3-sdk';
import env from './env.js';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const smsApi = new SibApiV3Sdk.TransactionalSMSApi();

const brevoConfig = {
  sender: {
    email: env.BREVO_SENDER_EMAIL,
    name: env.BREVO_SENDER_NAME
  }
};

export { emailApi, smsApi, brevoConfig };