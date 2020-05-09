import { Component, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './../firebase.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  students: any;
  studentName: string;
  studentAge: number;
  studentAddress: string;

  constructor(private crudService: FirebaseService) { }

  ngOnInit() {
    this.crudService.read_students().subscribe(data => {

      this.students = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Age: e.payload.doc.data()['Age'],
          Address: e.payload.doc.data()['Address'],
        };
      })
      console.log(this.students);

    });
  }

  CreateRecord() {
    let record = {};
    record['Name'] = this.studentName;
    record['Age'] = this.studentAge;
    record['Address'] = this.studentAddress;
    this.crudService.create_student(record).then(resp => {
      this.studentName = "";
      this.studentAge = undefined;
      this.studentAddress = "";
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.crudService.delete_student(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.crudService.update_student(recordRow.id, record);
    recordRow.isEdit = false;
  }
}
