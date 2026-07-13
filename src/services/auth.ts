import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, isMockFirebase } from '../config/firebase';
import { apiClient } from '../api/client';
import { isLiveBackend } from '../config/env';
import { UserProfile, UserRole } from '../types/auth';

const STORAGE_KEYS = {
  CURRENT_USER: '@raasta_current_user',
  MOCK_USERS: '@raasta_mock_users',
  PROFILES_BY_UID: '@raasta_profiles_by_uid',
};

/**
 * Firebase Auth only stores email/password — the Raasta profile (role, bus,
 * school…) lives in our backend (MongoDB), with a local cache so login keeps
 * the right role even if the server is unreachable.
 */
const profileStore = {
  async save(profile: UserProfile): Promise<void> {
    if (isLiveBackend) {
      try {
        await apiClient.post('/api/users', profile);
      } catch {
        // Cached below; synced next time the backend is reachable.
      }
    }
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES_BY_UID);
    const map: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
    map[profile.uid] = profile;
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILES_BY_UID, JSON.stringify(map));
  },

  async load(uid: string): Promise<UserProfile | null> {
    if (isLiveBackend) {
      try {
        const { data } = await apiClient.get<UserProfile>(`/api/users/${uid}`);
        if (data?.role) return data;
      } catch {
        // Fall through to the local cache.
      }
    }
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES_BY_UID);
    const map: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
    return map[uid] ?? null;
  },
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
      const stored = await profileStore.load(userCredential.user.uid);
      const profile: UserProfile = stored ?? {
        uid: userCredential.user.uid,
        email: userCredential.user.email || formattedEmail,
        name: userCredential.user.displayName || email.split('@')[0],
        role: 'parent',
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
      await updateProfile(userCredential.user, { displayName: name }).catch(() => undefined);

      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: formattedEmail,
        name,
        role,
        phone: extraDetails.phone,
        createdAt: new Date().toISOString(),
        ...extraDetails
      };

      await profileStore.save(newProfile);
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
