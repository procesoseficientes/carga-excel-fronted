window.onload=function(){



  var dict = { 
    "CODIGO SKU" : "codeSKU" , 
    "UNIDADES/FARDOS" : "packUnit", 
    "VENTA MINIMA": "lowLimit",
    "VENTA MAXIMA": "highLimit",
    "DESCUENTO": "discount",
    "TIPO DE DESCUENTO": "discountType",
    "CODIGO FAMILIA SKU": "codeFamilySku",
    "CODIGO SKU BONIFICADO":"codeSKUBonus",
    "UNIDADES/FARDOS BONIFIACION":"packUnitBonus",
    "CANTIDAD BONIFICADA":"bonusQTY",
    "MULTIPLO":"multiple"
  };

//inicializar tabla
  var descuentos = $('.mydatatable').DataTable({
    dataSrc:"",
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json" //Archivo de idioma
    }
  });

  var promoItems;

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
                  transformHeader: function(h){
                    console.log(`${h} : ${dict[h]}`)
                    return dict[h]
                  },
                  complete: function(e) {
                      console.log(e.data); //imprimir array con los datos en la consola
                      promoItems = e.data.slice(0,-1);
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
    formData.append('promoItems', JSON.stringify(promoItems))
    console.log(JSON.stringify(promoItems))
    
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
      case "BONUS_BY_SCALE":
        var route = "/bonusByScale"
        break;
      case "BONUS_BY_MULTIPLE":
        var route = "/bonusByMultiple"
        break;
      case "BONUS_BY_GENERAL_AMOUNT":
        var route = "/bonusByMultiple"
        break;  
    }
    $.ajax({
        url: `http://localhost:3000/discounts/${route}`,
        type: 'POST',
        data: formData,
        success: function (data, textStatus) {
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
          $("#modalTitle").html('Operación Exitosa!')
          $("#modalText").html(`Se insertaron ${data.length} filas a la promoción ${data[0].PROMO_ID}`)
          $("#modalFooter").html("<a data-dismiss='modal' class='btn btn-success'>Ok</a>")
          $("#myModal").modal('show')
        },
        error: function(xhr, textStatus){
          $("#btnSend").prop("disabled", false);
          $("#btnSend").html('Submit');
          $("#modalTitle").html('Ocurrió un error')
          $("#modalText").html(`${xhr.responseText}`)
          $("#modalFooter").html("<a data-dismiss='modal' class='btn btn-danger'>Cancel</a>")
          $("#myModal").modal('show')
        },
        cache: false,
        contentType: false,
        processData: false,
    });
  });

}