window.onload=function(){

//inicializar tabla
  var descuentos = $('.mydatatable').DataTable({
    dataSrc:"",
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json" //Archivo de idioma
    }
  });

//Estilo y funcionamiento de boton de cargar archivo
  function bs_input_file() {
    $(".input-file").before(
      function () {
        if (!$(this).prev().hasClass('input-ghost')) {
          var element = $("<input id='load-csv' type='file' accept='.csv' class='input-ghost' style='visibility:hidden; height:0'>");
          element.attr("name", $(this).attr("name"));
          element.change(function (e) {
            element.next(element).find('input').val((element.val()).split('\\').pop());
            if (!e.target.files.length) {
              console.log("Please choose a csv file...");
              return
            }else{
              console.log("archivo");
              const file = e.target.files[0];
              Papa.parse(file, { //origin del archivo
                  download: true,
                  complete: function(example) {
                      console.log(example.data) //imprimir array con los datos en la consola
                      descuentos.clear().draw(); //limpiar la tabla   
                      descuentos.rows.add(example.data.slice(1,-2)).draw();  //mostrar datos en la tabla
                  }
              });
              $("#btnSend").prop("disabled", false);
              return
            }
          });
          $(this).find("button.btn-choose").click(function () {
            element.click();
          });
          $(this).find("button.btn-reset").click(function () {
            element.val(null);
            $(this).parents(".input-file").find('input').val('');
          });
          $(this).find('input').css("cursor", "pointer");
          $(this).find('input').mousedown(function () {
            $(this).parents('.input-file').prev().click();
            return false;
          });
          return element;
        }
      }
    );
  }
  $(function () {
    bs_input_file();
  });

  $("form#data").submit(function(e) {
    e.preventDefault();

    $("#btnSend").prop("disabled", true);
    // add spinner to button
    $("#btnSend").html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    );

    var formData = new FormData(this);

    $.ajax({
        url: 'http://localhost:3000/upload',
        type: 'POST',
        data: formData,
        success: function (data) {
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
        },
        cache: false,
        contentType: false,
        processData: false,
    });
  });

}