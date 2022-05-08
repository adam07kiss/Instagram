import { Component, OnInit } from '@angular/core';
import { Image } from '../../shared/models/Image';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  messageObject?: Array<Image>;
  chosenImage?: Image;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.loadImageMeta('__credits.json').subscribe((data: Array<Image>) => {
      console.log(data);      
      this.messageObject = data;
    })
  }

  loadImage(imageObject: Image) {
    this.chosenImage = imageObject;
  }

}
