import { Injectable } from '@angular/core';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
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
    getRedirectResult(auth, (response: any) => console.log(response));

    auth.onAuthStateChanged((user) => {
      console.log(user);
      getRedirectResult(auth, (response: any) => console.log(response));
      if (user) {
        this.user$.next(user);
      } else {
        signInWithRedirect(auth, provider);
      }
    });
  }
}
