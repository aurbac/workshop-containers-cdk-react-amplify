import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
    messages = [];
    messages_token = "";
    more_messages = true;

    whost = environment.path;

    constructor( private http:HttpClient) {}

    getMessages(token : string = "") {

        let path = '/messages';
        if (token!==""){
            path += "/"+token;
        }

        this.http.get(this.whost+path).subscribe(
            res => {
                console.log(res);
                this.messages = this.messages.concat(<any>res.messages);
                this.messages_token = res.token;
                if (this.messages_token==="")
                    this.more_messages = false;
                console.log(" ---- " + this.more_messages);
            },
            error => console.log(error)
        );
    }

}