export default {
    preset: 'ts-jest',
    testEnvironment: 'node',  // Noter : 'node' au lieu de 'jsdom' pour le backend
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
  };