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
    this.templates.namebox = Handlebars.compile($("#textbox-template").html());
    this.templates.emailbox = Handlebars.compile($("#textbox-template").html());
    this.templates.combobox = Handlebars.compile($("#combobox-template").html());
    this.templates.selectmultiplelist = Handlebars.compile($("#combobox-template").html());
    this.templates.radiogroup = Handlebars.compile($("#combobox-template").html());
    this.templates.checkboxgroup = Handlebars.compile($("#combobox-template").html());
    this.templates.text = Handlebars.compile($("#text-template").html());
    this.templates.date = Handlebars.compile($("#date-template").html());    

  },
  
  makeDraggable: function(){
    this.draggedFields.draggable({
        connectToSortable: this.droppedFields, 
        helper: "clone",
        stack: "div",
        cursor: "move",
        cancel: null  
      });
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
        connectWith: ".droppedFields",
        placeholder: "placeholder"
    }).disableSelection();
  },

  setControlCustomization: function(draggable){
    var form = this;
    //add on click listner
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
    var form = this;
    /* Load the specific templates */
    var ctrl_template = this.templates[ctrl_type];
    if(typeof(ctrl_template)=='undefined') {
      ctrl_template = function(){return ''; };
    }
    var modal_header = $("#"+ctrl_id).find('.control-label').text();
    var template_params = {
      header:modal_header, 
      content: ctrl_template(ctrl_params), 
      type: ctrl_type,
      id: ctrl_id
    }
 
    // Pass the parameters - along with the specific template content to the Base template
    var s = this.templates.common(template_params)+"";
    
    // console.log(s);
    $("[name=customization_modal]").remove(); // Making sure that we just have one instance of the modal opened and not leaking

    $('<div id="customization_modal" name="customization_modal" class="modal hide fade" />').append(s).modal('show');// Hide modal if "Go back" is pressed
   
    setTimeout(function() {
      // For some error in the code  modal show event is not firing - applying a manual delay before load
      //load values of a custom control
      //set delete action
      $('.btn-danger').on('click',function() {
        form.deleteCtrl();
       });
      //set create action
      $('.btn-primary').on('click', function(){

      });
    },300);

  },
    deleteCtrl: function() {
      if(window.confirm("Are you sure about this?")) {
        var ctrl_id = $("#theForm").find("[name=id]").val()
        console.log(ctrl_id);
        $("#"+ctrl_id).remove();
      }
  }


  
}

FormBuilder.fn.init.prototype = FormBuilder.fn;
