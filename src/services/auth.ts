import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, isMockFirebase } from '../config/firebase';
import { UserProfile, UserRole } from '../types/auth';

const STORAGE_KEYS = {
  CURRENT_USER: '@raasta_current_user',
  MOCK_USERS: '@raasta_mock_users',
};

// Helper for generating simulated latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Log in user
   */
  async login(email: string, password: string): Promise<UserProfile> {
    const formattedEmail = email.toLowerCase().trim();

    if (isMockFirebase) {
      await delay(1000); // simulate network latency
      
      // Retrieve stored mock users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.MOCK_USERS);
      const mockUsers: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];
      
      const foundUser = mockUsers.find(u => u.email === formattedEmail);
      
      if (!foundUser) {
        // Fallback default users if no registered mock users match
        const defaultUsers: Record<string, UserProfile> = {
          'driver@raasta.com': {
            uid: 'mock_driver_123',
            email: 'driver@raasta.com',
            name: 'Jehangir Dar',
            role: 'driver',
            phone: '+919906123456',
            vehicleNo: 'JK-01-A-1234',
            licenseNo: 'DL-99062026',
            createdAt: new Date().toISOString(),
          },
          'parent@raasta.com': {
            uid: 'mock_parent_456',
            email: 'parent@raasta.com',
            name: 'Amina Shah',
            role: 'parent',
            phone: '+919906987654',
            assignedBusNo: 'JK-01-A-1234',
            schoolName: 'Kashmir Valley School',
            createdAt: new Date().toISOString(),
          },
          'school@raasta.com': {
            uid: 'mock_school_789',
            email: 'school@raasta.com',
            name: 'Kashmir Valley School Admin',
            role: 'school',
            schoolName: 'Kashmir Valley School',
            createdAt: new Date().toISOString(),
          },
          'rto@raasta.com': {
            uid: 'mock_rto_999',
            email: 'rto@raasta.com',
            name: 'RTO Srinagar Inspector',
            role: 'rto',
            rtoCode: 'JK-01',
            createdAt: new Date().toISOString(),
          }
        };

        const defaultUser = defaultUsers[formattedEmail];
        if (defaultUser && password === 'password123') {
          await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
          return defaultUser;
        }
        throw new Error('Invalid email or password (default password is password123)');
      }

      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
      return foundUser;
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, formattedEmail, password);
      // In production, you would fetch additional user profile metadata from Firestore here.
      // For Phase 1, we construct a profile from user details.
      const profile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || formattedEmail,
        name: userCredential.user.displayName || email.split('@')[0],
        role: 'driver', // Default to driver; Firestore integration will determine role in later phases
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
      return profile;
    }
  },

  /**
   * Register a new user with a specified role
   */
  async register(
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    extraDetails: Record<string, string>
  ): Promise<UserProfile> {
    const formattedEmail = email.toLowerCase().trim();

    if (isMockFirebase) {
      await delay(1200);

      // Fetch all mock users
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.MOCK_USERS);
      const mockUsers: UserProfile[] = usersJson ? JSON.parse(usersJson) : [];

      if (mockUsers.some(u => u.email === formattedEmail)) {
        throw new Error('Email is already registered in mock database.');
      }

      const newProfile: UserProfile = {
        uid: `mock_${role}_${Date.now()}`,
        email: formattedEmail,
        name,
        role,
        phone: extraDetails.phone,
        createdAt: new Date().toISOString(),
        ...extraDetails
      };

      mockUsers.push(newProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.MOCK_USERS, JSON.stringify(mockUsers));
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));

      return newProfile;
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, formattedEmail, password);
      
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: formattedEmail,
        name,
        role,
        phone: extraDetails.phone,
        createdAt: new Date().toISOString(),
        ...extraDetails
      };
      
      // In production, profile would be saved to Firestore here.
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));
      return newProfile;
    }
  },

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    if (!isMockFirebase) {
      await signOut(auth);
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Password Reset
   */
  async resetPassword(email: string): Promise<void> {
    const formattedEmail = email.toLowerCase().trim();
    if (isMockFirebase) {
      await delay(800);
      console.log(`Mock reset password email sent to ${formattedEmail}`);
    } else {
      await sendPasswordResetEmail(auth, formattedEmail);
    }
  },

  /**
   * Fetch current authenticated user session from cache
   */
  async getCachedSession(): Promise<UserProfile | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }
};
