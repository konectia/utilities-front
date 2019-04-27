import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailList } from 'src/app/model/email-list';
import { EmailCampaignsService } from 'src/app/shared';
import { EmailListInfo } from 'src/app/model/email-list-info';
import { EventEmitter } from 'events';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-new-file',
    templateUrl: './new-file.component.html',
    styleUrls: ['./new-file.component.scss']
})
export class NewFileComponent implements OnInit {
    emailListInfo: EmailListInfo;
    constructor(private emailCampanignsService: EmailCampaignsService,
        private translate: TranslateService,
        public activeModal: NgbActiveModal) {}

    ngOnInit(): void {

    }
    processFileChanged(event) {
        this.activeModal.close(event.target.files[0]);
    }
}
