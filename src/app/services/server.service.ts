import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ServerService {
  url = "https://padi-assignment.herokuapp.com/";
  constructor() {}
}
