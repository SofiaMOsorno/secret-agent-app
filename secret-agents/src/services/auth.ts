// TODO: Implement proper authentication with database
interface StubUser {
    id: string;
    email: string;
    codename: string;
    role: 'agent' | 'leader';
  }
  
  const stubUsers: StubUser[] = [
    {
      id: 'test-user-id',
      email: 'agent@example.com',
      codename: 'Alpha',
      role: 'agent'
    },
    {
      id: 'test-leader-id',
      email: 'leader@example.com',
      codename: 'Commander',
      role: 'leader'
    }
  ];
  
  export const authService = {
    // TODO: Implement real authentication with password hashing
    authenticateUser: async (email: string, password: string): Promise<StubUser | null> => {
      // For development, just return the first user that matches the email
      return stubUsers.find(user => user.email === email) || null;
    },
  
    // TODO: Implement real user registration with database
    registerUser: async (email: string, password: string): Promise<StubUser> => {
      const newUser: StubUser = {
        id: `user-${Date.now()}`,
        email,
        codename: `Agent-${Math.floor(Math.random() * 1000)}`,
        role: 'agent'
      };
      stubUsers.push(newUser);
      return newUser;
    }
  };