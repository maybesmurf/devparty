#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD=$(tput bold)
NORMAL=$(tput sgr0)
URL=$(eval gp url 3000)

clear
curl -s "$URL/api/graphql?warmup=true" > /dev/null
echo -e "✅ ${GREEN}${BOLD}GraphQL Server warmed up${NORMAL}${NC} 🔥"
echo -e "\n👋 ${GREEN}${BOLD}Welcome to Devparty${NORMAL}${NC}\n"
echo -e "💻 ${BOLD}Commands:${NORMAL}\n"
awk -F':' '{printf "%s%s", $2, (/^Description/)?"\n":"\t\t"}' ./scripts/commands.txt
echo -e "\nAdmin username: ${CYAN}${BOLD}admin${NORMAL}${NC}"
echo -e "Admin password: ${CYAN}${BOLD}admin${NORMAL}${NC}\n"
echo -e "Visit: ${BLUE}${URL}${NC}\n"
echo -e "${PURPLE}${BOLD}Happy coding${NORMAL}${NC} 😍\n"
