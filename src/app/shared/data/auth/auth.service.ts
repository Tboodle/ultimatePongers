import { Injectable } from '@angular/core';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  auth = getAuth();
  googleProvider = new GoogleAuthProvider();
  microsoftProvider = new OAuthProvider('microsoft.com');

  constructor() {
    this.googleProvider.setCustomParameters({
      hd: 'bti360.com',
    });
    // this.microsoftProvider.setCustomParameters({ prompt: 'consent' });
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user$.next(user);
      }
    });
    getRedirectResult(this.auth).then((result) => {
      if (result) {
        console.log('redirect: ', result);
      }
    });
  }

  authenitcateUserWithGoogle() {
    if (!this.user$.value) {
      signInWithRedirect(this.auth, this.googleProvider);
    }
  }

  authenitcateUserWithMicrosoft() {
    if (!this.user$.value) {
      signInWithRedirect(this.auth, this.microsoftProvider);
    }
  }
}
