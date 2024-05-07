import translations from './ru';

const ruTranslateModule = {
  translate: [ 'value', (template, replacements) => {
    replacements = replacements || {};
  
    // Translate
    template = (translations)[template] || template;
  
    // Replace
    return template.replace(/{([^}]+)}/g, function(_, key) {
      return replacements[key] || '{' + key + '}';
    });
  } ]
}

export default ruTranslateModule;
