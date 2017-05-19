# 代码编写准则
## （Tables）表格:
- 统一使用table table-striped table-borderd类；
- 所有表头居中；
- 序号、操作、时间、车牌号、手机号等一些等宽字段（长度固定）居中显示（text-center）；
- 金额、计时居右显示（text-right）；
- 所有td、th都不换行（white-space: nowrap）；
- 所有表格统一使用thead（表头）、tbody（主体）和tfoot(表尾，选用）；
- 过长的字段需要截取显示；
## （Forms)表单：
- 所有组件使用默认大小，删除sm样式；
- 查询按钮添加btn-primary样式，其它待定；
- 标签与文本框要垂直对齐；
## 其它
- 金额以元显示，可以使用管道（centToYuan）；
- 统一使用bootstrap栅格布局，禁止使用表格布局；

# Dicrectives(指令)

## hqError(表单验证及错误提示)

>默认添加"*请输入`{name}`*"的placeholder,其中`{name}`为hqError绑定的值；

>必须添加formControlName属性，且包含在一个有效的formGroup中；

### code:
```
this.form = this.formBuilder.group({
    'username': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
    ]],
    'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
    ]],
});
```
```
<form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit()">
    <input hqError="用户名" [errors]="{minLength:'{name}太短了'}" formControlName="username">
    <input hqError="密码" type="password" formControlName="password">
</form>
```
### inputs:

`name:string(hqErrors)`：可以为空，字段名称，用于错误提示，也用于自定义错误提示时`{name}`的绑定；

`errors:object`：自定义错误消息，键为错误类型，值为错误提示消息，比如`{required:'{name}不能为空',minLength:'长度不满足需求'}`;

### methods:

`validate`：validate(compulsive = true):boolean
- 描述：验证当前控件的值是否有效；
- 参数：compulsive：强制验证，忽略控件的状态，为false时只验证值已经变更的控件；
- 返回值：有效返回true，否则返回false

***

## hqPrint(打印):

### code:

```
<div hqPrint #printer="hq-print">
    <div>打印消息</div>
    <div class="no-print print-page">这条打印消息将会隐藏</div>
    <div>这条打印消息将换页打印</div>
</div>
<button type="button" (click)="printer.print()">点击打印</button>
```

### class:

`print-page`：分页打印，用于将多个内容分页打印使用；

`no-print`：打印时隐藏内容；

***

## hqSpinner(旋转动画、加载动画)：
>如果指令当前使用对象为按钮对象，则在加载时禁用当前按钮对象；

### code:

```
<button type="button" [hqSpinner]="loading">提交</button>
```

### inputs:

`loading:boolean`：是否显示加载动画；

`size:number`：动画显示大小；

# Pipes(通道)

## centToYuan(分转元)
>用于将货币金额从分转换为元，并且格式化，保留两位有效数字，采用四舍六入算法；

### code:
```
<div>{{ 10037.5|centToYuan }}</div>
<div>{{ 10034.5|centToYuan }}</div>
<div>{{ 1008|centToYuan }}</div>
```
### result:
```
100.38
100.34
10.08
```

## sDatetime(标准日期和时间)

### code:
```
<div>{{ now|sDatetime }}</div>
```
### result:
```
2017/05/18 14:45:19
```
***
## sDate(标准日期)
### code:
```
<div>{{ now|sDate }}</div>
```
### result:
```
2017/05/18
```
***
## sTime(标准时间)
### code:
```
<div>{{ now|sTime }}</div>
```
### result:
```
14:45:19
```