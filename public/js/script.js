window.onload=function(){



//inicializar tabla
  var descuentos = $('.mydatatable').DataTable({
    dataSrc:"",
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json" //Archivo de idioma
    }
  });

  var listSKUS;

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
                  header: true,
                  complete: function(e) {
                      console.log(e.data); //imprimir array con los datos en la consola
                      listSKUS = e.data.slice(0,-1);
                      const result = e.data.slice(0,-1).map(a => Object.values(a));
                      console.log(result);                      
                      descuentos.clear().draw(); //limpiar la tabla   
                      descuentos.rows.add(result).draw();  //mostrar datos en la tabla
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
    formData.append('promoItems', JSON.stringify(listSKUS))
    console.log(JSON.stringify(listSKUS))
    
    console.log(formData.get("promoType"))
    switch(formData.get("promoType")) {
      case "DISCOUNT_BY_GENERAL_AMOUNT":
        var route = "discountByGeneralAmount"
        break;
      case "DISCOUNT_BY_GENERAL_AMOUNT_AND_FAMILY":
        var route = "discountByFamily"
        break;
      case "DISCOUNT_BY_SCALE":
        var route = "discountByScale"
        break;
    }

    $.ajax({
        url: `http://localhost:3000/discounts/${route}`,
        type: 'POST',
        data: formData,
        success: function (data) {
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
          window.alert(JSON.stringify(data));
        },
        cache: false,
        contentType: false,
        processData: false,
    });
  });

}