# HqAdmin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Dicrectives(指令)

## hqPrint(打印):

### code:

`<p class="lead" hqPrint #printer="hq-print">打印内容</p>`
`<button type="button" (click)="printer.print()">点击打印</button>`

### class:

`print-page`:分页打印，用于将多个内容分页打印使用；
`no-print`:打印时隐藏内容；

# Pipes(通道)

## sDatetime(标准日期和时间)

### code:

`<div>{{ now|sDatetime }}</div>`

### result:

2017/05/18 14:45:19

## sDate(标准日期)

### code:

`<div>{{ now|sDate }}</div>`

### result:

2017/05/18

## sTime(标准时间)

### code:

`<div>{{ now|sTime }}</div>`

### result:

14:45:19