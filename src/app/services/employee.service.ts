import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  readonly URL_API = this.config.getConfig().backend.url

  constructor(private config: ConfigService,
              private http: HttpClient) { }

  create(data:any){
    return this.http.post(this.URL_API+'/employee', data)
  }

  update(data:any){
    return this.http.put(this.URL_API+'/employee', data)
  }

  delete(id:string){
    return this.http.delete(this.URL_API+'/employee/' + id)
  }

  list(){
    return this.http.get(this.URL_API+'/employee')
  }

  active(data:any){
    return this.http.put(this.URL_API+'/employee/active', data)
  }

  search(data:any){
    return this.http.post(this.URL_API+'/employee/search', data)
  }

  searchGet(data:any){
    return this.http.get(this.URL_API+'/employee/searchget', data)
  }
}
