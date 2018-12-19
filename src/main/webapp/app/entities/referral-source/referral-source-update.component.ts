import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IReferralSource } from 'app/shared/model/referral-source.model';
import { ReferralSourceService } from './referral-source.service';

@Component({
    selector: 'jhi-referral-source-update',
    templateUrl: './referral-source-update.component.html'
})
export class ReferralSourceUpdateComponent implements OnInit {
    referralSource: IReferralSource;
    isSaving: boolean;

    constructor(private referralSourceService: ReferralSourceService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ referralSource }) => {
            this.referralSource = referralSource;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.referralSource.id !== undefined) {
            this.subscribeToSaveResponse(this.referralSourceService.update(this.referralSource));
        } else {
            this.subscribeToSaveResponse(this.referralSourceService.create(this.referralSource));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IReferralSource>>) {
        result.subscribe((res: HttpResponse<IReferralSource>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
