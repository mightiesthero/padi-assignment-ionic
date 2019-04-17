import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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

  constructor(
    private currentUserService: CurrentUserService,
    private server: ServerService,
    private router: Router,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  showAlert(header, message, buttons) {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: buttons
      })
      .then(alertEl => alertEl.present());
  }

  onLogin() {
    const url = `${this.server.url}api/authenticate.json`;

    const headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
    };

    const params = {
      email: this.email,
      password: this.password
    };

    this.http.post(url, params, headers).subscribe(
      data => {
        if (data["message"] === "success") {
          this.currentUserService.email = this.email;
          this.router.navigate(["/survey"]);
        } else {
          this.showAlert("Failed", data["message"], ["Okay"]);
        }
      },
      error => {
        this.showAlert("Failed", error.message, ["Okay"]);
      }
    );
  }
}
