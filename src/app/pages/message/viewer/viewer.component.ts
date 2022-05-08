import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Image } from '../../../shared/models/Image';
import { Message } from '../../../shared/models/Message';
import { MessageService } from '../../../shared/services/message.service';
import { MessagesService } from '../../../shared/services/messages.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges {

  @Input() imageInput?: Image;
  loadedImage?: string;
  user?: User;

  messages: Array<Message> = [];

  messagesForm = this.createForm({
    id: '',
    username: '',
    message: '',
    date: 0,
    imageId: this.imageInput?.id
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private messagesService: MessagesService,
    private userService: UserService
  ) { }

  ngOnChanges(): void {
    if (this.imageInput?.id) {
      this.messagesForm.get('imageId')?.setValue(this.imageInput.id);
      this.messageService.loadImage(this.imageInput.image_url).subscribe(data => {
        this.loadedImage = data;

      });
      this.messagesService.getMessagesByImageId(this.imageInput.id).subscribe(messages => {
        this.messages = messages;
      })
    }
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    this.userService.getById(user.uid).subscribe(data => {
      this.user = data;
      this.messagesForm.get('username')?.setValue(this.user?.username);
    }, error => {
      console.error(error);
    });

  }

  createForm(model: Message) {
    let formGroup = this.fb.group(model);
    formGroup.get('username')?.addValidators([Validators.required]);
    formGroup.get('message')?.addValidators([Validators.required]);
    return formGroup;
  }

  addMessage() {
    if (this.messagesForm.valid) {
      if (this.messagesForm.get('username') && this.messagesForm.get('message')) {
        this.messagesForm.get('date')?.setValue(new Date().getTime());

        this.messagesService.create(this.messagesForm.value);
      }
    }
  }

  deleteMessage() {
      this.messagesService.delete(this.messagesForm.value);
  }
}
