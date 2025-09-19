#!/bin/bash

# Script to push changes to GitHub and auto-deploy to Vercel

echo "🔄 Adding all changes to Git..."
git add .

echo "💾 Committing changes..."
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Changes pushed! Vercel will auto-deploy in 2-3 minutes."
echo "🌐 Check your site at: https://your-project.vercel.app"