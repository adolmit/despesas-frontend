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
  @Input() id: number;

  private width: any;
  private height: any;
  private marginTop: any;
  private marginRight: any;
  private marginBottom: any;
  private marginLeft: any;

  @Input() legendShow: any;
  private legendMarginTop: any;
  private legendMarginRight: any;
  private legenMarginBottom: any;
  private legendMarginLeft: any;
  @Input() legendNames: any;
  @Input() legendColors: any;
  private legendLabelClass: any;
  @Input() legendType: any;
  private legendSquareWidth: any;
  private legendSquareHeight: any;
  private legendCircleRatio: any;
  private legendX: any;
  private legendY: any;
  private legendSpaceLabelX: any;
  private legendSpaceLabelY: any;
  private legendSpaceX: any;
  private legendSpaceY: any;
  @Input() legendOrientation: any;

  innerWidth: number;
  innerHeight: number;
  svg: any;
  chart: any;
  donut: any;
  x: any;
  y: any;
  colors: any;
  axisLabelTickClass: any;
  heightTotalWindow: number;
  constructor() {
    this.width = 800;
    this.height = 400;
    this.heightTotalWindow = this.height;
    this.marginTop = 5;
    this.marginRight = 25;
    this.marginBottom = 25;
    this.marginLeft = 150;
    this.axisLabelTickClass = 'label-axis-tick';
    this.legendShow = true;
    this.legendMarginTop = 30;
    this.legendMarginLeft = 20;
    this.legendNames = ['Legend 1', 'Legend 2', 'Legend 3', 'Legend 4'];
    this.legendColors = ['#e5c046', '#bf6d21', '#60a69e', '#8295a3'];
    this.legendLabelClass = 'label-legend';
    this.legendType = 'square';
    this.legendSquareWidth = 10;
    this.legendSquareHeight = 10;
    this.legendCircleRatio = 7.5;
    this.legendX = 0;
    this.legendY = 0;
    this.legendSpaceLabelY = -3;
    this.legendSpaceLabelX = 22;

    this.legendSpaceX = 0;
    this.legendSpaceY = 10;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['data'];
    if (!change.firstChange) {
      this.createChart();
    }
  }

  createChart() {
    this.init();
    this.donutChart();
    this.legend();
  }

  init() {
    if (this.legendOrientation == 'VERTICAL') {
      const position =
        this.legendMarginTop +
        this.legendY +
        (this.data.length * this.legendSquareWidth +
          this.data.length * this.legendSpaceY);
      this.heightTotalWindow = Math.max(
        this.height,
        position + this.legendSquareWidth
      );
    }
    this.innerWidth = this.width - this.marginLeft - this.marginRight;
    this.innerHeight = this.height - this.marginTop - this.marginBottom;

    // svg
    this.svg = d3
      .select('#chart_donut_' + this.id)
      .append('svg')
      .attr('id', 'svg_donut_' + this.id)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.heightTotalWindow)
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMin');

    this.svg.selectAll('*').remove();
    // chart, place to drawing
    this.chart = this.svg
      .append('g')
      .attr('id', 'idChartDonut')
      .attr('width', '100%')
      .attr('height', '100%')
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
      .innerRadius(radius * 0.3) // This is the size of the donut hole
      .outerRadius(radius * 0.7);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value((d: any) => Number(d.value))
      .sort((a: any, b: any) => a.index - b.index);
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.donut
      .selectAll('allSlices')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => this.colors(i))
      .style('opacity', 0.7);
    if (this.data.length <= 12) {
      this.donut
        .selectAll('allSlices')
        .data(pie(this.data))
        .enter()
        .append('text')
        .text((d, i) => this.data[i].label)
        .attr('transform', (d: any) => 'translate(' + arc.centroid(d) + ')')
        .style('text-anchor', 'middle');
    }
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

  legend() {
    let horizontal = 0;
    let vertical = 0;
    if (this.legendOrientation == 'HORIZONTAL') {
      horizontal = 1;
      vertical = 0;
    } else {
      vertical = 1;
      horizontal = 0;
    }
    const color = d3
      .scaleOrdinal()
      .domain(this.legendNames)
      .range(this.legendColors);

    const g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + [this.legendMarginLeft, this.legendMarginTop] + ')'
      );

    if (this.legendType === 'circle') {
      g.selectAll('circle')
        .data(this.legendNames)
        .enter()
        .append('circle')
        .attr(
          'cx',
          (d, i) =>
            this.legendX + i * this.legendCircleRatio + i * this.legendSpaceX
        )
        .attr('cy', this.legendY) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('r', this.legendCircleRatio)
        .style('fill', (d, i) =>
          i === 4 ? 'url(#texturaPremissa)' : color(d)
        );

      g.selectAll('text')
        .data(this.legendNames)
        .enter()
        .append('text')
        .attr(
          'x',
          (d, i) =>
            this.legendX +
            (i + 1) * this.legendCircleRatio +
            i * this.legendSpaceX +
            this.legendSpaceLabelX
        )
        .attr('y', this.legendY) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('class', this.legendLabelClass)
        .text((d) => d)
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');
    } else if (this.legendType === 'square') {
      g.selectAll('rect')
        .data(this.legendNames)
        .enter()
        .append('rect')
        .attr(
          'y',
          (d, i) =>
            this.legendY +
            (i * this.legendSquareWidth + i * this.legendSpaceY) * vertical
        ) // 100 is where the first dot appears. 25 is the distance between dots
        .attr(
          'x',
          (d, i) =>
            this.legendX +
            (i * this.legendSquareWidth + i * this.legendSpaceX) * horizontal
        ) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('width', this.legendSquareWidth)
        .attr('height', this.legendSquareHeight)
        .style('fill', (d, i) => color(d))
        .text((d) => d)
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');

      g.selectAll('text')
        .data(this.legendNames)
        .enter()
        .append('text')
        .attr(
          'y',
          (d, i) =>
            this.legendY +
            this.legendSpaceLabelY +
            ((i + 1) * this.legendSquareHeight + i * this.legendSpaceY) *
              vertical
        )
        // tslint:disable-next-line: max-line-length
        .attr(
          'x',
          (d, i) =>
            this.legendX +
            this.legendSpaceLabelX +
            ((i + 1) * this.legendSquareWidth + i * this.legendSpaceX) *
              horizontal
        ) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('class', this.legendLabelClass)
        .text((d) => d)
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');
    }
  }
}
