import { Injectable } from "@angular/core";
import { environment } from "../enviroments/enviroment";
import { Banner } from "./models/interfaces.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
  })
  export class BannerService {
    constructor(private http: HttpClient) { }

    private apiUrl = `${environment.apiUrl}/banner`

    getBanner(): Observable<Banner[]> {
        return this.http.get<Banner[]>(`${this.apiUrl}/all`);
      }

  }  