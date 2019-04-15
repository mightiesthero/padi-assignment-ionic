import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CurrentUserService {
  email = null;
  constructor() {}
}
