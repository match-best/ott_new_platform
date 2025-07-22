import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/streamplay";
const client = new MongoClient(uri);

const supportPages = [
  {
    slug: "help-center",
    title: "Help Center",
    content: `<h2>Welcome to the Help Center</h2><p>Find answers to common questions and get support for your streaming experience.</p><ul><li>How to use StreamPlay</li><li>Account & Billing</li><li>Streaming Issues</li></ul>`,
    updatedAt: new Date(),
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    content: `<h2>Contact Us</h2><p>Need help? Reach out to our support team:</p><ul><li>Email: support@streamplay.com</li><li>Phone: +1-800-STREAM</li></ul>`,
    updatedAt: new Date(),
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `<h2>Privacy Policy</h2><p>Your privacy is important to us. Read how we handle your data.</p>`,
    updatedAt: new Date(),
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    content: `<h2>Terms of Service</h2><p>Read our terms and conditions for using StreamPlay.</p>`,
    updatedAt: new Date(),
  },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection("support_pages");
    await col.deleteMany({});
    await col.insertMany(supportPages);
    console.log("Support pages seeded successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed(); 