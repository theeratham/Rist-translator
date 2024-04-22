import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/service/user/user.service';
import { EditUserRequest } from 'src/app/component/request/edit-user-request';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TokenPayload } from 'src/app/model/app.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: ModalDirective;
  @ViewChild('editModal', { static: true }) editModal!: ModalDirective;

  request: EditUserRequest = {};
  user: TokenPayload;
  username: string;
  firstname: string;
  lastname: string;
  email: string;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private location: Location,
    private router: Router
  ) {
    this.user = userService.getTokenPayload();
    this.username = this.user.username;
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.email = this.user.email;
  }
  ngOnInit(): void {
    this.request.username = this.user.username;
    this.request.firstname = this.user.firstname;
    this.request.lastname = this.user.lastname;
    this.request.email = this.user.email;
  }

  editProfile() {
    const id = this.user.id;
    this.userService.editUser(id, this.request).subscribe(
      (data) => {
        alert('edit successful');
        console.log('edit successful', data);
        this.closeModal('edit');
      },
      (error) => {
        alert('edit failed');
        console.error('edit failed', error);
        this.closeModal('edit');
      }
    );
  }

  openModal(modalName: string) {
    switch (modalName) {
      case 'modal':
        this.modal.show();
        break;
      case 'edit':
        this.editModal.show();
        break;
      default:
        break;
    }
  }

  closeModal(modalName: string) {
    switch (modalName) {
      case 'modal':
        this.modal.hide();
        break;
      case 'edit':
        this.editModal.hide();
        break;
      default:
        break;
    }
  }

  back() {
    this.location.back();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  cropFinished() {
    this.closeModal('modal');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.openModal('modal');
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
