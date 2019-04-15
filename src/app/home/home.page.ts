import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

import { CurrentUserService } from "../services/current-user.service";
import { ServerService } from "../services/server.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  email: string;
  password: string;

  url = "api/get_users.json";

  constructor(
    private currentUserService: CurrentUserService,
    private server: ServerService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  onLogin() {
    let authenticated = false;
    let url = `${this.server.url}${this.url}`;

    // TODO: authenticated with server
    // const headers = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     Authorization: "my-auth-token"
    //   })
    // };
    // this.http.get(this.url, headers).subscribe(
    //   data => {
    //     console.log(`data`);
    //     console.log(data);
    //   },
    //   error => {
    //     console.log(`error`);
    //     console.log(error);
    //   }
    // );
    if (this.email === "bengsiswantoh@gmail.com" && this.password === "bengsiswantoh@gmail.com") {
      authenticated = true;
    }

    if (authenticated) {
      this.currentUserService.email = this.email;
      this.router.navigate(["/survey"]);
    } else {
      this.alertCtrl
        .create({
          header: "Error",
          message: "email or password doesn't match",
          buttons: ["Okay"]
        })
        .then(alertEl => alertEl.present());
    }
  }
}
