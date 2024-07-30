import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit {
  @Input() id: any;

  @Input() data: Array<any>;

  private width: any;
  private height: any;
  private marginTop: any;
  private marginRight: any;
  private marginBottom: any;
  private marginLeft: any;

  @Input() axisYLineShow: any;
  @Input() axisYLabelShow: any;
  @Input() axisYDataShow: any;
  @Input() axisYLabel: any;

  private axisYLabelMarginTop: any;
  private axisYLabelMarginLeft: any;
  private axisYMarginTop: any;
  private axisYMarginLeft: any;

  private axisYLineClass: any;
  private axisYLabelClass: any;
  private axisYLabelTickClass: any;

  @Input() axisXLineShow: any;
  @Input() axisXLabelShow: any;
  @Input() axisXDataShow: any;

  @Input() axisXBase: number;
  @Input() axisXLabel: any;

  private axisXLineClass: any;
  private axisXLabelClass: any;
  private axisXLabelTickClass: any;

  private barBandWidth: any;
  private barBandSteps: any;

  innerWidth: number;
  innerHeight: number;
  svg: any;
  chart: any;
  x: any;
  y: any;

  constructor() {
    this.width = 800;
    this.height = 300;
    this.marginTop = 50;
    this.marginRight = 70;
    this.marginBottom = 50;
    this.marginLeft = 80;

    this.axisYLineShow = true;
    this.axisYDataShow = true;
    this.axisYLabel = 'Label axis Y';
    this.axisYLabelMarginTop = 139;
    this.axisYLabelMarginLeft = 200;
    this.axisYMarginTop = 168.5;
    this.axisYMarginLeft = 395.5;
    this.axisYLineClass = 'line-axis-y';
    this.axisYLabelClass = 'label-axis';
    this.axisYLabelTickClass = 'label-axis-tick';

    this.axisXLineShow = true;
    this.axisXDataShow = true;
    this.axisXLabel = 'Label axis X';
    this.axisXLineClass = 'line-axis-x';
    this.axisXLabelClass = 'label-axis';

    this.barBandWidth = 15;
    this.barBandSteps = 25;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange) {
      this.createChart();
    }
  }

  createChart() {
    this.init();
    this.linechart();
    this.createGridLines();
  }

  init() {
    const barBandPadding =
      (this.barBandSteps - this.barBandWidth) / this.barBandSteps;
    this.width =
      this.data.length * this.barBandWidth +
      (this.data.length + 1) * (this.barBandSteps - this.barBandWidth) +
      this.marginLeft +
      this.marginRight;

    this.innerWidth = this.width - this.marginLeft - this.marginRight;
    this.innerHeight = this.height - this.marginTop - this.marginBottom;
    console.log('WIDHT', this.width, this.height);
    // svg
    this.svg = d3
      .select('#chart_line_' + this.id)
      .append('svg')
      .attr('id', 'svg_line_' + this.id)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMid meet');
    //.call(this.zoom)

    this.svg.selectAll('*').remove();
    // chart, place to drawing
    this.chart = this.svg
      .append('g')
      .attr('id', 'idChart_' + this.id)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr(
        'transform',
        'translate(' + this.marginLeft + ',' + this.marginTop + ')'
      );

    let yMin = d3.min(this.data, (d) => d.y);
    yMin = Math.min(yMin, 0);
    const yMax = d3.max(this.data, (d) => d.y);
    console.log('sss', yMin, yMax);
    this.y = d3.scaleLinear().domain([yMin, yMax]).range([this.innerHeight, 0]);

    this.x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.x))
      .rangeRound([0, this.innerWidth])
      .padding(barBandPadding);

    // axis
    this.drawAxisX(this.axisXLineShow, this.axisXLabelShow, this.axisXDataShow);
    this.drawAxisY(this.axisYLineShow, this.axisYLabelShow, this.axisYDataShow);
  }

  drawAxisX(showLine, showTitle, showLabels) {
    const xAxis = d3.axisBottom(this.x);
    let yMin = d3.min(this.data, (d) => d.y);
    yMin = Math.min(0, yMin);

    if (showLine) {
      const g2 = this.svg.append('g');
      g2.append('line')
        .attr('class', this.axisYLineClass)
        .attr('x1', this.marginLeft)
        .attr('y1', this.marginTop + this.innerHeight)
        .attr(
          'x2',
          this.marginLeft +
            this.innerWidth -
            (this.barBandSteps - this.barBandWidth)
        )
        .attr('y2', this.marginTop + this.innerHeight);
    }

    if (showTitle) {
      this.chart
        .append('text')
        .attr('text-anchor', 'init')
        .attr(
          'transform',
          'translate(' + [this.innerWidth + 10, this.innerHeight] + ')'
        )
        .text(this.axisXLabel)
        .attr('class', this.axisXLabelClass)
        .attr('alignment-baseline', 'central');
    }
    if (showLabels) {
      const g = this.chart.append('g');
      g.selectAll('text-label-y')
        .data(this.data)
        .enter()
        .append('text')
        .attr('y', (d) => this.y(yMin) + 17)
        .attr('x', (d) => this.x(d.x) + this.barBandWidth / 2)
        .text((d) => d.x)
        .attr('class', (d) => this.axisYLabelTickClass)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible');
    }
  }

  drawAxisY(showLine, showTitle, showLabels) {
    const yAxis = d3.axisLeft(this.y);
    //console.log("drawAxisY");
    let xMin = d3.min(this.data, (d) => d.x);
    xMin = Math.min(0, xMin);
    if (showLine) {
      const g2 = this.svg.append('g');
      g2.append('line')
        .attr('class', this.axisYLineClass)
        .attr('x1', this.marginLeft)
        .attr('y1', this.marginTop)
        .attr('x2', this.marginLeft)
        .attr('y2', this.marginTop + this.innerHeight);
    }

    if (showTitle) {
      const g1 = this.svg.append('g');
      g1.append('text')
        .attr('text-anchor', 'init')
        .attr(
          'transform',
          'translate(' +
            [this.axisYLabelMarginLeft, this.axisYLabelMarginTop] +
            ')'
        )
        .text(this.axisYLabel)
        .attr('class', this.axisYLabelClass);
    }

    if (showLabels) {
      const g = this.chart.append('g');
      g.selectAll('text-label-y')
        .data(this.data)
        .enter()
        .append('text')
        .attr('x', (d) => this.x(xMin) - 27)
        .attr('y', (d) => this.y(d.y))
        .text((d) => d.y)
        .attr('class', (d) => this.axisYLabelTickClass)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible');
    }
  }

  wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        x = text.attr('x'),
        y = text.attr('y'),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', dy + 'em');
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

  linechart() {
    // dot
    const g = this.chart.append('g');
    g.selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', (d) => this.x(d.x))
      .attr('cy', (d) => this.y(d.y))
      .attr('fill', '#379097');

    var line = d3
      .line()
      .x((d) => {
        return this.x(d['x']);
      })
      .y((d) => {
        return this.y(d['y']);
      });

    g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#379097')
      .attr('stroke-width', 1)
      .attr('d', line);
  }

  createGridLines() {
    // add the X gridlines
    this.chart
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + this.innerHeight + ')')
      .call(
        this.make_x_gridlines()
          .tickSize(-this.innerHeight)
          .tickFormat(() => '')
      );

    // add the Y gridlines
    this.chart
      .append('g')
      .attr('class', 'grid')
      .call(
        this.make_y_gridlines()
          .tickSize(-this.innerWidth)
          .tickFormat(() => '')
      );
  }
  // gridlines in x axis function
  make_x_gridlines() {
    return d3.axisBottom(this.x).ticks(5);
  }

  // gridlines in y axis function
  make_y_gridlines() {
    return d3.axisLeft(this.y).ticks(5);
  }
}
