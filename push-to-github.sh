#!/bin/bash

echo "================================================"
echo "GitHub Push Script - Dental Pricing System"
echo "================================================"
echo ""
echo "⚠️  Before running this script:"
echo "1. Create a repository on GitHub: https://github.com/new"
echo "2. Name it: dental-pricing-system"
echo "3. DO NOT add README, .gitignore, or license"
echo "4. Copy the repository URL"
echo ""
read -p "Enter your GitHub username: " username
echo ""
echo "Your repository URL will be:"
echo "https://github.com/$username/dental-pricing-system.git"
echo ""
read -p "Is this correct? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "Adding GitHub remote..."
git remote add origin "https://github.com/$username/dental-pricing-system.git" 2>/dev/null || {
    echo "Remote already exists, updating..."
    git remote set-url origin "https://github.com/$username/dental-pricing-system.git"
}

echo ""
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "================================================"
echo "✅ Done! Check your repository at:"
echo "https://github.com/$username/dental-pricing-system"
echo "================================================"
echo ""
echo "Next step: Deploy to Railway"
echo "See QUICK_START_RAILWAY.md for instructions"
