# JSG - JavaScript Game Editor

JSG is an online game editor designed to provide an environment for creating and editing games using JavaScript, TypeScript, Matter.js, and Three.js. The interface is built with Vue, making it easy to manage and extend.

## Features

- **Physics Engine**: Built-in support for Matter.js.
- **3D Support**: Integration with Three.js for rendering 3D scenes. _TODO_
- **Vue-Powered Interface**: A user-friendly UI powered by Vue 3 and Vuetify.
- **State Management**: Pinia is used for efficient and scalable state management.
- **TypeScript Support**: Ensuring type safety and improved development experience.
- **Project Linting & Testing**: ESLint and Vitest included for maintaining code quality.

## Installation

To set up JSG locally, clone the repository and install dependencies:

```sh
# Clone the repository
git clone https://github.com/yourusername/jsg.git

# Navigate to the project directory
cd jsg

# Install dependencies
npm install
```

## Usage

### Development Server

To start the development server, run:

```sh
npm run dev
```

### Building for Production

To build the project for production:

```sh
npm run build
```

### Previewing the Build

```sh
npm run preview
```

### Running Tests

```sh
npm run test:unit
```

### Linting Code

```sh
npm run lint
```

## Technologies Used

- **Frontend**: Vue 3, Vue Router, Vuetify
- **State Management**: Pinia
- **Physics Engine**: Matter.js
- **3D Graphics**: Three.js (planned)
- **Build Tool**: Vite
- **TypeScript**: Ensuring better developer experience and maintainability
- **Testing**: Vitest & Vue Test Utils
- **Linting**: ESLint & Vue ESLint Config

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License.
