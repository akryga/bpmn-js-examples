import { html } from 'htm/preact';

import { TextFieldEntry, ListEntry,   CollapsibleEntry, SelectEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

var classnames = require('classnames');
var jsxRuntime = require('preact/jsx-runtime');

export default function(element) {
  // console.log(element);
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

  const setValue = (value) => { return modeling.updateProperties(element, { formKey: value }) };

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
  //  const modeler = useService('modeler');
  const commandStack = useService('commandStack');
  
  const onAddAssignee = function onAdd(){
    modeling._eventBus.fire('userTask.addAssignee', {
      // element: element, 
      businessObject: element.businessObject,
      assignee: element.businessObject.assignee,
      candidateUsers: element.businessObject.candidateUsers,
      candidateGroups : element.businessObject.candidateGroups
    });

    // var eBus = commandStack.get('eventBus');
    console.log(modeling._eventBus, element, getValue())
  };

  const getValue = () => {
    var ret = element.businessObject.assignee?[element.businessObject.assignee]: [];
    if(ret.length>0)
      return ret;
    ret = ret.concat(element.businessObject.candidateUsers?element.businessObject.candidateUsers.split(','):[]);
    ret = ret.concat(element.businessObject.candidateGroups?element.businessObject.candidateGroups.split(','):[]);
    // console.log(ret)
    return ret;
  };

  const setValue = (value) => { return modeling.updateProperties(element, { assignee: value }) };
// console.log(element)
  return html`<${ListEntry}
    id=${ id }
    element=${ element }
    onAdd=${ onAddAssignee }
    description=${ translate('Apply a black magic Assignee') }
    label=${ translate('Assignee') }
    items=${ getValue() }
    component=${ Candidate }
    sortedItems=${ getValue() }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
    tooltip=${ translate('Check available Assignee in the Assigneebook.') }
  />`;
}

function Candidate(props) {
  const {
    element,
    id: idPrefix,
    index,
    item: extension,
    open
  } = props;

  const translate = useService('translate');

  const id = `${ idPrefix }-extension-${ index }`;

  var placeholderLabel = translate('<empty>');
  return jsxRuntime.jsx("div", {
    // title: extension || placeholderLabel,
    id: id,
    class: classnames('assignee-candidate', !extension && 'empty'),
    children: [extension || placeholderLabel]
  });
}


function Priority(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => { return element.businessObject.priority || '' };

  const PriorityOptions = [
    {value:1, label: translate("Critical")},
    {value:2, label: translate("High")},
    {value:3, label: translate("Normal")}];
  
  const setValue = (value) => { return modeling.updateProperties(element, { priority: value }) };

  const getOptions = () => {
    return [
      { value: 0, label: '<none>' },
      ...PriorityOptions
    ];
  };

  var ret = html`<${SelectEntry}
  id=${ id }
  element=${ element }
  description=${ translate('Apply a black magic Priority') }
  label=${ translate('Priority') }
  getValue=${ getValue }
  setValue=${ setValue }
  getOptions=${ getOptions }
  debounce=${ debounce }
  tooltip=${ translate('Check available Priority in the Prioritybook.') }/>`;
  //console.log(ret);
  return ret;
}