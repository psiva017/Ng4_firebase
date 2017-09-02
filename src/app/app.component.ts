import { Component } from '@angular/core';
import { User } from "./user";
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  emailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  user: User;
  group: FormGroup;
  hasError = false;
  isUpdate: boolean = false;
  key: string;
  items: FirebaseListObservable<any[]>;

  constructor(db: AngularFireDatabase) {
    this.setUserValues(new User());
    this.items = db.list('/');
  }

  storeData(data: FormGroup) {
    if (data.valid) {
      this.user = data.value;
      this.user.fullName = this.user.firstName + " " + this.user.lastName;
      if (this.isUpdate) {
        this.items.update(this.key, this.user);
      } else {
        this.items.push(this.user);
      }
      this.setUserValues(new User());
    } else {
      this.hasError = true;
    }
  }


  removeAll() {
    this.items.remove();
  }

  remove(user) {
    this.items.remove(user.$key);
  }

  edit(user) {
    this.key = user.$key;
    this.isUpdate = true;
    this.setUserValues(user);
  }

  clearForm() {
    this.hasError = false;
    this.isUpdate = false;
  }

  clone(user) {
    this.isUpdate = false;
    this.setUserValues(user);
  }

  setUserValues(currentUser) {
    this.hasError = false;
    let fb2: FormBuilder = new FormBuilder();
    this.group = fb2.group({
      firstName: [currentUser.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      lastName: [currentUser.lastName, Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3)])],
      email: [currentUser.email, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      contactNo: [currentUser.contactNo, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])]
    })
  }
}