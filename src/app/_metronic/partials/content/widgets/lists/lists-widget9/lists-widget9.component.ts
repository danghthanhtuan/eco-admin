import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/modules/e-commerce/_services/charts.service';

@Component({
  selector: 'app-lists-widget9',
  templateUrl: './lists-widget9.component.html',
})
export class ListsWidget9Component implements OnInit {
  public time = "";
  public responeData : any;
  public listOrderId = new Array;
  public countOrder : number;
  public date = "";
  constructor(private _chartSvc: ChartsService) {}

  ngOnInit(): void {
    this.getDataCharts();
  }
  countUnique(iterable) {
    return new Set(iterable).size;
  }
  getDataCharts(){
    this._chartSvc.getChartQuickInfo().subscribe((res : any)=>{
      this.responeData = {...res}.data;
      if(this.responeData.length > 0 ){
          this.responeData.forEach(element => {
            this.listOrderId.push(element.OrderID)
        });
        console.log(this.responeData);
        this.countOrder = this.countUnique(this.listOrderId);
        const date = new Date(this.responeData[0].OrderDate);
        this.time = date.toLocaleTimeString('it-IT');
      }
     })
  }
}
