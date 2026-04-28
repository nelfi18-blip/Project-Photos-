# Contributing to Project Photos

Thank you for considering contributing to Project Photos! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We love new ideas! Open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add comments for complex logic

3. **Test your changes**
   - Ensure the app builds and runs
   - Test in Docker if possible: `docker compose up --build`

4. **Run linting** (if ESLint is configured)
   ```bash
   cd backend && npx eslint .
   cd frontend && npx eslint src/
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code restructuring
   - `test:` for adding tests
   - `chore:` for maintenance

6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites
- Node.js 20+
- MongoDB (or use Docker)
- Cloudinary account (for image uploads)

### Local Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Project-Photos-.git
   cd Project-Photos-
   ```

2. Set up backend:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your credentials
   npm install
   node server.js
   ```

3. Set up frontend:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with VITE_API_URL
   npm install
   npm run dev
   ```

### Using Docker

```bash
cp backend/.env.example .env
# Edit .env with your credentials
docker compose up --build
```

## Code Style

- Use 2 spaces for indentation
- Use double quotes for strings
- Add semicolons
- Follow existing patterns in the codebase

## Questions?

Feel free to open an issue with the `question` label if you need help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
