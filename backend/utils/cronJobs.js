const cron = require('node-cron');
const Company = require('../models/Company');
const User = require('../models/User');
const { sendInterviewReminder } = require('./emailService');

// Run every day at 9:00 AM
const scheduleInterviewReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Running interview reminder check...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Find companies with interviews scheduled for tomorrow
      const companiesWithInterviews = await Company.find({
        status: { $regex: /interview/i },
        interviewDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }).populate('userId', 'email username');
      
      console.log(`Found ${companiesWithInterviews.length} interviews tomorrow`);
      
      // Send emails
      for (const company of companiesWithInterviews) {
        if (company.userId && company.userId.email) {
          const dateToUse = company.interviewDate || company.appliedDate;
          await sendInterviewReminder(
            company.userId.email,
            company.companyName,
            company.role,
            dateToUse
          );
          console.log(`✅ Sent reminder to ${company.userId.email} for ${company.companyName}`);
        }
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
  
  console.log('✅ Interview reminder cron job scheduled (9:00 AM daily)');
};

// For testing: Run check immediately
const runReminderCheckNow = async () => {
  console.log('🔔 Running manual reminder check...');
  
  try {
    const companies = await Company.find({
      status: { $regex: /interview/i },
    }).populate('userId', 'email username');
    
    console.log(`Found ${companies.length} companies with interview status`);
    
    for (const company of companies) {
      if (company.userId && company.userId.email) {
        await sendInterviewReminder(
          company.userId.email,
          company.companyName,
          company.role,
          company.appliedDate
        );
        console.log(`✅ Sent test email to ${company.userId.email}`);
      }
    }
  } catch (error) {
    console.error('Manual check error:', error);
  }
};

module.exports = {
  scheduleInterviewReminders,
  runReminderCheckNow,
};