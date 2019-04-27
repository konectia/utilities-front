import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailList } from 'src/app/model/email-list';
import { EmailCampaignsService } from 'src/app/shared';
import { EmailListInfo } from 'src/app/model/email-list-info';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-email-list-info',
    templateUrl: './email-list-info.component.html',
    styleUrls: ['./email-list-info.component.scss']
})
export class EmailListInfoComponent implements OnInit {
    @Input() emailList: EmailList;
    emailListInfo: EmailListInfo;
    constructor(private emailCampanignsService: EmailCampaignsService,
        private translate: TranslateService,
        public activeModal: NgbActiveModal) { }

    ngOnInit(): void {
        this.update();
    }
    clean(): void {
        this.emailCampanignsService.clean(this.emailList).subscribe(list => {
            this.emailList = list;
            this.update();
        });
    }
    update(): void {
        this.emailCampanignsService.analizeEmailList(this.emailList).subscribe(info => {
            this.emailListInfo = info;
        });
    }
    export(): void {
        this.emailCampanignsService.exportEmailList(this.emailList);
    }
}
