import '../../exports/common/progress-bar';
import { BaseElement } from '../../base';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

export class ResultItem extends BaseElement {
  @property({ type: String })
  resultName = '';

  @property({ type: Number })
  currentStep = 907;

  @property({ type: Number })
  totalSteps = 1000;

  render() {
    return html`
      <div class="grid grid-cols-3 rounded-lg border-2 border-neutral-600 p-4">
        <span class="col-span-1 text-white">${this.resultName}</span>
        <progress-bar
          class="col-span-2"
          currentStep="${this.currentStep}"
          totalSteps="${this.totalSteps}"
        ></progress-bar>
      </div>
    `;
  }
}
