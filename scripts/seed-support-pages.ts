import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supportPages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `
      <h2>Privacy Policy for StreamPlay Binge</h2>
      <p><strong>Last Updated: January 2025</strong></p>
      
      <h3>1. Information We Collect</h3>
      <p>At StreamPlay Binge, we take your privacy seriously. We collect the following types of information:</p>
      <ul>
        <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
        <li><strong>Usage Data:</strong> Information about how you use our service, including watch history and preferences</li>
        <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system</li>
        <li><strong>Payment Information:</strong> Billing details processed securely through our payment partners</li>
      </ul>
      
      <h3>2. How We Use Your Information</h3>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and improve our streaming services</li>
        <li>Personalize your content recommendations</li>
        <li>Process payments and manage subscriptions</li>
        <li>Send service updates and promotional communications (with your consent)</li>
        <li>Ensure platform security and prevent fraud</li>
      </ul>
      
      <h3>3. Information Sharing</h3>
      <p>We do not sell your personal information. We may share your data with:</p>
      <ul>
        <li>Service providers who help us operate our platform</li>
        <li>Payment processors for billing purposes</li>
        <li>Law enforcement when required by law</li>
      </ul>
      
      <h3>4. Data Security</h3>
      <p>We implement industry-standard security measures including:</p>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Regular security audits and updates</li>
        <li>Limited access to personal information by employees</li>
        <li>Secure data centers with 24/7 monitoring</li>
      </ul>
      
      <h3>5. Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Delete your account and associated data</li>
        <li>Opt-out of marketing communications</li>
        <li>Download your data in a portable format</li>
      </ul>
      
      <h3>6. Cookies and Tracking</h3>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep you logged in</li>
        <li>Remember your preferences</li>
        <li>Analyze platform usage</li>
        <li>Improve user experience</li>
      </ul>
      
      <h3>7. Children's Privacy</h3>
      <p>Our service is not intended for children under 13. We do not knowingly collect data from children under 13 years of age.</p>
      
      <h3>8. Changes to This Policy</h3>
      <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or platform notification.</p>
      
      <h3>9. Contact Us</h3>
      <p>For privacy-related questions, contact us at:</p>
      <ul>
        <li>Email: privacy@streamplaybinge.com</li>
        <li>Phone: 1-800-STREAM-1</li>
        <li>Address: 123 Streaming Way, Mumbai, India 400001</li>
      </ul>
    `,
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    content: `
      <h2>Terms of Service for StreamPlay Binge</h2>
      <p><strong>Effective Date: January 2025</strong></p>
      
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing or using StreamPlay Binge, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
      
      <h3>2. Service Description</h3>
      <p>StreamPlay Binge provides a premium streaming platform offering:</p>
      <ul>
        <li>Access to movies, TV shows, and exclusive content</li>
        <li>Multiple device streaming</li>
        <li>Offline download capabilities (Premium plans)</li>
        <li>Personalized recommendations</li>
        <li>AI-powered voice search with Ava</li>
      </ul>
      
      <h3>3. Subscription and Billing</h3>
      <p><strong>Subscription Plans:</strong></p>
      <ul>
        <li><strong>Basic (₹99/month):</strong> SD quality, 1 device, mobile only</li>
        <li><strong>Standard (₹199/month):</strong> HD quality, 2 devices, all platforms</li>
        <li><strong>Premium (₹299/month):</strong> 4K+HDR, 4 devices, priority support</li>
      </ul>
      
      <p><strong>Billing Terms:</strong></p>
      <ul>
        <li>Subscriptions are billed monthly in advance</li>
        <li>Automatic renewal unless cancelled</li>
        <li>No refunds for partial months</li>
        <li>Price changes with 30 days notice</li>
      </ul>
      
      <h3>4. User Accounts</h3>
      <p>To use our service, you must:</p>
      <ul>
        <li>Be at least 18 years old or have parental consent</li>
        <li>Provide accurate account information</li>
        <li>Maintain the security of your password</li>
        <li>Notify us of any unauthorized access</li>
        <li>Not share your account credentials</li>
      </ul>
      
      <h3>5. Acceptable Use Policy</h3>
      <p>You agree NOT to:</p>
      <ul>
        <li>Share your account with others outside your household</li>
        <li>Use VPNs to access geo-restricted content</li>
        <li>Download content for commercial use</li>
        <li>Attempt to circumvent DRM protections</li>
        <li>Use automated systems to access the service</li>
        <li>Upload malicious content or code</li>
      </ul>
      
      <h3>6. Content Rights</h3>
      <p>All content on StreamPlay Binge is protected by copyright:</p>
      <ul>
        <li>You receive a limited, non-exclusive license to view content</li>
        <li>Content is for personal, non-commercial use only</li>
        <li>Downloads expire after 30 days or when subscription ends</li>
        <li>Content availability may change without notice</li>
      </ul>
      
      <h3>7. Device Limitations</h3>
      <p>Based on your subscription plan:</p>
      <ul>
        <li>Basic: 1 simultaneous stream</li>
        <li>Standard: 2 simultaneous streams</li>
        <li>Premium: 4 simultaneous streams</li>
        <li>Maximum 5 registered devices per account</li>
      </ul>
      
      <h3>8. Termination</h3>
      <p>We may terminate or suspend your account if you:</p>
      <ul>
        <li>Violate these terms of service</li>
        <li>Engage in fraudulent activity</li>
        <li>Fail to pay subscription fees</li>
        <li>Share account credentials commercially</li>
      </ul>
      
      <h3>9. Disclaimers</h3>
      <p>StreamPlay Binge is provided "as is" without warranties. We do not guarantee:</p>
      <ul>
        <li>Uninterrupted service availability</li>
        <li>Error-free operation</li>
        <li>Specific content availability</li>
        <li>Compatibility with all devices</li>
      </ul>
      
      <h3>10. Limitation of Liability</h3>
      <p>Our liability is limited to the amount you paid for the service in the last 12 months. We are not liable for indirect, incidental, or consequential damages.</p>
      
      <h3>11. Governing Law</h3>
      <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, India.</p>
      
      <h3>12. Contact Information</h3>
      <p>For questions about these terms:</p>
      <ul>
        <li>Email: legal@streamplaybinge.com</li>
        <li>Phone: 1-800-STREAM-1</li>
        <li>Address: 123 Streaming Way, Mumbai, India 400001</li>
      </ul>
    `,
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    slug: "help-center",
    title: "Help Center",
    content: `
      <h2>StreamPlay Binge Help Center</h2>
      <p>Welcome to our Help Center. Find answers to common questions and learn how to make the most of your streaming experience.</p>
      
      <h3>Getting Started</h3>
      
      <h4>How do I create an account?</h4>
      <p>Creating an account is easy:</p>
      <ol>
        <li>Click the "Sign Up" button on the homepage</li>
        <li>Enter your email address and create a password</li>
        <li>Choose your subscription plan</li>
        <li>Enter payment details</li>
        <li>Start streaming!</li>
      </ol>
      
      <h4>What devices are supported?</h4>
      <p>StreamPlay Binge works on:</p>
      <ul>
        <li><strong>Smart TVs:</strong> Samsung, LG, Sony, Android TV</li>
        <li><strong>Streaming Devices:</strong> Chromecast, Fire TV, Roku, Apple TV</li>
        <li><strong>Mobile:</strong> iOS 12+, Android 7+</li>
        <li><strong>Web Browsers:</strong> Chrome, Firefox, Safari, Edge</li>
        <li><strong>Gaming Consoles:</strong> PlayStation 4/5, Xbox One/Series X</li>
      </ul>
      
      <h3>Using Ava - Your AI Assistant</h3>
      
      <h4>How do I activate Ava?</h4>
      <p>You can activate Ava in two ways:</p>
      <ul>
        <li>Click the purple avatar button in the bottom right corner</li>
        <li>Say "Hi Ava" when the microphone is enabled</li>
      </ul>
      
      <h4>What can I ask Ava?</h4>
      <p>Ava can help you find content by:</p>
      <ul>
        <li>Genre: "Show me action movies"</li>
        <li>Mood: "I want something funny"</li>
        <li>Actors: "Movies with Shah Rukh Khan"</li>
        <li>Recommendations: "What should I watch tonight?"</li>
      </ul>
      
      <h3>Managing Your Account</h3>
      
      <h4>How do I change my subscription plan?</h4>
      <ol>
        <li>Go to Account Settings</li>
        <li>Click "Manage Subscription"</li>
        <li>Select your new plan</li>
        <li>Confirm the change</li>
      </ol>
      
      <h4>How do I cancel my subscription?</h4>
      <p>To cancel your subscription:</p>
      <ol>
        <li>Go to Account Settings</li>
        <li>Click "Manage Subscription"</li>
        <li>Select "Cancel Subscription"</li>
        <li>Follow the prompts to confirm</li>
      </ol>
      <p>You'll continue to have access until the end of your billing period.</p>
      
      <h3>Streaming Quality & Downloads</h3>
      
      <h4>Why is my video quality poor?</h4>
      <p>Video quality depends on:</p>
      <ul>
        <li>Your subscription plan (Basic = SD, Standard = HD, Premium = 4K)</li>
        <li>Internet connection speed (minimum 5 Mbps for HD)</li>
        <li>Device capabilities</li>
        <li>Network congestion</li>
      </ul>
      
      <h4>How do I download content for offline viewing?</h4>
      <p>For Standard and Premium plans:</p>
      <ol>
        <li>Find the content you want to download</li>
        <li>Click the download icon</li>
        <li>Choose quality (if prompted)</li>
        <li>Access downloads in "My Downloads" section</li>
      </ol>
      
      <h3>Troubleshooting Common Issues</h3>
      
      <h4>Video won't play</h4>
      <ul>
        <li>Check your internet connection</li>
        <li>Clear browser cache and cookies</li>
        <li>Update your browser or app</li>
        <li>Disable VPN if using one</li>
        <li>Try a different device</li>
      </ul>
      
      <h4>Can't sign in</h4>
      <ul>
        <li>Verify your email address is correct</li>
        <li>Use "Forgot Password" to reset</li>
        <li>Check if caps lock is on</li>
        <li>Clear browser cookies</li>
        <li>Contact support if issue persists</li>
      </ul>
      
      <h3>Billing & Payment</h3>
      
      <h4>What payment methods are accepted?</h4>
      <p>We accept:</p>
      <ul>
        <li>Credit Cards (Visa, Mastercard, American Express)</li>
        <li>Debit Cards</li>
        <li>UPI (Google Pay, PhonePe, Paytm)</li>
        <li>Net Banking</li>
        <li>Digital Wallets</li>
      </ul>
      
      <h4>When am I billed?</h4>
      <p>Billing occurs on the same date each month when you first subscribed. For example, if you subscribed on the 15th, you'll be billed on the 15th of each month.</p>
      
      <h3>Content & Recommendations</h3>
      
      <h4>How do recommendations work?</h4>
      <p>Our AI analyzes:</p>
      <ul>
        <li>Your viewing history</li>
        <li>Ratings you've given</li>
        <li>Similar users' preferences</li>
        <li>Trending content in your region</li>
      </ul>
      
      <h4>Can I create multiple profiles?</h4>
      <p>Yes! Premium accounts can create up to 5 profiles, Standard up to 3, and Basic accounts have 1 profile.</p>
      
      <h3>Still Need Help?</h3>
      <p>Contact our support team:</p>
      <ul>
        <li><strong>Live Chat:</strong> Available 24/7 in the app</li>
        <li><strong>Email:</strong> support@streamplaybinge.com</li>
        <li><strong>Phone:</strong> 1-800-STREAM-1 (9 AM - 9 PM IST)</li>
      </ul>
    `,
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    content: `
      <h2>Contact StreamPlay Binge</h2>
      <p>We're here to help! Choose the best way to reach us.</p>
      
      <h3>Customer Support</h3>
      <div class="contact-card">
        <h4>24/7 Live Chat</h4>
        <p>Get instant help from our support team</p>
        <p><strong>Available:</strong> Always</p>
        <p><strong>Response Time:</strong> Immediate</p>
        <button class="contact-button">Start Live Chat</button>
      </div>
      
      <div class="contact-card">
        <h4>Email Support</h4>
        <p>Send us a detailed message</p>
        <p><strong>Email:</strong> support@streamplaybinge.com</p>
        <p><strong>Response Time:</strong> Within 24 hours</p>
      </div>
      
      <div class="contact-card">
        <h4>Phone Support</h4>
        <p>Speak directly with our team</p>
        <p><strong>Number:</strong> 1-800-STREAM-1 (1-800-787-3261)</p>
        <p><strong>Hours:</strong> 9 AM - 9 PM IST, Monday-Saturday</p>
      </div>
      
      <h3>Corporate Offices</h3>
      
      <div class="office-card">
        <h4>Head Office - Mumbai</h4>
        <p>StreamPlay Binge Entertainment Pvt. Ltd.</p>
        <p>123 Streaming Way, Bandra Kurla Complex</p>
        <p>Mumbai, Maharashtra 400051</p>
        <p>India</p>
      </div>
      
      <div class="office-card">
        <h4>Regional Office - Bangalore</h4>
        <p>456 Tech Park, Whitefield</p>
        <p>Bangalore, Karnataka 560066</p>
        <p>India</p>
      </div>
      
      <h3>Business Inquiries</h3>
      
      <div class="contact-section">
        <h4>Partnerships & Content</h4>
        <p>For content licensing and partnership opportunities</p>
        <p><strong>Email:</strong> partnerships@streamplaybinge.com</p>
      </div>
      
      <div class="contact-section">
        <h4>Press & Media</h4>
        <p>For media inquiries and press releases</p>
        <p><strong>Email:</strong> press@streamplaybinge.com</p>
      </div>
      
      <div class="contact-section">
        <h4>Careers</h4>
        <p>Join our team!</p>
        <p><strong>Email:</strong> careers@streamplaybinge.com</p>
        <p><strong>Website:</strong> careers.streamplaybinge.com</p>
      </div>
      
      <h3>Social Media</h3>
      <p>Follow us for updates, news, and exclusive content:</p>
      <ul class="social-links">
        <li><strong>Facebook:</strong> @StreamPlayBinge</li>
        <li><strong>Twitter:</strong> @StreamPlayBinge</li>
        <li><strong>Instagram:</strong> @StreamPlayBinge</li>
        <li><strong>YouTube:</strong> StreamPlay Binge Official</li>
      </ul>
      
      <h3>Feedback & Suggestions</h3>
      <p>We value your feedback! Help us improve StreamPlay Binge:</p>
      <ul>
        <li>Feature requests: features@streamplaybinge.com</li>
        <li>Bug reports: bugs@streamplaybinge.com</li>
        <li>General feedback: feedback@streamplaybinge.com</li>
      </ul>
      
      <h3>Legal & Compliance</h3>
      <div class="contact-section">
        <h4>Legal Department</h4>
        <p>For legal matters and copyright issues</p>
        <p><strong>Email:</strong> legal@streamplaybinge.com</p>
      </div>
      
      <div class="contact-section">
        <h4>Privacy Concerns</h4>
        <p>For privacy-related questions</p>
        <p><strong>Email:</strong> privacy@streamplaybinge.com</p>
      </div>
      
      <style>
        .contact-card, .office-card, .contact-section {
          background: rgba(30, 41, 59, 0.5);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .contact-button {
          background: linear-gradient(to right, #9333ea, #ec4899);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .social-links {
          display: flex;
          gap: 20px;
          list-style: none;
          padding: 0;
          flex-wrap: wrap;
        }
      </style>
    `,
    updatedAt: new Date(),
    createdAt: new Date()
  }
];

async function seedSupportPages() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("streamplay");
    const collection = db.collection("supportPages");

    // Clear existing support pages
    await collection.deleteMany({});
    console.log("Cleared existing support pages");

    // Insert new support pages
    const result = await collection.insertMany(supportPages);
    console.log(`Inserted ${result.insertedCount} support pages`);

    // Create index on slug for faster queries
    await collection.createIndex({ slug: 1 }, { unique: true });
    console.log("Created index on slug field");

  } catch (error) {
    console.error("Error seeding support pages:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedSupportPages().catch(console.error); 