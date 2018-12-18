import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
    messages = [];

    whost = environment.path;

    constructor( private http:HttpClient) {}

    getMessages() {
        this.http.get(this.whost+'/messages').subscribe(
            res => {
                console.log(res);
                this.messages = <any>res;
            },
            error => console.log(error)
        );
    }

}