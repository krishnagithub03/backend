const { google } = require("googleapis");

let authClient = null;
let sheetsClient = null;

const validateMobileNumber = (phoneNumber) => /^[6-9]\d{9}$/.test(String(phoneNumber));
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));

const validateDate = (date) => {
  const dateStr = String(date);
  return /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})$/.test(dateStr);
};


async function getSheetClient() {
  if (sheetsClient) {
    return sheetsClient;
  }
  
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!privateKey) {
      throw new Error("Google Private Key is missing in environment variables");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    authClient = await auth.getClient();
    sheetsClient = google.sheets({ version: "v4", auth: authClient });
    return sheetsClient;
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error);
    authClient = null;
    sheetsClient = null;
    throw error;
  }
}

exports.submitIndividualRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      serviceType,
      requestDetails,
      preferredContactMethod,
      urgencyLevel,
      medicalHistory,
      requestType
    } = req.body;

    if (!fullName || !email || !phoneNumber || !serviceType || !requestDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fullName, email, phoneNumber, serviceType, requestDetails"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!validateMobileNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be a 10-digit Indian mobile number"
      });
    }

    if (dateOfBirth && !validateDate(dateOfBirth)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use dd/mm/yyyy, dd-mm-yyyy, or dd/mm/yy"
      });
    }

    const validServiceTypes = [
      'general_consultation',
      'specialist_referral',
      'emergency_support',
      'health_screening',
      'mental_health',
      'chronic_care',
      'preventive_care',
      'telemedicine'
    ];
    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type"
      });
    }

    if (gender) {
      const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender value"
        });
      }
    }

    if (preferredContactMethod) {
      const validContactMethods = ['phone', 'email', 'sms', 'whatsapp'];
      if (!validContactMethods.includes(preferredContactMethod)) {
        return res.status(400).json({
          success: false,
          message: "Invalid preferred contact method"
        });
      }
    }

    if (urgencyLevel) {
      const validUrgencyLevels = ['low', 'medium', 'high', 'emergency'];
      if (!validUrgencyLevels.includes(urgencyLevel)) {
        return res.status(400).json({
          success: false,
          message: "Invalid urgency level"
        });
      }
    }

    const submissionDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const values = [[
      submissionDate,                    
      fullName,                          
      email,                         
      phoneNumber,                    
      dateOfBirth || 'Not Provided',   
      gender || 'Not Provided',       
      serviceType,                    
      requestDetails,                    
      preferredContactMethod || 'Not Provided',
      urgencyLevel || 'Not Specified', 
      medicalHistory || 'None',          
      requestType || 'individual'     
    ]];

    const range = "IndividualRequests!A:L";

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheet ID is missing in environment variables");
    }

    try {
      const sheets = await getSheetClient();
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: { values },
      });

      return res.status(200).json({
        success: true,
        message: "Individual service request submitted successfully"
      });

    } catch (googleError) {
      console.error("Google Sheets API Error:", googleError);

      if (googleError.message?.includes("invalid_grant") || googleError.message?.includes("Request is missing required authentication credential")) {
        authClient = null;
        sheetsClient = null;
        return res.status(401).json({
          success: false,
          message: "Authentication error. Please contact support."
        });
      }
      
      if (googleError.message?.includes("permission")) {
        return res.status(403).json({
          success: false,
          message: "Permission denied. Contact support."
        });
      }

      throw googleError;
    }

  } catch (error) {
    console.error("Error submitting individual request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit request. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.submitCorporateRequest = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phoneNumber,
      employeeCount,
      industry
    } = req.body;
    console.log(req.body);

    if (!companyName || !contactPerson || !email || !phoneNumber || !employeeCount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: companyName, contactPerson, email, phoneNumber, employeeCount"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!validateMobileNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be a 10-digit Indian mobile number"
      });
    }

    const validEmployeeCounts = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
    if (!validEmployeeCounts.includes(employeeCount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee count. Must be one of: '1-50', '51-200', '201-500', '501-1000', '1000+'"
      });
    }

    const submissionDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const values = [[
      submissionDate,                    
      companyName,                    
      contactPerson,                    
      email,                   
      phoneNumber,      
      employeeCount,                    
      industry || 'Not Provided'  
    ]];

    const range = "CorporateRequests!A:G";

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheet ID is missing in environment variables");
    }

    try {
      const sheets = await getSheetClient();
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: { values },
      });

      return res.status(200).json({
        success: true,
        message: "Corporate request submitted successfully"
      });

    } catch (googleError) {
      console.error("Google Sheets API Error:", googleError);
      
      if (googleError.message?.includes("invalid_grant") || googleError.message?.includes("Request is missing required authentication credential")) {
        authClient = null;
        sheetsClient = null;
        return res.status(401).json({
          success: false,
          message: "Authentication error. Please contact support."
        });
      }
      
      if (googleError.message?.includes("permission")) {
        return res.status(403).json({
          success: false,
          message: "Permission denied. Contact support."
        });
      }

      throw googleError;
    }

  } catch (error) {
    console.error("Error submitting corporate request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit request. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
