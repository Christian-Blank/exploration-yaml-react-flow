#!/usr/bin/env bash
set -e

# Print with color
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Running local CI checks...${NC}"

# Check if this is being run in CI or locally
if [ -z "${CI}" ]; then
  # Running locally
  RUNNING_LOCALLY=true
else
  RUNNING_LOCALLY=false
fi

# Function to run a check with nice formatting
run_check() {
  local name=$1
  local cmd=$2
  
  echo -e "\n${YELLOW}Running $name...${NC}"
  if eval $cmd; then
    echo -e "${GREEN}✅ $name passed!${NC}"
    return 0
  else
    echo -e "${RED}❌ $name failed!${NC}"
    return 1
  fi
}

# Run all checks, collecting failures
FAILURES=0

# Linting
run_check "linting" "pnpm run lint" || ((FAILURES++))

# Testing
run_check "testing" "pnpm run test" || ((FAILURES++))

# Schema validation
run_check "schema validation" "pnpm run schema:validate" || ((FAILURES++))

# Report results
if [ $FAILURES -eq 0 ]; then
  echo -e "\n${GREEN}✅ All checks passed!${NC}"
  exit 0
else
  echo -e "\n${RED}❌ $FAILURES check(s) failed!${NC}"
  
  if [ "$RUNNING_LOCALLY" = true ]; then
    echo -e "${YELLOW}↪ You can still push with git push --no-verify if needed.${NC}"
  fi
  
  exit 1
fi 