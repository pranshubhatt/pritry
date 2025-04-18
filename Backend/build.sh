#!/bin/bash

# Install backend dependencies
npm install

# Change to frontend directory
cd ../Frontend

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Copy frontend build to backend dist
cd ..
cp -r Frontend/dist Backend/ 