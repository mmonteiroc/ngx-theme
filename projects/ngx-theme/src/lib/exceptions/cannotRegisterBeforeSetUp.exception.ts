export class CannotRegisterBeforeSetUp extends Error {
  constructor() {
    super(
      'Cannot register to listen for theme changes before setting up the service'
    );
  }
}
