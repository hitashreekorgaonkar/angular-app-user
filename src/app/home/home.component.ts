import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { UserModel } from './user-detail.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userModel: UserModel = new UserModel();
  formValue !: FormGroup
  userDetail: UserModel;
  profilePic: any;
  email: string;
  submitted = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userServiceService: UserServiceService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formValue = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['',],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      profilePic: [''],
    })

    this.getUserDetails(localStorage.getItem('UserId'));
    this.email = localStorage.getItem('email');
  }

  onChangeImage(event: any) {
    console.log("event", event);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => { this.profilePic = e.target.result; }
    reader.readAsDataURL(file);
  }

  getUserDetails(userId) {

    this.userServiceService.userInfo(userId).subscribe(
      (res: any) => {
        console.log("res", res);
        this.userDetail = res;
        console.log("userDetail", this.userDetail);
      }),
      err => {
        console.log("err", err);
      }
  }

  onEdit(userDetail) {
    console.log("this.userDetail", this.userDetail);
    this.formValue.controls['name'].setValue(userDetail.name);
    this.formValue.controls['email'].setValue(userDetail.email);
    this.formValue.controls['mobile'].setValue(userDetail.mobile);
    this.formValue.controls['password'].setValue(userDetail.password);
    this.formValue.controls['profilePic'].setValue(userDetail.profilePic);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formValue.controls;
  }

  updateUser() {

    this.submitted = true;
    if (this.formValue.invalid) {
      return;
    }

    console.log("fprofilePic", this.profilePic);
    console.log("formData.value.imageSrc", this.userModel.profilePic = this.profilePic);

    console.log("this.userDetail.id", this.userDetail);
    console.log("this.userDetail.id", this.userDetail.id);
    this.userDetail.profilePic = this.profilePic;

    this.userModel.name = this.formValue.value.name;
    this.userModel.email = this.formValue.value.email;
    this.userModel.mobile = this.formValue.value.mobile;
    this.userModel.password = this.formValue.value.password;

    this.userServiceService.updateUser(this.userModel, this.userDetail.id).subscribe(
      res => {
        console.log("res", res);
        let ref = document.getElementById('cancel')
        ref?.click();
        this.getUserDetails(this.userDetail.id);

      }),
      err => {
        console.log("err", err);
      }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
    location.reload();
  }

}
