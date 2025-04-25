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

# Check for environment variables to skip certain checks
SKIP_LINT=${SKIP_LINT:-false}
SKIP_TEST=${SKIP_TEST:-false}
SKIP_SCHEMA=${SKIP_SCHEMA:-false}

# Function to run a check with nice formatting
run_check() {
  local name=$1
  local cmd=$2
  local skip_var=$3
  
  # Check if this check should be skipped
  if [ "${!skip_var}" = "true" ]; then
    echo -e "\n${YELLOW}Skipping $name (${skip_var}=true)${NC}"
    return 0
  fi
  
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
run_check "linting" "pnpm run lint" "SKIP_LINT" || ((FAILURES++))

# Testing
run_check "testing" "pnpm run test" "SKIP_TEST" || ((FAILURES++))

# Schema validation
run_check "schema validation" "pnpm run schema:validate" "SKIP_SCHEMA" || ((FAILURES++))

# Report results
if [ $FAILURES -eq 0 ]; then
  echo -e "\n${GREEN}✅ All checks passed!${NC}"
  exit 0
else
  echo -e "\n${RED}❌ $FAILURES check(s) failed!${NC}"
  
  if [ "$RUNNING_LOCALLY" = true ]; then
    echo -e "${YELLOW}↪ You can still push with git push --no-verify if needed.${NC}"
    echo -e "${YELLOW}↪ Or bypass specific checks with:${NC}"
    echo -e "${YELLOW}   SKIP_LINT=true SKIP_TEST=true git push${NC}"
  fi
  
  exit 1
fi 