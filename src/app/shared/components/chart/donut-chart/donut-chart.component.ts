import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent implements OnInit {
  @ViewChild('svg') private svgContainer: ElementRef;
  @Input() data: Array<any>;
  @Input() mainData: number;

  private width: any;
  private height: any;
  private marginTop: any;
  private marginRight: any;
  private marginBottom: any;
  private marginLeft: any;

  innerWidth: number;
  innerHeight: number;
  svg: any;
  chart: any;
  donut: any;
  x: any;
  y: any;
  colors: any;
  axisLabelTickClass: any;
  constructor() {
    this.width = 400;
    this.height = 400;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;
    this.marginLeft = 5;
    this.axisLabelTickClass = 'label-axis-tick';
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['data'];
    // console.log(changes);
    if (!change.firstChange) {
      this.createChart();
    }
  }

  createChart() {
    this.init();
    this.donutChart();
  }

  init() {
    this.innerWidth = this.width - this.marginLeft - this.marginRight;
    this.innerHeight = this.height - this.marginTop - this.marginBottom;

    // svg
    this.svg = d3
      .select(this.svgContainer.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.selectAll('*').remove();
    // chart, place to drawing
    this.chart = this.svg
      .append('g')
      .attr('id', 'idChart')
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight)
      .attr(
        'transform',
        'translate(' + this.marginLeft + ',' + this.marginTop + ')'
      );

    this.donut = this.chart
      .append('g')
      .attr(
        'transform',
        'translate(' + this.innerWidth / 2 + ',' + this.innerHeight / 2 + ')'
      );

    const colorsRange = [];
    this.data.forEach((element) => {
      if (element.color) colorsRange.push(element.color);
    });

    this.colors = d3
      .scaleOrdinal()
      .domain(this.data.map((d) => d.value.toString()))
      .range(colorsRange);
  }

  donutChart() {
    const radius = this.innerHeight / 2;

    // The arc generator
    var arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.donut
      .selectAll('allSlices')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => this.colors(i))
      .style('opacity', 0.7);
    const g = this.chart.append('g');
    g.append('text')
      .attr('y', (d) => this.innerHeight / 2)
      .attr('x', (d) => this.innerWidth / 2)
      .text(this.mainData)
      .attr('class', (d) => this.axisLabelTickClass)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('visibility', 'visible');
  }
}
