import { Component, OnInit } from '@angular/core';
import { ApiService } from './../api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  clickMessage = '';

  constructor( public apiService: ApiService ) { }

  ngOnInit() {
    this.apiService.getMessages();
  }

  onClickMe() {
    this.clickMessage = 'You are my hero!';
    console.log(this.apiService.messages_token);
    this.apiService.getMessages(this.apiService.messages_token);
  }

}
