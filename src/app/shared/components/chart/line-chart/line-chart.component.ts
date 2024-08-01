import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  HostListener,
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

  @Input()
  private tooltipShow: any;
  private tooltipOpacity: any;
  private tooltipDurationMouseOver: any;
  private tooltipDurationMouseOut: any;
  private tooltipClass: any;

  private screenHeight: number;
  private screenWidth: number;

  private barBandWidth: any;
  private barBandSteps: any;

  innerWidth: number;
  innerHeight: number;
  svg: any;
  chart: any;
  x: any;
  y: any;

  tipBox: any;
  tooltip: any;
  tooltipLine: any;
  pointSelected: number;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor() {
    this.width = 800;
    this.height = 450;
    this.marginTop = 50;
    this.marginRight = 70;
    this.marginBottom = 50;
    this.marginLeft = 180;

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

    this.tooltipShow = true;
    this.tooltipOpacity = 0.8;
    this.tooltipDurationMouseOver = 200;
    this.tooltipDurationMouseOut = 500;
    this.tooltipClass = 'chart_tooltip';
    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'customTooltip')
      .attr('class', this.tooltipClass)
      .style('opacity', 0);
  }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

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
    if (this.data.length < 5) {
      this.barBandWidth = 55;
      this.barBandSteps = 135;
    }

    if (this.data.length > 20) {
      this.height += 120;
      this.width += 100;
    }

    const barBandPadding =
      (this.barBandSteps - this.barBandWidth) / this.barBandSteps;
    this.width =
      this.data.length * this.barBandWidth +
      (this.data.length + 1) * (this.barBandSteps - this.barBandWidth) +
      this.marginLeft +
      this.marginRight;

    this.innerWidth = this.width - this.marginLeft - this.marginRight;
    this.innerHeight = this.height - this.marginTop - this.marginBottom;
    // svg
    this.svg = d3
      .select('#chart_line_' + this.id)
      .append('svg')
      .attr('id', 'svg_line_' + this.id)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('width', '100%')
      .attr('preserveAspectRatio', 'xMinYMin');
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

    let xMin = d3.min(this.data, (d) => d.x);
    xMin = Math.min(xMin, 0);
    const xMax = d3.max(this.data, (d) => d.x);
    this.x = d3.scaleLinear().domain([xMin, xMax]).range([0, this.innerWidth]);

    this.y = d3
      .scaleBand()
      .domain(this.data.map((d) => d.y))
      .rangeRound([0, this.innerHeight])
      .padding(barBandPadding);

    this.createTooltip(this.chart, this.x, this.data);

    // axis

    const xAxis = d3.axisBottom(this.x);
    this.chart
      .append('g')
      .classed('axis-line', true)
      .attr('transform', 'translate(0,' + this.innerHeight + ')')
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'translate(-10,10)rotate(-30)')
      .style('text-anchor', 'middle');

    //this.drawAxisX(this.axisXLineShow, this.axisXLabelShow, this.axisXDataShow);
    this.drawAxisY(this.axisYLineShow, this.axisYLabelShow, this.axisYDataShow);
  }

  drawAxisX(showLine, showTitle, showLabels) {
    const xAxis = d3.axisBottom(this.x);

    let yMin = d3.min(this.data, (d) => d.x);
    yMin = Math.min(0, yMin);

    if (showLine) {
      const g2 = this.svg.append('g');
      g2.append('line')
        .attr('class', this.axisYLineClass)
        .attr('x1', this.marginLeft)
        .attr('y1', this.marginTop + this.innerHeight)
        .attr('x2', this.marginLeft + this.innerWidth)
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
        .attr('y', (d) => this.innerHeight + 17)
        .attr('x', (d) => this.x(d.x))
        .attr('transform', (d) => {
          'translate(' +
            this.x(d.x) +
            ',' +
            (this.innerHeight + 17) +
            ') rotate(-45)';
        })
        .text((d, i) => (i % 5 == 0 ? d.x : ''))
        .attr('class', (d) => this.axisYLabelTickClass)

        .attr('class', 'label-axis-tick');
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
        .text((d, i) => (this.data.length <= 12 ? d.y : i % 4 == 0 ? d.y : ''))
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

  createTooltip(canvas, x, data) {
    this.tooltipLine = canvas.append('g');
    this.tooltipLine.append('line');

    this.tipBox = canvas
      .append('rect')
      .attr('id', 'tipbox' + this.id)
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight)
      .attr('transform', 'translate(0,0)')
      .attr('opacity', 0)
      .on('mousemove', (event) => this.drawTooltip(data, x, event))
      .on('mouseout', () => this.removeTooltip(this.tooltip, this.tooltipLine));
  }

  removeTooltip(tooltip, tooltipLine) {
    tooltip
      .transition()
      .duration(this.tooltipDurationMouseOut)
      .style('opacity', 0);
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
  }

  setTooltipPosition(event) {
    const { width: toolTipWidth, height: toolTipHeight } = this.tooltip
      .node()
      .getBoundingClientRect();

    let toolTipX = event.pageX;
    let toolTipY = event.pageY;

    if (toolTipX + toolTipWidth > this.screenWidth) {
      toolTipX -= toolTipWidth;
    }

    if (toolTipY + toolTipHeight > this.screenHeight) {
      toolTipY -= toolTipHeight;
    }

    this.tooltip.style('left', `${toolTipX}px`).style('top', `${toolTipY}px`);
  }

  drawTooltip(datas, scaleX, event) {
    let near;
    let diff = this.innerWidth;
    const pos = d3.pointer(event);
    const x = pos[0];

    const xPosition = scaleX.invert(x);

    datas.forEach((d, index) => {
      if (Math.abs(this.x(xPosition) - this.x(d.x)) < diff) {
        diff = Math.abs(this.x(xPosition) - this.x(d.x));
        near = d.x;
        this.pointSelected = index;
      }
    });

    this.tooltipLine
      .selectAll('line')
      .attr('class', 'axis-line')
      .attr('x1', scaleX(near))
      .attr('x2', scaleX(near))
      .attr('y1', 0)
      .attr('y2', this.innerHeight);

    this.tooltip
      .transition()
      .duration(this.tooltipDurationMouseOver)
      .style('opacity', this.tooltipOpacity);

    const message = datas[this.pointSelected].tooltip;
    this.tooltip.html(message);
    this.setTooltipPosition(event);
  }
}
