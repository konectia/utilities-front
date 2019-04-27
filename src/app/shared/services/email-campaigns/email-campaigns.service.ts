import { Injectable, getModuleFactory } from '@angular/core';
import { Observable, of, observable, forkJoin, ObjectUnsubscribedError } from 'rxjs';
import * as Excel from 'exceljs/dist/exceljs.js';
import { EmailList } from '../../../model/email-list';
import { ZipService } from '../zip/zip.service';
import { EmailListInfo } from 'src/app/model/email-list-info';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class EmailCampaignsService {
  readonly MAIL_LIST_STORAGE = 'mailLists';
  readonly UN_SUBSCRIBED_SUFFIX = '_unsubscribed_members.xlsx';
  readonly SUBSCRIBED_SUFFIX = '_subscribed_members.xlsx';

  constructor(private zipService: ZipService) { }

  getMailLists(): Observable<EmailList[]> {
    const storage = localStorage.getItem(this.MAIL_LIST_STORAGE) || '[]';
    try {
      const emails: EmailList[] = JSON.parse(storage);
      return of(emails);
    } catch (error) {
      localStorage.removeItem(this.MAIL_LIST_STORAGE);
      return of([]);
    }
  }


  public uploadCampaignsFile(file: File): Observable<EmailList[]> {
    return new Observable(obs => {
      this.getMailLists().subscribe(mails => {
        if (file.name.toLowerCase().endsWith('.zip')) {
          this.zipService.getEntries(file).subscribe(zipEntries => {
            zipEntries.forEach(ze => {
              const fileNameLower = ze.filename.toLowerCase();
              if (fileNameLower.endsWith('.xlsx')) {
                this.zipService.getData(ze).data.subscribe(blob => {
                  this.getXlsEmails(blob).then(
                    xmlsMails => {
                      this.addXlsEmails(fileNameLower, mails, xmlsMails);
                    });
                });
              }
            });
          }); // get emails
        } else if (file.name.toLowerCase().endsWith('.xlsx')) {
          const fileNameLower = file.name.toLowerCase();
          this.getXlsEmails(file).then(xmlsMails => {
            this.addXlsEmails(fileNameLower, mails, xmlsMails);
          });
        }
        obs.next(mails);
        obs.complete();
      });
    });
  }

  public clearMailLists(): Observable<EmailList[]> {
    localStorage.removeItem(this.MAIL_LIST_STORAGE);
    return this.getMailLists();
  }

  private addXlsEmails(fileNameLower: String, eMailLists: EmailList[], mails: String[]) {
    let subscribed: Boolean;
    let listName = '';
    if (fileNameLower.endsWith(this.UN_SUBSCRIBED_SUFFIX)) {
      subscribed = false;
      listName = fileNameLower.substring(0, fileNameLower.lastIndexOf(this.UN_SUBSCRIBED_SUFFIX));
    } else if (fileNameLower.endsWith(this.SUBSCRIBED_SUFFIX)) {
      subscribed = true;
      listName = fileNameLower.substring(0, fileNameLower.lastIndexOf(this.SUBSCRIBED_SUFFIX));
    } else {
      // omit
      console.log('omiting file ' + fileNameLower);
      return;
    }
    let emailList: EmailList = eMailLists.find(list => list.name === listName);
    if (!emailList) {
      emailList = new EmailList();
      emailList.name = listName;
      emailList.subscribedEmails = [];
      emailList.unSubscribedEmails = [];
      eMailLists.push(emailList);
    }
    if (subscribed) {
      emailList.subscribedEmails = emailList.subscribedEmails.concat(mails);
    } else {
      emailList.unSubscribedEmails = emailList.unSubscribedEmails.concat(mails);
    }
    console.log('Saving mails...' + eMailLists.length);
    const storage = localStorage.setItem(this.MAIL_LIST_STORAGE, JSON.stringify(eMailLists));
  }

  public getXlsEmails(blob: Blob): Promise<String[]> {
    const that = this;
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const workbook = new Excel.Workbook();
        workbook.xlsx.load(reader.result)
          .then(function () {
            const finalList: String[] = [];
            workbook.getWorksheet(1).eachRow({ includeEmpty: false }, function (row, rowNumber) {
              console.log('rowNumber ' + rowNumber + ' ' + JSON.stringify(row.values));
              const mail = row.values[1].text ? row.values[1].text.trim() : row.values[1].trim();
              finalList.push(mail.toLowerCase());
            });
            return resolve(finalList.sort());
          }).catch((error) => console.error(error.toString()));
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  public analizeEmailList(list: EmailList): Observable<EmailListInfo> {
    const listInfo: EmailListInfo = {
      duplicatedMails: [],
      invalidMails: []
    };
    listInfo.invalidMails = list.subscribedEmails.filter(function (item) {
      return list.unSubscribedEmails.includes(item);
    });
    // duplicados
    listInfo.duplicatedMails = list.subscribedEmails.filter(function (item, i, ar) {
      return ar.indexOf(item) !== i;
    });
    return of(listInfo);
  }
  public clean(list: EmailList): Observable<EmailList> {
    list.subscribedEmails = list.subscribedEmails.filter(function (item, i, ar) {
      return !list.unSubscribedEmails.includes(item) && ar.indexOf(item) === i;
    });
    return of(list);
  }

  public exportEmailList(list: EmailList) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Hoja 1');
    worksheet.columns = [{}];
    list.subscribedEmails.forEach(i => worksheet.addRow([i]));
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, list.name + this.SUBSCRIBED_SUFFIX);
    });
  }
  public deleteEmailList(list: EmailList): Observable<EmailList[]> {
    return new Observable(obs => {
      this.getMailLists().subscribe(emailLists => {
        const filtered = emailLists.filter(function (value, index, arr) {
          return value.name !== list.name;
        });
        const storage = localStorage.setItem(this.MAIL_LIST_STORAGE, JSON.stringify(filtered));
        this.getMailLists().subscribe(mails => {
          obs.next(mails);
          obs.complete();
        });
      });
    });
  }
}
