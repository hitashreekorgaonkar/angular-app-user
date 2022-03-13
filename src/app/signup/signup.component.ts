import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup
  existedUsers = [];
  submitted = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userServiceService: UserServiceService,

  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['',],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]]
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  signUp() {

    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    console.log("loginForm", this.signupForm.value.email);

    this.userServiceService.userExists(this.signupForm.value.email).subscribe((res: any) => {
      console.log("Success", res);
      this.existedUsers = res;
      if (this.existedUsers.length > 0) {
        this.error = "email ID already exists";
        this.signupForm.reset();
      } else {
        this.userServiceService.userSignup(this.signupForm.value).subscribe((res: any) => {
          console.log("Success", res);
          this.signupForm.reset();
          this.router.navigate(['login']);
        }),
          (err) => {
            console.log("Err", err)
          }
      }
    }),
      (err) => {
        console.log("Err", err)
      }

  }

}
