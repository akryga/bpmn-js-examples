import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';

import './style.less';

import BpmnColorPickerModule from 'bpmn-js-color-picker';
import ruTranslateModule from './ru-translate/ru-translate'

import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import taskPropertiesProviderModule from './provider/taskparts';
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



async function createNewDiagram() {
  // openDiagram(diagramXML);

  try {
    await bpmnModeler.createDiagram();

    var procObj = bpmnModeler.get('elementRegistry').get('Process_1').businessObject,
      startObj = bpmnModeler.get('elementRegistry').get('StartEvent_1').businessObject;
    
    var moddle = bpmnModeler.get('moddle');      
    procObj.id = moddle.ids.nextPrefixed('Process_', procObj);
    startObj.id = moddle.ids.nextPrefixed('StartEvent_', startObj);

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

const themeController = document.body;

themeController.addEventListener(
  "clickControl",
  ({ detail: { control, value } }) => {

    if (control === "phoenixTheme") {
      // value will be localStorage theme value (dark/light/auto)
      const mode = value === 'auto' ? window.phoenix.utils.getSystemTheme() : value;
      console.log(mode) 
      // your code here

    }
  }
);

var bpmnModeler = new BpmnModeler({
  container: '#js-canvas',
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    taskPropertiesProviderModule,
    BpmnColorPickerModule,
    ruTranslateModule
  ],
  moddleExtensions: {
    magic: userTaskModdleDescriptor
  },
  // bpmnRenderer: {
  //   defaultFillColor: $('body').css('background-color'),
  //   defaultStrokeColor: $('body').css('color'),
  //   defaultTextColor: 'red'
  // }
});

// bootstrap diagram functions

$(function() {
  bpmnModeler.repa
  // console.log('background-color: '+$('body').css('background-color'))
  // console.log('color: '+$('body').css('color'))

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
