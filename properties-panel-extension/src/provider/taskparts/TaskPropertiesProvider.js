// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import userTaskProps from './parts/UserTaskProps';
import serviceTaskProps from './parts/ServiceTaskProps';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function TaskPropertiesProvider(propertiesPanel, injector, translate) {

  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function(element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups) {

      // Add the "magic" group
      if (is(element, 'bpmn:UserTask')) {
        groups.push(createUserTaskGroup(element, injector, translate));
      }
      if (is(element, 'bpmn:ServiceTask')) {
        groups.push(createServiceTaskGroup(element, injector, translate));
      }
      return groups;
    };
  };


  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

TaskPropertiesProvider.$inject = [ 'propertiesPanel', 'injector', 'translate' ];

// Create the custom magic group
function createUserTaskGroup(element, injector, translate) {

  // create a group called "Magic properties".
  const propsGroup = {
    id: 'userGroup',
    label: translate('User Task properties'),
    entries: userTaskProps(element),
    tooltip: translate('Make sure you know what you are doing!')
  };

  return propsGroup;
}

// Create the custom service group
function createServiceTaskGroup(element, injector, translate) {

  // create a group called "Magic properties".
  const propsGroup = {
    id: 'serviceGroups',
    label: translate('Service Task properties'),
    entries: serviceTaskProps(element),
    tooltip: translate('Make sure you know what you are doing!')
  };

  return propsGroup;
}