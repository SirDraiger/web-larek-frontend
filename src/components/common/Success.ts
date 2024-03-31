import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

export interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
  protected _total: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, action: ISuccessActions) {
    super(container);

    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this._closeButton.addEventListener('click', action.onClick);
  }

  set total(value: number) {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}