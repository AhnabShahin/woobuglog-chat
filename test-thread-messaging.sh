#!/bin/bash

# Test Script for Discord API - Thread Messaging
# This helps you test sending messages to threads vs channels

# Replace these with your actual values
API_TOKEN="779640d4be14f99c6bebbfe9e68cf9a544c323872f0dd4b48d71139dd09a5431"
BASE_URL="http://localhost:3000/api/v1"

# Your channel and thread IDs
CHANNEL_ID="1477559419951779963"
THREAD_ID="1475734635781554251"

echo "================================"
echo "Discord API Thread Test"
echo "================================"
echo ""

# Test 1: Send message to channel only
echo "📝 Test 1: Sending message to CHANNEL..."
curl -X POST ${BASE_URL}/messages/send \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"channelId\": \"${CHANNEL_ID}\",
    \"content\": \"Test message to CHANNEL only ($(date))\"
  }"
echo ""
echo ""

# Wait a bit
sleep 2

# Test 2: Send message to thread only
echo "📝 Test 2: Sending message to THREAD..."
curl -X POST ${BASE_URL}/messages/send \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"threadId\": \"${THREAD_ID}\",
    \"content\": \"Test message to THREAD only ($(date))\"
  }"
echo ""
echo ""

# Wait a bit
sleep 2

# Test 3: Send message with both channelId and threadId (should go to thread)
echo "📝 Test 3: Sending message with BOTH channelId and threadId (should go to THREAD)..."
curl -X POST ${BASE_URL}/messages/send \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"channelId\": \"${CHANNEL_ID}\",
    \"threadId\": \"${THREAD_ID}\",
    \"content\": \"hussain vai kemon achen? (Should appear in THREAD - $(date))\"
  }"
echo ""
echo ""

echo "================================"
echo "✅ Tests Complete!"
echo "================================"
echo ""
echo "Check your Discord server:"
echo "1. First message should be in the CHANNEL"
echo "2. Second message should be in the THREAD"
echo "3. Third message should be in the THREAD (not channel)"
echo ""
echo "Also check your terminal running 'npm run dev' for logs like:"
echo "📤 Sending message to thread: [thread-name]"
echo ""
