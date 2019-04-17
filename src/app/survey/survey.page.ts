import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { CurrentUserService } from "../services/current-user.service";
import { ServerService } from "../services/server.service";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.page.html",
  styleUrls: ["./survey.page.scss"]
})
export class SurveyPage implements OnInit {
  sales: string;
  client: string;
  address: string;
  city: string;
  status: string;
  technicians: string;
  images: any[] = [];

  constructor(
    private currentUserService: CurrentUserService,
    private server: ServerService,
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    private camera: Camera
  ) {}

  ngOnInit() {
    if (!this.currentUserService.email) {
      this.router.navigate(["home"]);
    }
  }

  showAlert(header, message, buttons) {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: buttons
      })
      .then(alertEl => alertEl.present());
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.images.push({
          img: imageData,
          name: "name",
          description: "description"
        });
      },
      err => {
        this.showAlert("Failed", `${err}`, ["Okay"]);
      }
    );
  }

  submitData(latitude, longitude) {
    const url = `${this.server.url}api/submit.json`;
    const headers = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
    };

    let techniciansObj = null;
    if (this.technicians) {
      const technicians = this.technicians.split("\n");

      techniciansObj = technicians.map(technician => {
        return { email: technician };
      });
    }

    const params = {
      clientname: this.client,
      address: this.address,
      city: this.city,
      longitude: longitude,
      latitude: latitude,
      status: this.status,
      sales: this.sales,
      email: this.currentUserService.email,
      survey_technicians_attributes: techniciansObj,
      survey_images_attributes: this.images
    };

    this.http.post(url, params, headers).subscribe(
      data => {
        this.showAlert("Success", data["message"], ["Okay"]);
      },
      error => {
        this.showAlert("Failed", error.message, ["Okay"]);
      }
    );
  }

  onSubmit() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.submitData(resp.coords.latitude, resp.coords.longitude);
      })
      .catch(error => {
        // this.showAlert(
        //   "Failed",
        //   `Error getting location ${JSON.stringify(error)}`,
        //   ["Okay"]
        // );
        this.submitData("latitude", "longitude");
      });
  }
}
