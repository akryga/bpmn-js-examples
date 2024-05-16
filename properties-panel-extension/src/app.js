import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';

import './style.less';

import BpmnColorPickerModule from 'bpmn-js-color-picker';
import ruTranslateModule from './ru-translate/ru-translate'

import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import tinySvg from 'tiny-svg';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import TaskPropertiesProviderModule from './provider/taskparts';
import userTaskModdleDescriptor from './descriptors/activitiUserTask.json';

import {
  debounce
} from 'min-dash';

import diagramXML from '../resources/newDiagram.bpmn';
import formSchema from '../resources/newForm.json';

import { Form } from '@bpmn-io/form-js';

const formEditor = new Form({
  container: document.querySelector('#form-editor'),
});

function createForm(){
  openForm(formSchema)
}

async function openForm(schema){

  try{
    await formEditor.importSchema(formSchema);  
  }
  catch(e){
    console.error(e)
  }
}

var container = $('#js-drop-zone');

// const themeController = ;
document.body.addEventListener(
  "clickControl",
  ({ detail: { control, value } }) => {

    // if (control === "phoenixTheme") {
    //   // value will be localStorage theme value (dark/light/auto)
    //   const mode = value === 'auto' ? window.phoenix.utils.getSystemTheme() : value;
    //   console.log(mode) 
    //   console.log('defaultFillColor: ', $('.bg-body-highlight').css('background-color'));
    //   console.log('defaultStrokeColor: ', $('body').css('color'));
    //   var eReg = bpmnModeler.get('elementRegistry'),
    //   moddle = bpmnModeler.get('moddle');

    //   var cnv = bpmnModeler.get('canvas');
      

    //   if(eReg)
    //     {
    //       console.log(eReg)
    //       Object.keys(eReg._elements).map( e => eReg.get(e)).forEach(e => {
    //         cnv.removeMarker(e, mode==='dark'?'light':'dark')
    //         cnv.addMarker(e, mode);
    //       });
    //     }
    //   // your code here
    //   // console.log('background-color: '+$('body').css('background-color'))
    //   // console.log('color: '+$('body').css('color'))

    //   // var modeling = bpmnModeler.get('modeling');
    //   // var eReg = bpmnModeler.get('elementRegistry');
    //   // var elements = [];
    //   // modeling.setColor([], { 
    //   //   defaultFillColor: $('body').css('background-color'),
    //   //   defaultStrokeColor: $('body').css('color')
    //   // });
    //   // var canvas = bpmnModeler.get('canvas');
    //   // var overlays = bpmnModeler.get('overlays');
    //   // overlays.updateViewbox(canvas.viewbox());
    //   // var eventBus = bpmnModeler.get('eventBus');
    //   // eventBus.fire('canvas.viewbox.changed', { viewbox: canvas.viewbox() });
    //   // bpmnModeler = initModeler();
    // }
  }
);

async function createNewDiagram() {
  // openDiagram(diagramXML);
  try {
    await bpmnModeler.createDiagram();
    var eReg = bpmnModeler.get('elementRegistry');

    var procObj = eReg.get('Process_1').businessObject,
      startObj = eReg.get('StartEvent_1').businessObject;
    
    var moddle = bpmnModeler.get('moddle');    
    
    procObj.id = moddle.ids.nextPrefixed('Process_', procObj);  
    procObj.name = "New "+ procObj.id.toLowerCase();
    eReg.updateId('Process_1', procObj.id);
   
    startObj.id = moddle.ids.nextPrefixed('StartEvent_', startObj);
    eReg.updateId('StartEvent_1', startObj.id);
    
    // var ootElement = canvas.getRootElement(),
    // rootElementGfx = canvas.getGraphics(rootElement);

    // var eventBus = bpmnModeler.get('eventBus');
    bpmnModelerEventBus.on('elements.changed', (e) => {
      console.log(e)
    });

    container
      .removeClass('with-error')
      .addClass('with-diagram');
  }
  catch(err){
    container
      .removeClass('with-diagram')
      .addClass('with-error');

    container.find('.error pre').text(err.message);
  }
}

async function openDiagram(xml) {

  try {

    await bpmnModeler.importXML(xml);

    container
      .removeClass('with-error')
      .addClass('with-diagram');
  } catch (err) {

    container
      .removeClass('with-diagram')
      .addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {

      var xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}


// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}





const bpmnModeler = new BpmnModeler({
  container: '#js-canvas',
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    TaskPropertiesProviderModule,
    BpmnColorPickerModule,
    ruTranslateModule
  ],
  moddleExtensions: {
    magic: userTaskModdleDescriptor
  },
  bpmnRenderer: {
    defaultFillColor: 'var(--phoenix-body-bg)',//$('body').css('background-color'),
    defaultStrokeColor: 'var(--phoenix-body-color)'//$('body').css('color')
  }
});

const bpmnModelerEventBus = bpmnModeler.get('eventBus');
bpmnModelerEventBus.on('userTask.addAssignee', (e) => {
  // const addAssigneeModal = document.getElementById('userTaskAddAsigneeModal'); 
  const   addAssigneeModal = new bootstrap.Modal('#userTaskAddAsigneeModal', {})

  $('#userTaskAddAsigneeModal .modal-body').html(
    '<pre>'+JSON.stringify(e, null, 3)+'</pre>'+
    '<pre>'+JSON.stringify(e, null, 3)+'</pre>'+
    '<pre>'+JSON.stringify(e, null, 3)+'</pre>'
  );
  addAssigneeModal.show();
  console.log('userTask.addAssignee', e)
});

// bootstrap diagram functions

$(function() {
  //for debug purposes
  $('.buttons > li:last-child').on('click', async (e)=>{
    // createForm();
    bpmnModeler.saveXML({ format: true }).then( p => {
      console.log(p.xml)
    }).catch(console.error)
  });

  $('#js-create-diagram').on('click',function(e) {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  $('.buttons a').on('click', function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  var exportArtifacts = debounce(async function() {

    try {

      const { svg } = await bpmnModeler.saveSVG();

      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving SVG: ', err);

      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {

      const { xml } = await bpmnModeler.saveXML({ format: true });

      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving diagram: ', err);

      setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  bpmnModeler.on('commandStack.changed', exportArtifacts);
});
