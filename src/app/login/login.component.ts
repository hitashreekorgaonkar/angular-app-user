import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public loginForm: FormGroup
  submitted = false;
  error: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userServiceService: UserServiceService,
  ) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]
      ],
    })

  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }


  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log("loginForm", this.loginForm.value);
    this.userServiceService.userLogin(this.loginForm.value)
      .subscribe((res: any) => {
        console.log("res", res);

        const user = res.find((a: any) => {
          return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
        });

        if (user) {
          console.log("Success");
          console.log("res.data.id", user.id);
          localStorage.setItem('email', user.email);
          localStorage.setItem('UserToken', user.id);
          localStorage.setItem('UserId', user.id);
          this.loginForm.reset();
          this.router.navigate(['home']);
        } else {
          this.error = "Email Id or Password is Incorrect !!"
        }
      }),
      (err) => {
        console.log("Err", err)
      }
  }
}
