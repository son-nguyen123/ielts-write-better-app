#!/bin/bash

# =============================================================================
# IELTS WriteBetter - Quick Setup Script
# =============================================================================
# This script helps you set up the Gemini API key for the IELTS WriteBetter app
# Run with: bash setup.sh
# =============================================================================

set -e

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================"
echo "  IELTS WriteBetter - Quick Setup"
echo "========================================"
echo -e "${NC}"

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  File .env.local đã tồn tại!${NC}"
    echo ""
    read -p "Bạn có muốn ghi đè file hiện tại không? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✅ Đã hủy. File .env.local hiện tại được giữ nguyên.${NC}"
        exit 0
    fi
fi

echo ""
echo -e "${BLUE}📋 Bước 1: Lấy Gemini API Key${NC}"
echo "----------------------------------------"
echo "1. Truy cập: https://aistudio.google.com/app/apikey"
echo "2. Đăng nhập bằng tài khoản Google"
echo "3. Nhấn 'Create API key'"
echo "4. Sao chép API key"
echo ""

# Prompt for API key
read -p "Nhập Gemini API Key của bạn: " API_KEY

# Validate API key format (basic check)
if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ API key không được để trống!${NC}"
    exit 1
fi

if [[ ! $API_KEY =~ ^AIza ]]; then
    echo -e "${YELLOW}⚠️  Cảnh báo: API key có vẻ không đúng định dạng.${NC}"
    echo "API key từ Google thường bắt đầu bằng 'AIza'"
    echo ""
    read -p "Bạn có muốn tiếp tục không? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Đã hủy setup.${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}📝 Bước 2: Tạo file .env.local${NC}"
echo "----------------------------------------"

# Create .env.local file
cat > .env.local << EOF
# =============================================================================
# GEMINI API KEY
# =============================================================================
# API key for Google Gemini AI
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=$API_KEY

# =============================================================================
# FIREBASE CONFIGURATION (Optional)
# =============================================================================
# Uncomment and fill these if you want to use Firebase features
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=
EOF

echo -e "${GREEN}✅ Đã tạo file .env.local thành công!${NC}"

# Verify file was created
if [ -f .env.local ]; then
    echo ""
    echo -e "${GREEN}✨ Setup hoàn tất!${NC}"
    echo ""
    echo -e "${BLUE}📖 Các bước tiếp theo:${NC}"
    echo "----------------------------------------"
    echo "1. Cài đặt dependencies (nếu chưa):"
    echo "   ${YELLOW}npm install${NC}"
    echo ""
    echo "2. Khởi động development server:"
    echo "   ${YELLOW}npm run dev${NC}"
    echo ""
    echo "3. Truy cập ứng dụng tại:"
    echo "   ${YELLOW}http://localhost:3000${NC}"
    echo ""
    echo -e "${GREEN}🎉 Tất cả tính năng AI giờ đã hoạt động!${NC}"
    echo ""
else
    echo -e "${RED}❌ Có lỗi xảy ra khi tạo file .env.local${NC}"
    exit 1
fi

# Security reminder
echo ""
echo -e "${YELLOW}🔒 Lưu ý bảo mật:${NC}"
echo "- File .env.local đã được thêm vào .gitignore"
echo "- KHÔNG chia sẻ API key của bạn với người khác"
echo "- KHÔNG commit file .env.local lên Git/GitHub"
echo ""
