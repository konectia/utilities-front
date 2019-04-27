import { Component, OnInit, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { DropDownAction } from './drop-down-action.interface';
@Component({
    selector: 'app-drop-down',
    templateUrl: './drop-down.component.html',
    styleUrls: ['./drop-down.component.scss']
})

export class DropDownComponent implements OnInit {
    @Input() title: String;
    // actions to print
    @Input() actions: DropDownAction[];
    // onClick
    @Output() actionClick = new EventEmitter();
    constructor(private translate: TranslateService) {
    }

    ngOnInit() {

    }

    onClick(event: DropDownAction) {
        this.actionClick.emit(event);
    }

}
