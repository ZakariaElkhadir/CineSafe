# CineSafe

© 2025 Zakaria Elkhadir. All rights reserved.

This project is currently under development.

[Figma Design](https://www.figma.com/design/j10hdTjQNBUvJuA1TodK6d/Untitled?node-id=0-1&t=wtjMMQJ4m2vmfYrA-1)

**Note:** This project relies on a private API key stored in a `.env` file. To streamline the setup process, use the provided `set_api.sh` script to configure the environment with the required API key. This script is intended solely for testing purposes and does not grant ownership or usage rights for the project or its API key. Ensure you run the script using the command `./set_api.sh` before starting the development server to ensure the project functions correctly.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## License
This project is proprietary software licensed under the CineSafe License. See the [LICENSE](./LICENSE) file for more details.


## Getting Started

Follow these steps to install dependencies and start the development server:

```bash
# Install project dependencies
npm install

# Set up the environment with the API key
./set_api.sh

# Start the development server
npm run dev
```

Alternatively, you can use:

```bash
# Using Yarn
yarn dev

# Using PNPM
pnpm dev

# Using Bun
bun dev
```

Once the server is running, open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

### Disclaimer
This project is provided "as is" without any warranty. The API key must be kept private, and the owner is not responsible for misuse or violations of third-party terms of service. Ensure you follow best practices to secure your environment when deploying this project.
