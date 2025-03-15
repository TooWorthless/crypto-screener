import { Auth } from './Auth';
import { storageInstance } from '../storage/storageInstance';

export const authInstance = new Auth(storageInstance);