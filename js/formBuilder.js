// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var FormBuilder = function(){
  return new FormBuilder.fn.init();
}
/**
 * FormBuilder prototype
 */

 FormBuilder.fn = FormBuilder.prototype = {
  /**
   *
   * New FormBuilder Constructor 
   */
  init: function(){
    var self = this;
    this.draggedFields = $(".selectorField");
    this.droppedFields = $(".droppedFields");
    this.ctrl_index = 0 ;

    this.makeDraggable();
    this.makeDroppable();
    this.makeSortable();
    /* compile templates in array of templates*/
    this.templates = {};
    this.templates.common = Handlebars.compile($("#control-customize-template").html());
    
    /* HTML Templates required for specific implementations mentioned below */
    this.templates.textbox = Handlebars.compile($("#textbox-template").html());
    this.templates.passwordbox = Handlebars.compile($("#textbox-template").html());
    this.templates.combobox = Handlebars.compile($("#combobox-template").html());
    this.templates.selectmultiplelist = Handlebars.compile($("#combobox-template").html());
    this.templates.radiogroup = Handlebars.compile($("#combobox-template").html());
    this.templates.checkboxgroup = Handlebars.compile($("#combobox-template").html());
    this.templates.text = Handlebars.compile($("#text-template").html());
    this.templates.date = Handlebars.compile($("#date-template").html());    

  },
  
  makeDraggable: function(){
    this.draggedFields.draggable({connectToSortable: this.droppedFields, helper: "clone",stack: "div",cursor: "move", cancel: null  });
  },

  makeDroppable: function(){
    var form = this;
    this.droppedFields.droppable({
      activeClass: "activeDroppable",
      hoverClass: "hoverDroppable",
      drop: function( event, ui ) {
        // if it is already dropped before skip this code
        if (!ui.draggable.hasClass('droppedFields')){
          draggable = ui.draggable;
          //add class droppedFields
          draggable.addClass('droppedFields');
          // remove class selectorField
          draggable.removeClass('selectorField');
          //add id attribute 
          draggable.attr('id' , "CTRL-DIV-"+(form.ctrl_index++));
          console.log(ui.draggable);
          /* Once dropped, attach the customization handler to the control */
          form.setControlCustomization(draggable);
          }
      }
    });    
  },

  makeSortable: function(){
    this.droppedFields.sortable({
        cancel: null, // Cancel the default events on the controls      
        connectWith: ".droppedFields"
    }).disableSelection();
  },

  setControlCustomization: function(draggable){
    var form = this;

    draggable.click(function () {
      var me = $(this)
      var ctrl = me.find("[class*=ctrl]")[0];
      var ctrl_type = $.trim(ctrl.className.match("ctrl-.*")[0].split(" ")[0].split("-")[1]);
      console.log(ctrl_type);
      form.customizeControl(ctrl_type, this.id);

  });
  },

  customizeControl: function(ctrl_type, ctrl_id){
    var ctrl_params = {};

    /* Load the specific templates */
    var specific_template = templates[ctrl_type];
    if(typeof(specific_template)=='undefined') {
      specific_template = function(){return ''; };
    }
    var modal_header = $("#"+ctrl_id).find('.control-label').text();
    
    var template_params = {
      header:modal_header, 
      content: specific_template(ctrl_params), 
      type: ctrl_type,
      forCtrl: ctrl_id
    }
    
    // Pass the parameters - along with the specific template content to the Base template
    var s = templates.common(template_params)+"";
    
    
    $("[name=customization_modal]").remove(); // Making sure that we just have one instance of the modal opened and not leaking
    $('<div id="customization_modal" name="customization_modal" class="modal hide fade" />').append(s).modal('show');
    

  }

  
}

FormBuilder.fn.init.prototype = FormBuilder.fn;
