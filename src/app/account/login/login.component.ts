import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(public auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private async buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  singIn() {
    const user: User = this.loginForm.value;
    alert(`Hello ${user.name} your email is: ${user.email}`);
  }
}
