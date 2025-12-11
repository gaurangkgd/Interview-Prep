const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your app password
  },
});

// Send interview reminder email
const sendInterviewReminder = async (userEmail, companyName, role, interviewDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Interview Reminder: ${companyName} - ${role}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Interview Reminder 📅</h2>
        <p>Hi there,</p>
        <p>This is a friendly reminder about your upcoming interview:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
          <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(interviewDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        
        <p><strong>Tips for your interview:</strong></p>
        <ul>
          <li>Review the job description</li>
          <li>Research the company</li>
          <li>Prepare your questions</li>
          <li>Test your tech setup (if virtual)</li>
          <li>Arrive 10-15 minutes early</li>
        </ul>
        
        <p>Good luck! 🍀</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated reminder from Interview Prep Tracker.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};

module.exports = {
  sendInterviewReminder,
  testEmailConnection,
};