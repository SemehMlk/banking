import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogConfig, MAT_DIALOG_SCROLL_STRATEGY } from "@angular/material/dialog";
import { TableColumn } from "../../../@vex/interfaces/table-column.interface";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import { SelectionModel } from "@angular/cdk/collections";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import { fadeInUp400ms } from "../../../@vex/animations/fade-in-up.animation";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { stagger40ms } from "../../../@vex/animations/stagger.animation";
import { FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import icCloudDownload from "@iconify/icons-ic/twotone-cloud-download";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { merge, Observable, of as observableOf } from "rxjs";
import { environment } from "src/environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import icBaselinePictureAsPdf from '@iconify/icons-ic/baseline-picture-as-pdf';
import baselineFileUpload from '@iconify/icons-ic/baseline-file-upload';
import icBaselineNotInterested from '@iconify/icons-ic/baseline-not-interested';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockScrollStrategy, Overlay } from "@angular/cdk/overlay";
import { GeneralDialogService } from "src/@vex/services/general-dialog.service";
import { UsersCreateUpdateComponent } from "./users-create-update/users-create-update.component";
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

export class DataHttpDatabase {
  constructor(private _httpClient: HttpClient) { }

  getData(
    columns,
    sort,
    limit: number,
    offset: number
  ): Observable<any> {
    const href = environment.apiUrl;

    const requestUrl = `${href}/data?limit=${limit}&offset=${offset}&orderBy=${sort.active}&sortedBy=${sort._direction}&with=media`;

    return this._httpClient.get<any>(requestUrl);
  }
}

@UntilDestroy()
@Component({
  selector: 'vex-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: "standard",
      } as MatFormFieldDefaultOptions,
    }
  ],
})
export class UsersComponent implements OnInit {

  @Input()
  columns: TableColumn<any>[] = [
    {
      label: "Checkbox",
      property: "checkbox",
      type: "checkbox",
      visible: true,
    },
    {
      label: "Name",
      property: "firstName",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"],
    },
    {
      label: "Prénom",
      property: "lastName",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"],
    },
    {
      label: "Tél",
      property: "phone",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"],
    },
    {
      label: "Email",
      property: "email",
      type: "text",
      visible: true,
      cssClasses: ["font-medium"],
    },
    { label: "Actions", property: "actions", type: "button", visible: true },
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("table") table: MatTable<any>;
  @ViewChild("htmlData") htmlData: ElementRef;

  dataDatabase: DataHttpDatabase | null;
  resultsLength = 0;
  isLoadingResults = true;
  layoutCtrl = new FormControl("boxed");
  data: any[];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  selection = new SelectionModel<any>(true, []);
  myControl = new FormControl();
  searchCtrl = new FormControl();

  icCloudDownload = icCloudDownload;
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;
  icBaselinePictureAsPdf = icBaselinePictureAsPdf;
  baselineFileUpload = baselineFileUpload;
  disablePaginator: any = false;
  icBaselineNotInterested = icBaselineNotInterested;
   fakeData:any = [
     {firstName:"User1", lastName:"test1",phone:"00000",email:"user1@mail.com"},
     {firstName:"User2", lastName:"test2",phone:"11111",email:"user2@mail.com"},
     {firstName:"User3", lastName:"test3",phone:"22222",email:"user3@mail.com"},
   ]

  constructor(
    private snackbar: MatSnackBar,
    private _httpClient: HttpClient,
    private dialog: MatDialog,
    // public service: ApiService,
    private spinner: NgxSpinnerService,
    public dialogService: GeneralDialogService
  ) { }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }
  ngOnInit(): void {
    this.data = this.fakeData
    // this.paginator._intl.itemsPerPageLabel = 'Elements par page';
    // this.paginator._intl.previousPageLabel = 'Page precédente';
    // this.paginator._intl.nextPageLabel = 'Page suivante';
    // this.searchCtrl.valueChanges.pipe(
    //   untilDestroyed(this),
    //   debounceTime(500),
    //   distinctUntilChanged(),
    // ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.getData();
  }

  getData() {
    this.dataDatabase = new DataHttpDatabase(this._httpClient);
    this.sort.sortChange.subscribe(() => { this.paginator.pageIndex = 0; untilDestroyed(this) });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.dataDatabase!.getData(this.columns,
            this.sort, this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize);
        }),
        map((data: any) => {
          this.isLoadingResults = false;
          this.resultsLength = data.total;
          return data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        //this.data = data
      });
  }

  onFilterChange(value: string) {
    let filter = '';
    if (value.trim() == '') {
      this.reloaddataList(this.paginator.pageSize, 0);
    }
    else {
      this.columns.forEach((element: any) => {
        if (element.visible && element.property != 'checkbox' && element.property != 'id' && element.property != 'image' && element.property != 'actions') {
          filter += ';' + element.property
        }
      });
      // this.service.getAll(`/admin/providers?search=${value}&searchFields=${filter}:like&with=media`).subscribe((data: any) => {
      //   this.data = data.data;
      //   this.disablePaginator = true;
      // });
    }
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
    this.reloaddataList(this.paginator.pageSize, 0);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  findById(arr, id) {
    const found = arr.find(element => element.id = id);
    const index = arr.findIndex(c => c.id === id);
    return index;
  }

  toggleSelection(item) {
    console.log(item)
  }

  existById(arr, id) {
    return arr.findIndex(c => c.id === id) != -1;
  }

  reloaddataList(limit: number, offset: number) {
    // this.service.getAll(`/admin/providers?limit=${limit}&offset=${offset}&orderBy=id&sortedBy=&with=media`).subscribe((providers: any) => {
    //   this.spinner.hide();
    //   this.data = providers.data;
    //   this.resultsLength = providers.total;
    //   this.disablePaginator = false;
    // });
  }

  create() {
    this.dialog.open(UsersCreateUpdateComponent).afterClosed().subscribe((item: any) => {
      if (item) {
        this.reloaddataList(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize);
      }
    });
  }

  update(item: any) {
    this.dialog.open(UsersCreateUpdateComponent, {
      data: item
    }).afterClosed().subscribe(updatedSupplier => {
      if (updatedSupplier) {
        this.reloaddataList(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize);
        this.snackbar.open(`Categorie mise a jour avec succèes`, `ok`, {
          duration: 1000
        });
      }
    });
  }

  delete(id) {
    this.dialogService.confirmDialog('Voulez-vous vraiment supprimer cet utlisateur ?'
      , () => {
        // this.spinner.show();
        // this.service.delete('/admin/delete-provider', { ids: [id] }).subscribe((result: any) => {
        //   this.spinner.hide();
        //   if (this.data.length == 1 && this.paginator.pageIndex) {
        //     this.paginator.pageIndex--;
        //   }
        //   this.reloaddataList(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize);
        //   this.resultsLength--;
        // })
      });
  }
}
