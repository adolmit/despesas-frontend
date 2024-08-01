import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import { DataBarchart } from '../model/data';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: DataBarchart[] = [];
  @Input() id: any;
  private width: number;
  private height: number;
  private marginTop: number;
  private marginRight: number;
  private marginBottom: number;
  private marginLeft: number;
  @Input() orientation: any;
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
  @Input() tooltipShow: any;
  private tooltipLabel: any;
  @Input() tooltipRound: any;
  private tooltipOpacity: any;
  private tooltipDurationMouseOver: any;
  private tooltipDurationMouseOut: any;
  private tooltipClass: any;

  @Input() barColor: any;
  private barBandWidth: any;
  private barBandSteps: any;
  @Input() lineMeanShow: any;
  private lineMeanLabel: any;
  private lineMeanClass: any;
  private lineMeanLabelClass: any;
  @Input() lineMeanRound: any;

  @Input() legendShow: any;
  private legendMarginTop: any;
  private legendMarginRight: any;
  private legenMarginBottom: any;
  private legendMarginLeft: any;
  @Input() legendNames: any;
  private legendColors: any;
  private legendLabelClass: any;
  @Input() legendType: any;
  private legendSquareWidth: any;
  private legendSquareHeight: any;
  private legendCircleRatio: any;
  private legendX: any;
  private legendY: any;
  private legendSpaceLabel: any;
  private legendSpaceX: any;
  private legendSpaceY: any;

  innerWidth: number;
  innerHeight: number;
  svg: any;
  chart: any;
  x: any;
  y: any;
  //zoomChart = d3.zoom().on('zoom', this.zoomed);
  zoom;
  panDown = false;
  panUp = false;
  panLeft = false;
  panRight = false;
  zoomIn = false;
  zoomOut = false;
  count;

  intervalPanDown;
  intervalPanUp;
  intervalPanLeft;
  intervalPanRight;
  intervalZoomIn;
  intervalZoomOut;
  constructor(private elementRef: ElementRef) {
    this.width = 800;
    this.height = 700;
    this.marginTop = 50;
    this.marginRight = 70;
    this.marginBottom = 50;
    this.marginLeft = 200;

    this.axisYLineShow = true;
    this.axisYDataShow = true;
    this.axisYLabel = 'Label axis Y';
    this.axisYLabelMarginTop = 139;
    this.axisYLabelMarginLeft = 210;
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

    this.tooltipShow = true;
    this.tooltipLabel = 'Poço: {labelY}<br/>Vida remanescente {labelX} ';
    this.tooltipRound = 1;
    this.tooltipOpacity = 0.9;
    this.tooltipDurationMouseOver = 200;
    this.tooltipDurationMouseOut = 500;
    this.tooltipClass = 'chart_tooltip';

    this.barBandWidth = 15;
    this.barBandSteps = 25;

    this.lineMeanLabelClass = 'label-mean';
    this.lineMeanShow = true;
    this.lineMeanLabel = 'Média: ';
    this.lineMeanClass = 'line-mean';
    this.lineMeanRound = 1;

    this.legendShow = true;
    this.legendMarginTop = 69;
    this.legendMarginLeft = 468;
    this.legendNames = ['Legend 1', 'Legend 2', 'Legend 3', 'Legend 4'];
    this.legendColors = ['#e5c046', '#bf6d21', '#60a69e', '#8295a3'];
    this.legendLabelClass = 'label-legend';
    this.legendType = 'square';
    this.legendSquareWidth = 20;
    this.legendSquareHeight = 20;
    this.legendCircleRatio = 7.5;
    this.legendX = 0;
    this.legendY = 0;
    this.legendSpaceLabel = 15;
    this.legendSpaceX = 200;
    this.legendSpaceY = 0;
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
    this.barchart();
    if (this.legendShow) {
      this.legend();
    }
    if (this.lineMeanShow) {
      if (this.orientation === 'horizontal') {
        this.createLineVertical(
          this.lineMeanLabel,
          this.average(),
          this.lineMeanRound,
          this.lineMeanClass
        );
      } else {
        this.createLineHorizontal(
          this.lineMeanLabel,
          this.average(),
          this.lineMeanRound,
          this.lineMeanClass
        );
      }
    }
  }

  init() {
    if (this.orientation === 'vertical') {
      const aux = this.marginBottom;
      this.marginBottom = this.marginLeft;
      this.marginLeft = aux;
    }

    const barBandPadding =
      (this.barBandSteps - this.barBandWidth) / this.barBandSteps;

    this.height =
      this.data.length * this.barBandWidth +
      (this.data.length + 1) * (this.barBandSteps - this.barBandWidth) +
      this.marginBottom +
      this.marginTop;

    this.innerWidth = this.width - this.marginLeft - this.marginRight;
    this.innerHeight = this.height - this.marginTop - this.marginBottom;

    this.zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      /*
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      */
      .on('zoom', this.handleZoom)
      .on('end', () => {
        if (!this.endPanLeft) clearInterval(this.intervalPanLeft);
        if (!this.endPanRight) clearInterval(this.intervalPanRight);
      });

    this.svg = d3
      .select('#chart_' + this.id)
      .append('svg')
      .attr('id', 'svg_' + this.id)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMid meet')
      //.call(this.zoom)
      .append('g')
      .attr('id', 'g_' + this.id);

    this.svg.selectAll('*').remove();
    // chart, place to drawing
    this.chart = this.svg
      .append('g')
      .attr('id', 'idChart')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr(
        'transform',
        'translate(' + this.marginLeft + ',' + this.marginTop + ')'
      );

    if (this.orientation === 'horizontal') {
      // scale axis
      let xMin = d3.min(this.data, (d) => d.x);
      xMin = Math.min(xMin, 0);
      let xMax = d3.max(this.data, (d) => d.x);
      if (this.axisXBase) {
        xMax = Math.max(this.axisXBase, xMax);
      }
      this.x = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, this.innerWidth]);

      this.y = d3
        .scaleBand()
        .domain(this.data.map((d) => d.y))
        .rangeRound([0, this.innerHeight])
        .padding(barBandPadding);

      // axis
      this.drawAxisX(
        this.axisXLineShow,
        this.axisXLabelShow,
        this.axisXDataShow
      );
      this.drawAxisY(
        this.axisYLineShow,
        this.axisYLabelShow,
        this.axisYDataShow
      );
    } else {
      // scale axis
      let yMin = d3.min(this.data, (d) => d.x);
      yMin = Math.min(yMin, 0);
      const yMax = d3.max(this.data, (d) => d.x);

      this.y = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([this.innerHeight, 0]);

      this.x = d3
        .scaleBand()
        .domain(this.data.map((d) => d.y))
        .rangeRound([0, this.innerWidth])
        .padding(0.2);

      // axis
      const yAxis = d3.axisLeft(this.y);
      const xAxis = d3
        .axisBottom(this.x)
        .tickValues(this.x.domain().filter((d, i) => !(i % 9)));

      // position axis
      this.chart
        .append('g')
        .attr('transform', 'translate(0, 0)')
        .attr('class', 'axis')
        .call(yAxis);

      this.chart
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + this.y(yMin) + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'translate(-10,10)rotate(-45)')
        .style('text-anchor', 'end');

      // labels axis
      this.chart
        .append('text')
        .attr('text-anchor', 'init')
        .attr(
          'transform',
          'translate(' +
            this.innerWidth +
            ',' +
            (this.marginTop + this.innerHeight) +
            ')'
        )
        .text(this.axisXLabel);
      //.attr("class", this.axisXClass);

      this.chart
        .append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(0, -10)')
        .text(this.axisYLabel);
      //.attr("class", this.axisYClass);
    }
  }

  scale(id, s) {
    this.zoom.scaleBy(d3.select(id).transition().duration(750), s);
  }
  startZoomIn(e) {
    this.zoomIn = true;
    const id = '#svg_' + this.id;
    this.scale(id, 1.1);
    this.intervalZoomIn = setInterval(() => {
      this.scale(id, 1.1);
    }, 1e3);
  }
  endZoomIn(event) {
    if (this.zoomIn) {
      clearInterval(this.intervalZoomIn);
      this.zoomIn = false;
    }
  }
  moveZoomIn(e) {
    if (this.zoomIn) {
      this.endZoomIn(e);
    }
  }
  startZoomOut(e) {
    this.zoomOut = true;
    const id = '#svg_' + this.id;
    this.scale(id, 0.9);
    this.intervalZoomOut = setInterval(() => {
      this.scale(id, 0.9);
    }, 1e3);
  }
  endZoomOut(e) {
    if (this.zoomOut) {
      clearInterval(this.intervalZoomOut);
      this.zoomOut = false;
    }
  }
  moveZoomOut(e) {
    if (this.zoomOut) {
      this.endZoomOut(e);
    }
  }

  traslate(id, x, y) {
    d3.select(id).transition().duration(750).call(this.zoom.translateBy, x, y);
  }
  startPanLeft(e) {
    this.panLeft = true;
    const id = '#svg_' + this.id;
    this.traslate(id, -40, 0);
    this.intervalPanLeft = setInterval(() => {
      this.traslate(id, -40, 0);
    }, 1000);
  }
  endPanLeft(e) {
    if (this.panLeft) {
      clearInterval(this.intervalPanLeft);
      this.panLeft = false;
    }
  }
  movePanLeft(e) {
    if (this.panLeft) {
      this.endPanLeft(e);
    }
  }

  startPanRight(e) {
    this.panRight = true;
    const id = '#svg_' + this.id;
    this.traslate(id, 40, 0);
    this.intervalPanRight = setInterval(() => {
      this.traslate(id, 40, 0);
    }, 1000);
  }
  endPanRight(e) {
    if (this.panRight) {
      clearInterval(this.intervalPanRight);
      this.panRight = false;
    }
  }
  movePanRight(e) {
    if (this.panRight) {
      this.endPanRight(e);
    }
  }

  startPanUp(e) {
    this.panUp = true;
    const id = '#svg_' + this.id;
    this.traslate(id, 0, 40);
    this.intervalPanUp = setInterval(() => {
      this.traslate(id, 0, 40);
    }, 1e3);
  }
  endPanUp(e) {
    if (this.panUp) {
      clearInterval(this.intervalPanUp);
      this.panUp = false;
    }
  }
  movePanUp(e) {
    if (this.panUp) {
      this.endPanUp(e);
    }
  }

  startPanDown(e) {
    this.panDown = true;
    const id = '#svg_' + this.id;
    this.traslate(id, 0, -40);
    this.intervalPanDown = setInterval(() => {
      this.traslate(id, 0, -40);
    }, 1e3);
  }
  endPanDown(e) {
    if (this.panDown) {
      clearInterval(this.intervalPanDown);
      this.panDown = false;
    }
  }
  movePanDown(e) {
    if (this.panDown) {
      this.endPanDown(e);
    }
  }

  handleZoom(event) {
    d3.select('#' + this.id + ' g').attr('transform', event.transform);
  }

  resetZoom() {
    d3.select('svg').transition().call(this.zoom.scaleTo, 1);
  }

  centerZoom() {
    d3.select('#g_' + this.id)
      .transition()
      .call(this.zoom.translateTo, 0.5 * this.width, 0.5 * this.height);
  }

  responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width')),
      height = parseInt(svg.style('height')),
      aspect = width / height;
    var targetWidth = parseInt(container.style('width'));
    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('perserveAspectRatio', 'xMinYMid')
      .call(this.resize(targetWidth, aspect));

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  }
  // get width of container and resize svg to fit it
  resize(targetWidth: number, aspect: number) {
    //ar targetWidth = parseInt(container.style('width'));
    this.svg.attr('width', targetWidth);
    this.svg.attr('height', Math.round(targetWidth / aspect));
  }

  drawAxisX(showLine, showTitle, showLabels) {
    const xAxis = d3.axisBottom(this.x);
    if (showLine) {
    }

    if (showTitle) {
      this.chart
        .append('text')
        .attr('text-anchor', 'init')
        .attr(
          'transform',
          'translate(' + [this.innerWidth + 60, this.innerHeight] + ')'
        )
        .text(this.axisXLabel)
        .attr('class', this.axisXLabelClass)
        .attr('alignment-baseline', 'central');
    }
    if (showLabels) {
      const g = this.chart.append('g');
      let xMin = d3.min(this.data, (d) => d.x);
      xMin = Math.min(0, xMin);
      let xMax = d3.max(this.data, (d) => d.x);
      if (this.axisXBase) {
        xMax = Math.max(xMax, this.axisXBase);
      }
      g.append('text')
        .attr('y', (d) => this.innerHeight + 10)
        .attr('x', (d) => this.x(xMin))
        .text(xMin)
        .attr('class', (d) => this.axisYLabelTickClass)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible');

      g.append('text')
        .attr('y', (d) => this.innerHeight + 10)
        .attr('x', (d) => this.x(xMax))
        .text(xMax)
        .attr('class', (d) => this.axisYLabelTickClass)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible');
    }
  }

  drawAxisY(showLine, showTitle, showLabels) {
    const yAxis = d3.axisLeft(this.y);
    let xMin = d3.min(this.data, (d) => d.x);
    xMin = Math.min(0, xMin);
    if (showLine) {
      const g2 = this.svg.append('g');
      g2.append('line')
        .attr('class', this.axisYLineClass)
        .attr('x1', this.axisYMarginLeft)
        .attr('y1', this.axisYMarginTop)
        .attr('x2', this.axisYMarginLeft)
        .attr(
          'y2',
          this.marginTop +
            this.innerHeight -
            (this.barBandSteps - this.barBandWidth)
        );
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
        .attr('y', (d) => this.y(d.y) + this.barBandWidth / 2)
        .text((d) => d.y)
        .attr('class', (d) => this.axisYLabelTickClass)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible')
        .call(this.wrap, 130);
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

  barchart() {
    // bar
    const g = this.chart.append('g');

    if (this.orientation === 'horizontal') {
      let xMax = d3.max(this.data, (d) => d.x);
      if (this.axisXBase) {
        xMax = Math.max(this.axisXBase, xMax);
      }
      g.selectAll('rect1')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('x', (d) => this.x(Math.min(0, d.x)))
        .attr('y', (d) => this.y(d.y))
        .attr('rx', '6')
        .attr('ry', '6')
        .attr('fill', '#DBE3E3')
        .attr('width', (d) => Math.abs(this.x(xMax) - this.x(0)))
        .attr('height', this.barBandWidth);

      let bars = g
        .selectAll('rect2')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('x', (d) => this.x(Math.min(0, d.x)))
        .attr('y', (d) => this.y(d.y))
        .attr('rx', '6')
        .attr('ry', '6')
        .attr('fill', this.barColor)
        .attr('width', 0) // this is the initial value
        .attr('height', 0)
        .transition()
        .duration(1500) // time in ms
        .attr('width', (d) => Math.abs(this.x(d.x) - this.x(0)))
        .attr('height', this.barBandWidth);

      g.selectAll('rect2-texts')
        .data(this.data)
        .enter()
        .append('text')
        .attr('x', (d) => this.x(d.x) + 2)
        .attr('y', (d) => this.y(d.y) + this.barBandWidth / 2)
        .text((d) => d.x)
        .attr('class', 'label-bar-value')
        .attr('text-anchor', 'init')
        .attr('alignment-baseline', 'central')
        .attr('visibility', 'visible');
    } else {
      g.selectAll('rect')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('y', (d) => this.y(Math.max(0, d.x)))
        .attr('x', (d) => this.x(d.y))
        .attr('height', 0) // this is the initial value
        .transition()
        .duration(1500) // time in ms
        .attr('height', (d) => Math.abs(this.y(d.x) - this.y(0)))
        .attr('width', this.x.bandwidth());
    }
  }

  legend() {
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
            this.legendSpaceLabel
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
        .attr('y', (d, i) => this.legendY)
        // tslint:disable-next-line: max-line-length
        .attr(
          'x',
          (d, i) =>
            this.legendX + i * this.legendSquareWidth + i * this.legendSpaceX
        ) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('width', this.legendSquareWidth)
        .attr('height', this.legendSquareHeight)
        .style('fill', (d, i) => (i === 4 ? 'url(#texturaPremissa)' : color(d)))
        .text((d) => d)
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');

      g.selectAll('text')
        .data(this.legendNames)
        .enter()
        .append('text')
        .attr('y', (d, i) => this.legendY + this.legendSquareHeight / 2)
        // tslint:disable-next-line: max-line-length
        .attr(
          'x',
          (d, i) =>
            this.legendX +
            (i + 1) * this.legendSquareWidth +
            i * this.legendSpaceX +
            this.legendSpaceLabel
        ) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('class', this.legendLabelClass)
        .text((d) => d)
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');
    }
  }
  average() {
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      sum += this.data[i].x;
    }
    return sum / this.data.length;
  }

  createLineVertical(label, val, round, style) {
    const g = this.chart.append('g');

    g.append('line')
      .attr('class', style)
      .attr('x1', this.x(val))
      .attr('y1', 0)
      .attr('x2', this.x(val))
      .attr('y2', this.innerHeight);

    g.append('text')
      .attr('class', this.lineMeanLabelClass)
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + this.x(val) + ',0) rotate(0)')
      .text(label + val.toFixed(round));
  }

  createLineHorizontal(label, val, round, style) {
    const g = this.chart.append('g');

    g.append('line')
      .attr('class', style)
      .attr('x1', 0)
      .attr('y1', this.y(val))
      .attr('x2', this.innerWidth)
      .attr('y2', this.y(val));

    g.append('text')
      .attr('text-anchor', 'end')
      .attr(
        'transform',
        'translate(' + [this.innerWidth, this.y(val)] + ') rotate(0)'
      )
      .text(label + val.toFixed(round));
  }
}
