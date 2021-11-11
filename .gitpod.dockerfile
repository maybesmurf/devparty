FROM gitpod/workspace-mysql

# Install Node and Yarn
RUN brew install node
RUN brew install redis

# Install Playwright deps
RUN npx playwright install-deps
RUN npx playwright install
