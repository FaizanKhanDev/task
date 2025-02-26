declare module 'email-existence' {
    interface EmailExistence {
      check(email: string, callback: (error: Error | null, response: boolean) => void): void;
    }
  
    const emailExistence: EmailExistence;
    export = emailExistence;
  }