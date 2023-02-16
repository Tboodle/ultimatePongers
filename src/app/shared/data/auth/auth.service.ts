import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  authenitcateUser() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'bti360.com',
    });

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user$.next(user);
      } else {
        signInWithRedirect(auth, provider);
      }
    });
  }
}
