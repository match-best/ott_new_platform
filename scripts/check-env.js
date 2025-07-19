#!/usr/bin/env node

// Environment Variables Checker Script
console.log("🔍 Checking StreamPlay Environment Variables...\n")

const requiredVars = ["MONGODB_URI", "NEXT_PUBLIC_BASE_URL"]

const optionalVars = ["NEXTAUTH_SECRET", "YOUTUBE_API_KEY", "NODE_ENV"]

let hasErrors = false

// Check required variables
console.log("✅ Required Variables:")
requiredVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`   ✓ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`   ❌ ${varName}: MISSING`)
    hasErrors = true
  }
})

console.log("\n📋 Optional Variables:")
optionalVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`   ✓ ${varName}: Set`)
  } else {
    console.log(`   ⚪ ${varName}: Not set (optional)`)
  }
})

// MongoDB URI validation
if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI
  if (uri.includes("mongodb+srv://") || uri.includes("mongodb://")) {
    console.log("\n✅ MongoDB URI format looks correct")
  } else {
    console.log("\n❌ MongoDB URI format seems incorrect")
    hasErrors = true
  }
}

// Base URL validation
if (process.env.NEXT_PUBLIC_BASE_URL) {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    console.log("✅ Base URL format looks correct")
  } else {
    console.log("❌ Base URL should start with http:// or https://")
    hasErrors = true
  }
}

console.log("\n" + "=".repeat(50))

if (hasErrors) {
  console.log("❌ Environment setup has issues. Please check your .env.local file.")
  process.exit(1)
} else {
  console.log("✅ Environment setup looks good! You can run: npm run seed")
  process.exit(0)
}
