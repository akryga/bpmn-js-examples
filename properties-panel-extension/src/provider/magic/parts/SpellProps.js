import { html } from 'htm/preact';

import { TextFieldEntry, TextAreaEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'formKey',
      element,
      component: FormKey,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'assignee',
      element,
      component: Assignee,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'priority',
      element,
      component: Priority,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function FormKey(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => { return element.businessObject.formKey || '' };

  const setValue = value => { return modeling.updateProperties(element, { formKey: value }) };

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Apply a black magic spell') }
    label=${ translate('Form Key') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
    tooltip=${ translate('Check available spells in the spellbook.') }
  />`;
}

function Assignee(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => { return element.businessObject.assignee || '' };

  const setValue = value => { return modeling.updateProperties(element, { assignee: value }) };

  return html`<${TextAreaEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Apply a black magic Assignee') }
    label=${ translate('Assignee') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
    tooltip=${ translate('Check available Assignee in the Assigneebook.') }
  />`;
}

function Priority(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => { return element.businessObject.priority || '' };

  const setValue = value => { return modeling.updateProperties(element, { priority: value }) };

  return html`<${TextFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Apply a black magic Priority') }
    label=${ translate('Priority') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
    tooltip=${ translate('Check available Priority in the Prioritybook.') }
  />`;
}