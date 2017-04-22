import { Component, OnInit, Host, ViewChild } from '@angular/core';
import { ConfigService } from "./config.service";
import { Tree, NodeSelectedEvent, FoldingType, TreeModel, TreeModelSettings } from 'ng2-tree';
import { TreeStatus } from "ng2-tree/src/tree.types";
import { HqAlerter } from 'app/shared/directives';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {

  public tree: ConfigNode;
  public currentNode: ConfigNode;
  private currentTree: Tree;
  private editable: boolean = true;
  @ViewChild(HqAlerter)
  private alerter: HqAlerter;

  constructor(
    private service: ConfigService,
  ) { }

  private onDelete($event: MouseEvent) {
    if (this.currentTree.children && this.currentTree.children.length > 0) {
      this.alerter.warn("请先删除当前节点下面的所有子节点！");
      return false;
    }
    if (!confirm("确定要删除当前节点吗？")) return false;
    this.service
      .deletePath(this.currentNode.getFullPath())
      .then(resp => {
        let node = this.currentTree.parent;
        this.currentTree.removeItselfFromParent();
        this.currentTree = node;
        this.currentNode = node.node as ConfigNode;
        this.editable = true;
      })
      .catch(err => this.alerter.error(err));
  }

  private onSubmit($event) {
    var handle = this.editable ? this.service.setValue : this.service.createPath;
    handle.call(this.service, this.currentNode.getFullPath(), this.currentNode.nodeValue)
      .then(resp => {
        if (!this.editable) {
          this.currentTree.addChild(new Tree(this.currentNode));
          this.editable = true;
        }
        this.alerter.success("保存成功！");
      })
      .catch(err => this.alerter.error(err));
    return false;
  }

  private onCreate($event: MouseEvent) {
    this.editable = false;
    var newCfg = new ConfigNode('', this.currentNode.getFullPath());
    this.currentNode = newCfg;
  }

  private onRefresh($event: MouseEvent) {
    var btn = $event.target as HTMLButtonElement;
    btn.disabled = true;
    let children = this.currentTree.children;
    children.slice(0, children.length).forEach(node => this.currentTree.removeChild(node));
    this.loadChildNode(this.tree, this.currentTree)
      .then(() => {
        btn.disabled = false;
        this.editable = true;
        this.alerter.success("刷新成功！");
      })
      .catch(err => {
        btn.disabled = false;
        this.alerter.error(err);
      });
  }

  private handleSelected($event: NodeSelectedEvent) {
    this.editable = true;
    this.currentNode = $event.node.node as ConfigNode;
    this.currentTree = $event.node;
    if (!this.currentNode.nodeValue) {
      this.service
        .getValue(this.currentNode.getFullPath())
        .then(resp => this.currentNode.nodeValue = resp)
        .catch(err => console.error(err));
    }
    if (!$event.node.children) {
      this.loadChildNode(this.currentNode, $event.node);
    }
    $event.node.switchFoldingType();
  }

  private loadChildNode(cfg: ConfigNode, tree: Tree): Promise<void> {
    let parentPath = cfg.getFullPath();
    return this.service
      .loadChildNode(parentPath)
      .then(data => {
        let children = data.map(path => new ConfigNode(path, parentPath));
        children.forEach(item => tree.addChild(new Tree(item)));
        tree.node._foldingType = FoldingType.Expanded;
      })
      .catch(err => this.alerter.error(err));
  }

  ngOnInit() {
    this.tree = new ConfigNode("/Configuration", "");
    this.currentNode = this.tree;
  }

}

class ConfigNode implements TreeModel {

  children: TreeModel[];
  loadChildren: (callback: (children: TreeModel[]) => void) => void;
  settings: TreeModelSettings;
  _status: TreeStatus;
  _foldingType: FoldingType;

  constructor(
    public value: string,
    public path?: string,
    public nodeValue?: string,
  ) { }

  public getFullPath(): string {
    return this.path.concat(`/${this.value}`).replace(/\/+/g, "/");
  }
}
