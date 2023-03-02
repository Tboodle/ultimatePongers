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

    getRedirectResult(auth).then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      console.log(result);
      if (result) {
        console.log('get result', result);
        // The signd-in user info.
        const user = result.user;
        this.user$.next(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      } else {
        console.log('redirect', result);
        signInWithRedirect(auth, provider);
      }
    });
  }
}
