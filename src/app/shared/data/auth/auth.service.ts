import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  authLoading = true;
  auth = getAuth();
  googleProvider = new GoogleAuthProvider();
  microsoftProvider = new OAuthProvider('microsoft.com');

  constructor() {
    this.microsoftProvider.setCustomParameters({
      tenant: 'b9bd382c-6514-4b2f-b2dc-3b1830cb58c9',
    });
    this.auth.onAuthStateChanged((user) => {
      this.authLoading = false;
      if (user) {
        this.user$.next(user);
      }
    });
  }

  logout() {
    this.auth.signOut();
    location.reload();
  }

  authenitcateUserWithGoogle() {
    if (!this.user$.value) {
      signInWithPopup(this.auth, this.googleProvider);
    }
  }

  authenitcateUserWithMicrosoft() {
    if (!this.user$.value) {
      signInWithPopup(this.auth, this.microsoftProvider);
    }
  }
}
