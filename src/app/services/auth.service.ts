import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.fireStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    await this.fireAuth.auth.signInWithPopup(provider).then(googleCredential => {
      this.updateUserData(googleCredential.user);
    });
  }

  async facebookSignIn() {
    const provider = new auth.FacebookAuthProvider();
    await this.fireAuth.auth.signInWithPopup(provider).then(facebookCredential => {
      this.updateUserData(facebookCredential.user);
    });
  }

  async twitterSignIn() {
    const provider = new auth.TwitterAuthProvider();
    await this.fireAuth.auth.signInWithPopup(provider).then(twitterCredential => {
      console.log(twitterCredential);
      this.updateUserData(twitterCredential.user);
    });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.fireStore.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      name: user.displayName
    };
    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.fireAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}
