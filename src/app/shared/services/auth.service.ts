import { Injectable } from '@angular/core';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  constructor() {}

  authenitcateUser() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'bti360.com',
    });

    getRedirectResult(auth).then((result) => {
      if (result) {
        this.user$.next(result.user);
        console.log(result.user)
      } else {
        signInWithRedirect(auth, provider);
      }
    });
  }
}
