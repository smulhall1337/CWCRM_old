import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IReferralType } from 'app/shared/model/referral-type.model';
import { AccountService } from 'app/core';
import { ReferralTypeService } from './referral-type.service';

@Component({
    selector: 'jhi-referral-type',
    templateUrl: './referral-type.component.html'
})
export class ReferralTypeComponent implements OnInit, OnDestroy {
    referralTypes: IReferralType[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected referralTypeService: ReferralTypeService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.referralTypeService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<IReferralType[]>) => (this.referralTypes = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.referralTypeService.query().subscribe(
            (res: HttpResponse<IReferralType[]>) => {
                this.referralTypes = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInReferralTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IReferralType) {
        return item.id;
    }

    registerChangeInReferralTypes() {
        this.eventSubscriber = this.eventManager.subscribe('referralTypeListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
