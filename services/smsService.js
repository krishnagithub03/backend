const axios = require("axios");

const sendSMS = async (phoneNumber, otp) => {
  try {
    const response = await axios.get(
      `https://sms.staticking.com/index.php/smsapi/httpapi/?secret=QG1Fhhenu26NR2ZGBeNl&sender=MGOOD7&tempid=1707173806432209958&receiver=${encodeURIComponent(
        phoneNumber
      )}&route=TA&msgtype=1&sms=Dear User, ${encodeURIComponent(
        otp
      )} is the OTP to verify your mobile number with MGood. Please do not share this OTP with anyone. This OTP is valid for 2 minutes.`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("SMS API Error:", error.response?.data || error.message);
    throw new Error("Failed to send SMS");
  }
};

module.exports = { sendSMS };
