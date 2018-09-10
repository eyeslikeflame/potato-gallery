import { Component, OnInit } from '@angular/core';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { AppService } from "../app.service";

@Component( {
    selector:    'potato-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls:   [ './search-bar.component.scss' ]
} )
export class SearchBarComponent implements OnInit {

    constructor( public appService: AppService ) {
    }

    showSearchBar = false;

    toggleSearch() {
        this.showSearchBar = !this.showSearchBar;
        this.appService.searchPhrase = '';
        if ( this.showSearchBar ) {
            setTimeout( () => {
                const textField = new MDCTextField( document.querySelector( '.mdc-text-field' ) );
                textField.input_.focus();
            }, 0 );
        }
    }

    ngOnInit() {

    }

}
