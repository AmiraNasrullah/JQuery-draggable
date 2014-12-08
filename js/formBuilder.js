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
    // this.makeDroppable();
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
    this.droppedFields.droppable({
      activeClass: "activeDroppable",
      hoverClass: "hoverDroppable",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        var draggable = ui.draggable;       
        draggable = draggable.clone();
        console.log(draggable);
        console.log(this.droppedFields);
        draggable.removeClass("selectorField");
        draggable.addClass("droppedField");
        draggable[0].id = "CTRL-DIV-"+(this.ctrl_index++); // Attach an ID to the rendered control
        draggable.appendTo(this.droppedFields); 
        this.makeDraggable();
      }
    });   
  },
  makeSortable: function(){
    this.droppedFields.sortable({
        cancel: null, // Cancel the default events on the controls      
        items: "div",
        connectWith: ".droppedFields"
        
    }).disableSelection();
  }
  
}

FormBuilder.fn.init.prototype = FormBuilder.fn;
