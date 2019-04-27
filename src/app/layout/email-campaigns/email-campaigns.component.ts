import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { EmailCampaignsService } from '../../shared/services/email-campaigns/email-campaigns.service';
import { EmailList } from '../../model/email-list';
import { DropDownAction } from '../components/drop-down/drop-down-action.interface';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EmailListInfoComponent } from '../email-list-info/email-list-info.component';
import { NewFileComponent } from '../new-file/new-file.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-email-campaigns',
    templateUrl: './email-campaigns.component.html',
    styleUrls: ['./email-campaigns.component.scss'],
    animations: [routerTransition()]
})
export class EmailCampaignsComponent implements OnInit {
    emailLists: EmailList[];
    searchText: String = '';
    closeResult: string;
    constructor(private emailCampanignsService: EmailCampaignsService,
        private translate: TranslateService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.getEmailList();
    }
    getEmailList(): void {
        this.emailCampanignsService.getMailLists()
            .subscribe(list => this.emailLists = list);
    }

    clearEmailList(): void {
        this.emailCampanignsService.clearMailLists()
            .subscribe(list => this.emailLists = list);
    }
    onAction(action: DropDownAction) {
        switch (action.action) {
            case 'Analize':
                this.open(action);
            break;
            case 'Delete':
                this.emailCampanignsService.deleteEmailList(this.emailLists.find (list => list.name ===  action.id))
                    .subscribe(list => this.emailLists = list);
            break;
        }
    }

    open(action) {
        const modalRef = this.modalService.open(EmailListInfoComponent);
        modalRef.componentInstance.emailList = this.emailLists.find (list => list.name ===  action.id);
    }
    newFile() {
        const modalRef = this.modalService.open(NewFileComponent).result.then((result) => {
            this.emailCampanignsService.uploadCampaignsFile(result).subscribe(
                list => this.emailLists = list);
            });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    processFileChanged(event) {
        const file = event.target.files[0];
        this.emailCampanignsService
            .uploadCampaignsFile(file)
            .subscribe(list => this.emailLists = list);
    }
}
